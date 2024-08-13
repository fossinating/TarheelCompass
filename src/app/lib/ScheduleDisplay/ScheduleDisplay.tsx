"use client"
import { useLazyQuery } from "@apollo/client";
import { Card, CardActionArea, CardContent, CircularProgress, IconButton, Typography } from "@mui/material";
import * as React from 'react';
import { gql } from "src/__generated__";
import { readableTime, titleCase } from "../Common";
import styles from "./ScheduleDisplay.module.css";
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import { removeClass, Schedule } from '../redux';

/*
  Class Card

  Hook for displaying a single class section instance, with all the most important information


*/
function ClassCard(props: { classData: { course: { code: string }, classSection: string, title: string, units: string }, schedule: { building?: string | null | undefined, room?: string | null | undefined, instructors: Array<{ name: string }>, startTime?: number | null | undefined, endTime?: number | null | undefined }, classIndex: number, classCount: number, setSelectedClass?: (index: number) => void }) {
  // Check if either startTime or endTime is undefined/null, return null in that case(there shouldn't be any card for this schedule)
  if (!!!props.schedule.startTime || !!!props.schedule.endTime) {
    return null;
  }
  return (
    <Card className={styles.classCard} style={{ gridRow: ((props.schedule.startTime - 480) / 5).toString() + "/" + ((props.schedule.endTime - 480) / 5).toString(), backgroundColor: "hsl(" + Math.round(360 * (props.classIndex / (props.classCount))) + " 80% 80%)" }}>
      <CardActionArea onClick={props.setSelectedClass !== undefined ? () => (props.setSelectedClass as (index: number) => void)(props.classIndex) : undefined}>
        <CardContent style={{ padding: "4px" }}>
          <Typography variant="h6" component="div">
            {props.classData.course.code} - {props.classData.classSection}
          </Typography>
          <Typography sx={{ mb: .5 }} color="text.secondary">
            {(props.schedule.building && props.schedule.room) ? (props.schedule.building + " " + props.schedule.room) : "Unknown location"}
          </Typography>
          <Typography sx={{ mb: .5 }} color="text.secondary">
            {readableTime(props.schedule.startTime)} - {readableTime(props.schedule.endTime)}
          </Typography>
        </CardContent>
      </CardActionArea>

    </Card>
  )
}


/*
  Schedule Display

  Hook for displaying a schedule, with option to allow selection of classes
*/

