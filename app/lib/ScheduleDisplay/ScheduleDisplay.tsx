"use client"
import "./ScheduleDisplay.css"
import * as React from 'react';
import { Schedule } from '../redux';
import { gql } from "src/__generated__";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Card, CardContent, Typography } from "@mui/material";
import { titleCase } from "../Common";

function ClassSlot(props: {classData: {course: {code: string}, classSection: string, title: string, hours: number}, schedule: {location: string, instructors: Array<{name: string}>, startTime: number, endTime: number}, classIndex: number, classCount: number}) {
  console.log(props.classIndex, props.classCount)
  return (
    <Card style={{gridRow: ((props.schedule.startTime - 480) / 5).toString() + "/" + ((props.schedule.endTime - 480) / 5).toString(), backgroundColor: "hsl(" + Math.round(360*(props.classIndex/(props.classCount))) + " 80% 80%)"}}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {props.classData.title}
        </Typography>
        <Typography variant="h5" component="div">
          {props.classData.course.code} - {props.classData.classSection}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {props.schedule.location}
        </Typography>
        <Typography variant="body2">
          {props.schedule.instructors.map((instructor) => titleCase(instructor.name.split(",").reverse().join(" "))).join(", ")}
        </Typography>
      </CardContent>
    </Card>
  )
}



export default function ScheduleDisplay(props: {schedule: Schedule, editable?: boolean, selectedClass: number|null, setSelected?: (classNumber: number|null) => void}) {
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

  const [ getClasses, { loading, error, data }] = useLazyQuery(GET_CLASSES);
  const [dayClasses, setDayClasses] = React.useState<Array<Array<JSX.Element>>>(Array(5).fill([]));

  React.useEffect(() => {
    if (props.schedule) {
      getClasses({variables: {class_numbers: props.schedule.classNumbers, term: props.schedule.term}})
    }
  }, [props.schedule])

  const dayIndices = ["M", "Tu", "W", "Th", "F"]

  React.useEffect(() => {
    const newDayClasses: Array<Array<JSX.Element>> = [];
    for (let i = 0; i < 5; i++) {
      newDayClasses.push([]);
    }

    let classCount = 0;
    data?.classes.forEach((classData) => {
      classData.schedules.forEach((classSchedule) => {
        for (let i = 0; i < classSchedule.days.length; i++) {
          let dayCode = classSchedule.days.substring(i, i+1)
          if (dayCode === "T") {
            dayCode = classSchedule.days.substring(i, i+2);
            i++;
          }
          console.log(classSchedule, dayCode, i)
          console.log("jj", classCount, data.classes.length)
          newDayClasses[dayIndices.indexOf(dayCode)].push(<ClassSlot classData={classData} schedule={classSchedule} classIndex={classCount} classCount={data.classes.length}></ClassSlot>)
        }
      })
      classCount++;
    })
    setDayClasses(newDayClasses);
  }, [data])

  return (
    <div id="schedule-container">
        <div id="schedule">
            <h2 className="day-indicator" style={{gridColumn: "2/3"}}>Monday</h2>
            <h2 className="day-indicator" style={{gridColumn: "3/4"}}>Tuesday</h2>
            <h2 className="day-indicator" style={{gridColumn: "4/5"}}>Wednesday</h2>
            <h2 className="day-indicator" style={{gridColumn: "5/6"}}>Thursday</h2>
            <h2 className="day-indicator" style={{gridColumn: "6/7"}}>Friday</h2>
            {
                [...Array(14).keys()].map((hour) => 
                    <h2 className="hour-indicator" style={{gridRow: (hour * 12 + 2).toString() + "/" + (hour * 12 + 3).toString()}}>{ ((hour + 8 - 1) % 12 + 1).toString() + ((hour + 8) > 11 ? " PM" : " AM") }</h2>
                )
            }
            <div className="hour-background"></div>
            
            <div id="monday" className="day-schedule">{dayClasses[0]}</div>
            <div id="tuesday" className="day-schedule">{dayClasses[1]}</div>
            <div id="wednesday" className="day-schedule">{dayClasses[2]}</div>
            <div id="thursday" className="day-schedule">{dayClasses[3]}</div>
            <div id="friday" className="day-schedule">{dayClasses[4]}</div>
        </div>
    </div>
  );
}