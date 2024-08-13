import { useQuery } from '@apollo/client';
import { default as Add, default as AddIcon } from '@mui/icons-material/Add';
import CheckCircle from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RemoveIcon from '@mui/icons-material/Remove';
import ReportIcon from '@mui/icons-material/Report';
import WarningIcon from '@mui/icons-material/Warning';
import { CardContent, CircularProgress, Container, Divider, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { gql } from 'src/__generated__';
import CreateScheduleDialog from './CreateScheduleDialog';
import { titleCase } from './Common';
import { addClass, removeClass, Schedule, selectCurrentScheduleIndex, selectSchedules } from './redux';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

function human_time(mil_time: string) {
  if (mil_time.includes("TBA")) {
    return mil_time;
  }
  let times = mil_time.split(" - ");
  if (times.length != 2) {
    throw new Error("Invalid time value");
  }
  let human_times = [];
  for (let time of times) {
    let hour = parseInt(time.substring(0, 2));
    let minute = parseInt(time.substring(3));
    if (hour > 11) {
      human_times.push(`${((hour - 1) % 12) + 1}:${minute.toString().padStart(2, "0")}pm`);
    } else {
      human_times.push(`${hour}:${minute.toString().padStart(2, "0")}am`);
    }
  }
  return human_times.join(" - ");
}


export interface ClassDisplayInfo {
  classNumber: number;
  term: string;
  course: {
    code: string;
    description?: string | null | undefined;
  }
  classSection: string;
  title: string;
  enrollmentTotal?: number | null | undefined;
  enrollmentCap?: number | null | undefined;
  lastUpdatedAt: Date;
  schedules: Array<{
    building?: string | null | undefined;
    room?: string | null | undefined;
    instructors: Array<{
      name: string;
    }>
    days: string;
    startTime?: number | null | undefined;
    endTime?: number | null | undefined;
  }>
  units: string;
}

const GET_CLASSES_SCHEDULE_DATA = gql(`
  query GetClassSchedules($class_numbers: [Int!]!, $term: String!) {
    classes(classNumbers: $class_numbers, term: $term) {
      classNumber,
      schedules {
        days,
        startTime,
        endTime
      }
    }
  }
`);

function ScheduleAdder(props: {classInfo: ClassDisplayInfo, schedule: Schedule, close: Function}) {
  const [hasConflict, setHasConflict] = React.useState(false);
  const [inSchedule, setInSchedule] = React.useState(false);
  const dispatch = useDispatch();

  const handleClick = () => {
    if (inSchedule) {
      dispatch(removeClass({classNumber: props.classInfo.classNumber, scheduleID: props.schedule.id}))
    } else {
      dispatch(addClass({classNumber: props.classInfo.classNumber, scheduleID: props.schedule.id}))
    }
  }

  const { loading, error, data } = useQuery(GET_CLASSES_SCHEDULE_DATA, {
    variables: {class_numbers: props.schedule.classNumbers, term: props.classInfo.term}
  });

  // Update the inSchedule and hasConflict on every update of the schedule (or class info, but that shouldn't change)
  React.useEffect(() => {
    // Setup the function that gets called below
    // Using this to allow for early returns
    const updateState = () => {
      if (data) {
        // Go through every schedule for this class(referring to them as blockSchedule for some reason)
        for (let blockSchedule of props.classInfo.schedules){
          // If the startTime or endTime are undefined, skip this (block)schedule since there are no conflicts that could be found from this anyways.
          if (!!!blockSchedule.startTime || !!!blockSchedule.endTime) {
            break;
          }


          // Convert the days string to an array of indices
          // We remove all of the "T"s so we can reduce all days down to a single letter
          const dayIndices: { [key: string]: number } = {
            'M': 0,
            'u': 1, // Would be "Tu"
            'W': 2,
            'h': 3, // Would be "Th"
            'F': 4
          };

          const blockDays = new Set(blockSchedule.days.replaceAll("T", "").split('').map(day => dayIndices[day]));
          for (let element of data.classes) {
            if (element.classNumber === props.classInfo.classNumber) {
              setInSchedule(true);
              return;
            }

            for (let schedule of element.schedules) {
              if (!!!schedule.startTime || !!!schedule.endTime) {
                break;
              }

              // Check if there is overlap on the time, ignoring day to begin
              // Doing this first because I believe comparing integers 4 times is faster than the set search
              // This checks if either the start or end times of the schedule is between the start and end times of blockSchedule
              if ((blockSchedule.startTime >= schedule.startTime && blockSchedule.startTime <= schedule.endTime) || 
                  (blockSchedule.startTime >= schedule.endTime && blockSchedule.endTime <= schedule.endTime)) {
                const scheduleDays = new Set(schedule.days.replaceAll("T", "").split('').map(day => dayIndices[day]));

                // I'm going to be honest I think I took this from ChatGPT and I have no clue how this works
                // But I believe it is (supposed to) check if any of the days from blockDays is inside scheduleDays
                // Basically meaning that it checks if blockSchedule and schedule share days
                if ([...blockDays].some(day => scheduleDays.has(day))) {
                  // At this point the time overlaps and day overlaps, meaning there is conflict!
                  setHasConflict(true);
                  return;
                }
              }
            }
          }
        }
      }

      setHasConflict(false);
      setInSchedule(false);
    }
    
    updateState();
    
  }, [data, props.classInfo.classNumber, props.classInfo.schedules])

  return (
  <MenuItem onClick={handleClick} key={props.schedule.id}>
    <ListItemIcon>
      { loading ? <CircularProgress /> :
        error ? <Tooltip title="Failed to load class data for schedule"><ErrorIcon color='error'/></Tooltip> :
        inSchedule ? <CheckCircle color="success" /> :
        hasConflict ? <Tooltip title="Conflicts with schedule"><WarningIcon color='warning'/></Tooltip> :
        <Add />
      }
    </ListItemIcon>
    {props.schedule.name}
  </MenuItem>
  )
}


export default function ClassDisplay(props: { classInfo: ClassDisplayInfo }) {
  const [expanded, setExpanded] = React.useState(false);
  const [inSchedule, setInSchedule] = React.useState(false);
  const schedules = useSelector(selectSchedules);
  const currentScheduleIndex = useSelector(selectCurrentScheduleIndex);

  const [hasConflict, setHasConflict] = React.useState(false);

  const [schedulesInTerm, setSchedulesInTerm] = React.useState<Array<Schedule>>([]);

  React.useEffect(() => {
    if (inSchedule) {
      setHasConflict(false);
    }

    let inTerm: Array<Schedule> = [];

    schedules.forEach(schedule => {
      if (schedule.term === props.classInfo.term) {
        inTerm.push(schedule)
      }
    });

    setSchedulesInTerm(inTerm);
  }, [inSchedule, schedules, currentScheduleIndex, props.classInfo.term])

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  /*const handleAddClick = () => {
    setInSchedule(!inSchedule);
    if (!inSchedule) {
      systemSlice.actions.addClass({classNumber: props.classInfo.classNumber, scheduleID: schedules[currentScheduleIndex].id});
    } else {
      systemSlice.actions.removeClass({classNumber: props.classInfo.classNumber, scheduleID: schedules[currentScheduleIndex].id});
    }
  }*/

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const addMenuOpen = Boolean(anchorEl);
  const handleAddClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [createScheduleOpen, setCreateScheduleOpen] = React.useState(false);
  const handleCreateScheduleClick = () => {
    setCreateScheduleOpen(true);
  }

  const handleCloseCreateScheduleDialog = () => {
    setCreateScheduleOpen(false);
  }

  const stringifyTime = (startTime?: number | null | undefined, endTime?: number | null | undefined) => {
    if (!!!startTime || !!!endTime) {
      return "TBA";
    }
    return (
      <>
        {(Math.floor(startTime / 60) - 1) % 12 + 1}:{(startTime%60).toString().padStart(2, "0")} {startTime >= 13*60 ? "PM" : "AM"} - 
        {(Math.floor(endTime / 60) - 1) % 12 + 1}:{(endTime%60).toString().padStart(2, "0")} {endTime >= 13*60 ? "PM" : "AM"}
      </>
    )
  }

  return (
    <Card className="classDisplay" sx={{ width: 300 }}>
      <CardHeader
        title={props.classInfo.course.code + "-" + props.classInfo.classSection}
        subheader={props.classInfo.title}
        action={
          <Container disableGutters>
            { hasConflict ? <Tooltip title="Conflicts with your schedule">
              <WarningIcon color='warning'/>
            </Tooltip> : null}
            

            { props.classInfo.enrollmentTotal==props.classInfo.enrollmentCap ? 
            <Tooltip title={"Full as of " + props.classInfo.lastUpdatedAt.toLocaleString()}>
              <ReportIcon  color='error'/>
            </Tooltip> : null }
          </Container>}
      />
      <CardContent>
        {props.classInfo.schedules.map((schedule) => 
          <div key={schedule.days + schedule.startTime}>
            <Typography variant="body1" color="text.secondary" key={schedule.days + schedule.startTime}>
              {schedule.days} {stringifyTime(schedule.startTime, schedule.endTime)}
            </Typography>
            <Typography variant="body1" color="text.secondary">{schedule.instructors.map((instructor) => titleCase(instructor.name.split(",").reverse().join(" "))).join(", ")}</Typography>
            
          </div>
        )}
        <Typography variant="body2" color="text.secondary">{props.classInfo.units} credit hours</Typography>
        
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="Add to schedule" onClick={handleAddClick}>
          {inSchedule ? <RemoveIcon /> : <AddIcon />}
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="Show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="body1" color="text.secondary">{props.classInfo.course.description}</Typography>
          <Typography variant="body2" color="text.secondary">Class Registration Number: {props.classInfo.classNumber}</Typography>
        </CardContent>
      </Collapse>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={addMenuOpen}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          { schedulesInTerm.length > 0 ? schedules.map((schedule) => 
            <ScheduleAdder key={schedule.id} schedule={schedule} classInfo={props.classInfo} close={handleClose} ></ScheduleAdder>
          ) :
            <MenuItem key="noSchedules" disabled>
              No schedules for this term.
            </MenuItem>
            
          }
          {}
          <Divider />
          <MenuItem onClick={handleCreateScheduleClick}>
            <ListItemIcon>
              <Add fontSize="small" />
            </ListItemIcon>
            <ListItemText>Create new schedule</ListItemText>
          </MenuItem>
        </Menu>
        <CreateScheduleDialog open={createScheduleOpen} onClose={handleCloseCreateScheduleDialog} />
    </Card>
  );
}