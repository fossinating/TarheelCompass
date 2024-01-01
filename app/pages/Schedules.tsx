"use client"
import { selectCurrentScheduleIndex, selectSchedules } from '@/lib/redux';
import ScheduleDisplay from '@/lib/ScheduleDisplay/ScheduleDisplay';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { useSelector } from 'react-redux';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

export default function PersistentDrawerRight() {
  const schedules = useSelector(selectSchedules);
  const currentScheduleIndex = useSelector(selectCurrentScheduleIndex);
  const [selectedClass, setSelectedClass] = React.useState<number|null>(null);

  //console.log(schedules);
  //console.log(currentScheduleIndex);
  
  //console.log(schedules[currentScheduleIndex]);

  if (schedules != undefined) {
    return (
      <Box id="schedulePageLayoutContainer" style={{height:"100%"}}>
        <ScheduleDisplay schedule={schedules[currentScheduleIndex]} selectedClass={selectedClass} setSelected={setSelectedClass}/>
        <Drawer>
          
        </Drawer>
      </Box>
    );
  } else {
    return (
      <Box id="schedulePageLayoutContainer" style={{height:"100%"}}>
        <CircularProgress />
      </Box>
    );
  }
}