"use client"
import { useLazyQuery } from "@apollo/client";
import { Card, CardActionArea, CardContent, CircularProgress, Typography } from "@mui/material";
import * as React from 'react';
import { gql } from "src/__generated__";
import { readableTime, titleCase } from "../Common";
import { Schedule } from '../redux';
import "./ScheduleDisplay.css";


/*
  Class Card

  Hook for displaying a single class section instance, with all the most important information


*/
function ClassCard(props: {classData: {course: {code: string}, classSection: string, title: string, hours: number}, schedule: {location: string, instructors: Array<{name: string}>, startTime: number, endTime: number}, classIndex: number, classCount: number, setSelectedClass?: (index: number) => void }) {
  return (
    <Card style={{gridRow: ((props.schedule.startTime - 480) / 5).toString() + "/" + ((props.schedule.endTime - 480) / 5).toString(), backgroundColor: "hsl(" + Math.round(360*(props.classIndex/(props.classCount))) + " 80% 80%)"}}>
      <CardActionArea onClick={props.setSelectedClass !== undefined ? () => (props.setSelectedClass as (index: number) => void)(props.classIndex) : undefined}>
        <CardContent>
          <Typography variant="h5" component="div">
            {props.classData.course.code} - {props.classData.classSection}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {props.schedule.location}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
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

  // Hook for this graphql query, done lazily so we can call it multiple times as schedule changes
  const [ getClasses, { loading, error, data }] = useLazyQuery(props.showSidebar ? GET_CLASSES_FULL : GET_CLASSES);
  // Hook for the split of each day's worth of classes
  const [dayClasses, setDayClasses] = React.useState<Array<Array<JSX.Element>>>(Array(7).fill([]));

  // Call the graphql query whenever the schedule updates
  // I should be making this more efficient at some point and not be totally reliant on caching from the graphql library I'm using
  React.useEffect(() => {
    console.log("hello", props.scheduleData);
    if (props.scheduleData) {
      getClasses({variables: {class_numbers: props.scheduleData.classNumbers, term: props.scheduleData.term}})
    }
  }, [props.scheduleData])

  const dayIndices = ["Su", "M", "Tu", "W", "Th", "F", "Sa"]


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
          //console.log(classSchedule, dayCode, i)
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
      <div id="schedule-container">
        <div id="schedule">
          <h2 className="day-indicator" style={{gridColumn: "2/3"}}>Sunday</h2>
          <h2 className="day-indicator" style={{gridColumn: "3/4"}}>Monday</h2>
          <h2 className="day-indicator" style={{gridColumn: "4/5"}}>Tuesday</h2>
          <h2 className="day-indicator" style={{gridColumn: "5/6"}}>Wednesday</h2>
          <h2 className="day-indicator" style={{gridColumn: "6/7"}}>Thursday</h2>
          <h2 className="day-indicator" style={{gridColumn: "7/8"}}>Friday</h2>
          <h2 className="day-indicator" style={{gridColumn: "8/9"}}>Saturday</h2>
          {
              [...Array(14).keys()].map((hour) => 
                  <h2 key={hour} className="hour-indicator" style={{gridRow: (hour * 12 + 2).toString() + "/" + (hour * 12 + 3).toString()}}>{ ((hour + 8 - 1) % 12 + 1).toString() + ((hour + 8) > 11 ? " PM" : " AM") }</h2>
              )
          }
          <div className="hour-background"></div>
          
          <div id="saturday" className="day-schedule">{dayClasses[0]}</div>
          <div id="monday" className="day-schedule">{dayClasses[1]}</div>
          <div id="tuesday" className="day-schedule">{dayClasses[2]}</div>
          <div id="wednesday" className="day-schedule">{dayClasses[3]}</div>
          <div id="thursday" className="day-schedule">{dayClasses[4]}</div>
          <div id="friday" className="day-schedule">{dayClasses[5]}</div>
          <div id="sunday" className="day-schedule">{dayClasses[6]}</div>
      </div>
      {
        props.showSidebar ?
        <div id="scheduleSidebar">
          
        </div>
        : null
      }
      
    </div>
  );
  }
}