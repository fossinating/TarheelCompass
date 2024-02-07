"use client"
import { useLazyQuery } from "@apollo/client";
import { Card, CardActionArea, CardContent, CircularProgress, IconButton, Typography } from "@mui/material";
import * as React from 'react';
import { gql } from "src/__generated__";
import { readableTime, titleCase } from "../Common";
import { Schedule } from '../redux';
import "./ScheduleDisplay.css";
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';

/*
  Class Card

  Hook for displaying a single class section instance, with all the most important information


*/
function ClassCard(props: {classData: {course: {code: string}, classSection: string, title: string, hours: number}, schedule: {location: string, instructors: Array<{name: string}>, startTime: number, endTime: number}, classIndex: number, classCount: number, setSelectedClass?: (index: number) => void }) {
  return (
    <Card className="class-card" style={{gridRow: ((props.schedule.startTime - 480) / 5).toString() + "/" + ((props.schedule.endTime - 480) / 5).toString(), backgroundColor: "hsl(" + Math.round(360*(props.classIndex/(props.classCount))) + " 80% 80%)"}}>
      <CardActionArea onClick={props.setSelectedClass !== undefined ? () => (props.setSelectedClass as (index: number) => void)(props.classIndex) : undefined}>
        <CardContent style={{padding: "4px"}}>
          <Typography variant="h6" component="div">
            {props.classData.course.code} - {props.classData.classSection}
          </Typography>
          <Typography sx={{ mb: .5 }} color="text.secondary">
            {props.schedule.location}
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

export default function ScheduleDisplay(props: {scheduleData: {classNumbers: Array<number>, term: string, name?: string}, showSidebar?: boolean, editable?: boolean}) {
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
        location,
        instructors {
          name
        }
        days,
        startTime,
        endTime
      },
      hours
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
      location,
      instructors {
        name
      }
      days,
      startTime,
      endTime
    },
    enrollmentTotal,
    enrollmentCap,
    hours,
    lastUpdatedAt
  }
}
`)

  const [selectedClass, setSelectedClass] = React.useState<number>(-1);
  const [sidebarExpanded, setSidebarExpanded] = React.useState<boolean>(false);

  const [earliestDay, setEarliestDay] = React.useState<number>(1);
  const [daysShown, setDaysShown] = React.useState<number>(1);

  // Swipe code ! (stolen from https://stackoverflow.com/questions/70612769/how-do-i-recognize-swipe-events-in-react)

  const touchStart = React.useRef<null|number>(null)
  const touchEnd = React.useRef<null|number>(null)

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50 

  const onTouchStart = (event: React.TouchEvent) => {
    touchEnd.current = (null) // otherwise the swipe is fired even with usual touch events
    touchStart.current = (event.targetTouches[0].clientX)
  }

  const onTouchMove = (event: React.TouchEvent) => touchEnd.current = (event.targetTouches[0].clientX)

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return
    const distance = touchStart.current - touchEnd.current
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) {
      setEarliestDay(Math.min(earliestDay + 1, 7-daysShown))
    } else if (isRightSwipe) {
      setEarliestDay(Math.max(earliestDay - 1, 0))
    }
    // add your conditional logic here
  }

  const sidebarExpandClick = () => {
    setSidebarExpanded(!sidebarExpanded);
  }

  // Hook for this graphql query, done lazily so we can call it multiple times as schedule changes
  const [ getClasses, { loading, error, data }] = useLazyQuery(props.showSidebar ? GET_CLASSES_FULL : GET_CLASSES);
  // Hook for the split of each day's worth of classes
  const [dayClasses, setDayClasses] = React.useState<Array<Array<JSX.Element>>>(Array(7).fill([]));

  // Call the graphql query whenever the schedule updates
  // I should be making this more efficient at some point and not be totally reliant on caching from the graphql library I'm using
  React.useEffect(() => {
    if (props.scheduleData) {
      getClasses({variables: {class_numbers: props.scheduleData.classNumbers, term: props.scheduleData.term}})
    }
  }, [props.scheduleData])

  const dayIndices = ["Su", "M", "Tu", "W", "Th", "F", "Sa"]
  const dayStrings = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]


  // Effect for when data returns from the graphql query
  React.useEffect(() => {
    const newDayClasses: Array<Array<JSX.Element>> = [];
    for (let i = 0; i < 7; i++) {
      newDayClasses.push([]);
    }

    let classCount = 0;
    data?.classes.forEach((classData) => {
      classData.schedules.forEach((classSchedule) => {
        for (let i = 0; i < classSchedule.days.length; i++) {
          let dayCode = classSchedule.days.substring(i, i+1)
          // Daycode is just M Tu W Th F Sa Su
          // Not actually sure how Saturday/Sunday might be indicated, I think only Saturday is used with S
          if (dayCode === "T" || dayCode === "S") {
            // Edge case of Tu/Th or Sa/Su
            dayCode = classSchedule.days.substring(i, i+2);
            i++; // skip ahead one index so as to not double process the u / h
          }
          console.log(newDayClasses, dayCode)
          //console.log("jj", classCount, data.classes.length)
          // Create a new class card entry and shove it into the day assigned by the daycode
          newDayClasses[dayIndices.indexOf(dayCode)].push(
            props.showSidebar ? 
              <ClassCard classData={classData} schedule={classSchedule} classIndex={classCount} classCount={data.classes.length} setSelectedClass={setSelectedClass}></ClassCard> :
              <ClassCard classData={classData} schedule={classSchedule} classIndex={classCount} classCount={data.classes.length}></ClassCard>)
        }
      })
      classCount++;
    })
    setDayClasses(newDayClasses);
  }, [data])


  if (loading) {
    return (<CircularProgress />)
  } else {
    return (
      <div className="schedule-container">
        <div className="schedule-box">
          <div className={"schedule " + (daysShown == 1 ? "one-day" : daysShown == 3 ? "three-day" : daysShown == 5 ? "five-day" : "seven-day")}
             onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
            <div className="hour-labels">
              <div className="spacer" />
              {
                [...Array(14).keys()].map((hour) => 
                    <div key={hour} className="hour-label">{ ((hour + 8 - 1) % 12 + 1).toString() + ((hour + 8) > 11 ? " PM" : " AM") }</div>
                )
              }
            </div>
            <div className="days">
              { [...Array(daysShown).keys()].map((dayIndex) => 
                <div className={"day " + dayStrings[earliestDay+dayIndex]} key={dayIndex}>
                  <div className="date">{dayStrings[earliestDay+dayIndex]}</div>
                  <div className="classes">{dayClasses[earliestDay+dayIndex]}</div>
                </div>
              )}
            </div>
          </div>
      </div>
      {
        props.showSidebar ?
        <div className={"schedule-sidebar" + (sidebarExpanded ? " expanded" : "")}>
          <Typography className="schedule-name">Schedule Name</Typography>
          <Typography className="schedule-semester">Spring 2024</Typography>
          <IconButton className="sidebar-expand-btn" onClick={sidebarExpandClick}>
            <ExpandCircleDownIcon />
          </IconButton>
        </div>
        : null
      }
      
    </div>
  );
  }
}