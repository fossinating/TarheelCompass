"use client"
import { selectCurrentScheduleIndex, selectSchedules } from 'src/app/lib/redux';
import ScheduleDisplay from 'src/app/lib/ScheduleDisplay/ScheduleDisplay';
import { Button, CircularProgress } from '@mui/material';
import { signIn, useSession } from 'next-auth/react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import styles from "./UserSchedules.module.css";
import { useState } from 'react';
import CreateScheduleDialog from '../lib/CreateScheduleDialog';

function NoSchedulesPage() {
  const session = useSession();
  const [createScheduleVisible, setCreateScheduleVisible] = useState(false);

  const showCreateSchedule = () => {
    setCreateScheduleVisible(true);
  }

  const createScheduleClosed = () => {
    // It automatically paths to the new schedule, so we don't need to do anything here
  }

  return (
    <div className={styles.no_schedules_prompt}>
      <div className={styles.box_title}>No Schedules Found</div>
      <div className={styles.box_content}>
        <Button onClick={showCreateSchedule}>Make your first schedule</Button>
        { session.status == "unauthenticated" ? <Button onClick={() => signIn()}>Log in to view saved schedules</Button> : null }
      </div>
      <CreateScheduleDialog open={createScheduleVisible} onClose={createScheduleClosed} />
    </div>
  )
}

export default function UserSchedulesPage() {
  const schedules = useSelector(selectSchedules);
  const currentScheduleIndex = useSelector(selectCurrentScheduleIndex);
  const session = useSession();
  

  if (schedules === undefined) {
     return <CircularProgress/>
  } else if (schedules.length == 0) {
    return <NoSchedulesPage/>
  } else if (schedules[currentScheduleIndex] == undefined) {
    return "schedules[currentScheduleIndex] is undefined, report this";
  } else {
    return (
      <ScheduleDisplay scheduleData={schedules[currentScheduleIndex]} showSidebar={true} editable={true}/>
    );
  }
}