export default function ScheduleDisplay(props: { scheduleData: Schedule, showSidebar?: boolean, editable?: boolean }) {
  // GraphQL query to get the classes from the schedule, with information required for schedule display
  const GET_CLASSES = gql(`
  query GetScheduleDisplayClasses($class_numbers: [Int!]!, $term: String!) {
    classes(classNumbers: $class_numbers, term: $term) {
      classNumber,
      course {
        code
      },
      classSection,
      title,
      schedules {
        building,
        room,
        instructors {
          name
        }
        days,
        startTime,
        endTime
      },
      units
    }
  }
`)
  const GET_CLASSES_FULL = gql(`
query GetFullScheduleDisplayClasses($class_numbers: [Int!]!, $term: String!) {
  classes(classNumbers: $class_numbers, term: $term) {
    classNumber,
    course {
      code,
      description
    },
    classSection,
    title,
    schedules {
      building,
      room,
      instructors {
        name
      }
      days,
      startTime,
      endTime
    },
    enrollmentTotal,
    enrollmentCap,
    units,
    lastUpdatedAt
  }
}
`)

  const [selectedClass, setSelectedClass] = React.useState<number>(-1);
  const [expandedDetails, setExpandedDetails] = React.useState<boolean>(false);

  const [earliestDay, setEarliestDay] = React.useState<number>(1);
  const [daysShown, setDaysShown] = React.useState<number>(5);

  const [credits, setCredits] = React.useState("unknown");

  // Swipe code ! (stolen from https://stackoverflow.com/questions/70612769/how-do-i-recognize-swipe-events-in-react)

  const touchStart = React.useRef<null | number>(null)
  const touchEnd = React.useRef<null | number>(null)

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50

  const onTouchStart = (event: React.TouchEvent) => {
    touchEnd.current = (null) // otherwise the swipe is fired even with usual touch events
    touchStart.current = (event.targetTouches[0] ? event.targetTouches[0].clientX : null)
  }

  const onTouchMove = (event: React.TouchEvent) => touchEnd.current = (event.targetTouches[0] ? event.targetTouches[0].clientX : null)

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return
    const distance = touchStart.current - touchEnd.current
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) {
      setEarliestDay(Math.min(earliestDay + 1, 7 - daysShown))
    } else if (isRightSwipe) {
      setEarliestDay(Math.max(earliestDay - 1, 0))
    }
    // add your conditional logic here
  }

  const expandDetailsClick = () => {
    setExpandedDetails(!expandedDetails);
  }

  // Hook for this graphql query, done lazily so we can call it multiple times as schedule changes
  const [getClasses, { loading, error, data }] = useLazyQuery(props.showSidebar ? GET_CLASSES_FULL : GET_CLASSES);
  // Hook for the split of each day's worth of classes
  const [dayClasses, setDayClasses] = React.useState<Array<Array<JSX.Element>>>(Array(7).fill([]));

  // Call the graphql query whenever the schedule updates
  // I should be making this more efficient at some point and not be totally reliant on caching from the graphql library I'm using
  React.useEffect(() => {
    if (props.scheduleData) {
      getClasses({ variables: { class_numbers: props.scheduleData.classNumbers, term: props.scheduleData.term } })
    }
  }, [props.scheduleData, getClasses])

  const dayStrings = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const dispatch = useDispatch();


  // Effect for when data returns from the graphql query
  React.useEffect(() => {
    const dayIndices = ["Su", "M", "Tu", "W", "Th", "F", "Sa"]


    const newDayClasses: Array<Array<JSX.Element>> = [];
    for (let i = 0; i < 7; i++) {
      newDayClasses.push([]);
    }

    let minCredits = 0;
    let maxCredits = 0;
    let creditsUncertain = false; // I dont know if there's a 
    let classCount = 0;
    data?.classes.forEach((classData) => {
      // Get credit/unit information
      if (classData.units.includes("-")) {
        let splitCredits = classData.units.split("-")
        if (splitCredits && splitCredits.length == 2) {
          minCredits += Number(splitCredits[0] as string)
          maxCredits += Number(splitCredits[1] as string) 
          // TODO: Ignore credit hours from any class that only exists in the pdf
        }
      } else {
        if (Number(classData.units)){
          minCredits += Number(classData.units)
          maxCredits += Number(classData.units)
        } else {
          creditsUncertain = true;
        }
      }
      classData.schedules.forEach((classSchedule) => {
        if (classSchedule === undefined) {
          return;
        }
        for (let i = 0; i < classSchedule.days.length; i++) {
          let dayCode = classSchedule.days.substring(i, i + 1)
          // Daycode is just M Tu W Th F Sa Su
          // Not actually sure how Saturday/Sunday might be indicated, I think only Saturday is used with S
          if (dayCode === "T" || dayCode === "S") {
            // Edge case of Tu/Th or Sa/Su
            dayCode = classSchedule.days.substring(i, i + 2);
            i++; // skip ahead one index so as to not double process the u / h
          }
          console.log(newDayClasses, dayCode)
          //console.log("jj", classCount, data.classes.length)
          // Create a new class card entry and shove it into the day assigned by the daycode

          newDayClasses[dayIndices.indexOf(dayCode)]?.push(
            <ClassCard classData={classData} schedule={classSchedule} classIndex={classCount} classCount={data.classes.length} setSelectedClass={props.showSidebar ? setSelectedClass : undefined}></ClassCard>
          )}
      })
      classCount++;
    })
    setDayClasses(newDayClasses);

    setCredits(minCredits != maxCredits ? (minCredits + " - " + maxCredits) : (minCredits + (creditsUncertain ? "+" : "")));
  }, [data, props.showSidebar])

  if (props.scheduleData === undefined) {
    return (<h1>Invalid Schedule!</h1>)
  } else if (loading) {
    return (<CircularProgress />)
  } else {
    return (
      <div className={styles.scheduleContainer + (expandedDetails ? " " + styles.expandedDetails : "")}>
        <div className={styles.scheduleBox}>
          <div className={styles.schedule + " " + (daysShown == 1 ? styles.oneDay : daysShown == 3 ? styles.threeDay : daysShown == 5 ? styles.fiveDay : styles.sevenDay)}
            onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
            <div className={styles.hourLabels}>
              <div className={styles.spacer} />
              {
                [...Array(14).keys()].map((hour) =>
                  <div key={hour} className={styles.hourLabel}>{((hour + 8 - 1) % 12 + 1).toString() + ((hour + 8) > 11 ? " PM" : " AM")}</div>
                )
              }
            </div>
            <div className={styles.days}>
              {[...Array(daysShown).keys()].map((dayIndex) =>
                <div className={styles.day + " " + dayStrings[earliestDay + dayIndex]} key={dayIndex}>
                  <div className={styles.date}>{dayStrings[earliestDay + dayIndex]}</div>
                  <div className={styles.classes}>{dayClasses[earliestDay + dayIndex]}</div>
                </div>
              )}
            </div>
          </div>
        </div>
        {
          props.showSidebar ?
            <div className={styles.scheduleDetailsBox}>
              <div className={styles.scheduleDetailsTopbar}>
                <span className={styles.scheduleName}>{props.scheduleData.name}</span>
                <span className={styles.scheduleSemester}>{props.scheduleData.term}</span>
                <IconButton className={styles.detailsExpandBtn} onClick={expandDetailsClick}>
                  <ExpandCircleDownIcon />
                </IconButton>
              </div>
              {selectedClass == -1 ?
                <div className={styles.scheduleDetails}>
                  <div className={styles.scheduleStats}>
                    <span className={styles.statName}>Credits: </span>
                    <span className={styles.statData}>{credits}</span>
                  </div>
                  <div className={styles.scheduleClassListBox}>
                    <div className={styles.scheduleClassListTitle}>Classes:</div>
                    <div className={styles.scheduleClassList}>
                      {data?.classes && data.classes.length > 0 ? data?.classes.map((classData) => <div key={classData.classNumber} className={styles.scheduleClassListing}>
                        <div className={styles.scheduleClassName}>{classData.course.code} - {classData.classSection}</div>
                        <IconButton className={styles.deleteClassButton} onClick={() => dispatch(removeClass({classNumber: classData.classNumber, scheduleID: props.scheduleData.id}))}>
                          <DeleteIcon />
                        </IconButton>
                      </div>) : "This schedule is empty"}
                    </div>
                  </div>
                </div> :
                <div className={styles.classDetails}>


                </div>
              }

            </div>
            : null
        }

      </div>
    );
  }
}