"use client"
import { selectCurrentScheduleIndex, selectSchedules } from 'src/app/lib/redux';
import ScheduleDisplay from 'src/app/lib/ScheduleDisplay/ScheduleDisplay';
import { Button, CircularProgress } from '@mui/material';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import "./UserSchedules.css";

export default function UserSchedulesPage() {
  const schedules = useSelector(selectSchedules);
  const currentScheduleIndex = useSelector(selectCurrentScheduleIndex);
  const session = useSession();
  

  if (schedules === undefined) {
     return <CircularProgress/>
  } else if (schedules[currentScheduleIndex] == undefined) {
    return "schedules[currentScheduleIndex] is undefined, report this";
  } else if (schedules.length == 0) {
    return (
      <div id="no-schedules-prompt">
        <div className="box-title">No Schedules Found</div>
        <div className="box-content">
          <Button>Make your first schedule</Button>
          { session.status == "unauthenticated" ? <Button>Log in to view saved schedules</Button> : null }
        </div>
      </div>
    )
  } else {
    return (
      <ScheduleDisplay scheduleData={schedules[currentScheduleIndex]} />
    );
  }
}