import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SectionData } from '../Common';
import RemoveIcon from '@mui/icons-material/Remove';
import WarningIcon from '@mui/icons-material/Warning';
import { Container, Tooltip } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import { ScheduleProvider } from '../scheduleManager';

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
  let human_times = [];
  for (let i = 0; i < times.length; i++) {
    let hour = parseInt(times[i].substring(0, 2));
    let minute = parseInt(times[i].substring(3));
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
    location: string;
    instructors: Array<{
      name: string;
    }>
    days: string;
    startTime: number;
    endTime: number;
  }>
  hours: number;
}


export default function ClassDisplay(props: { classInfo: ClassDisplayInfo }) {
  const [expanded, setExpanded] = React.useState(false);
  const scheduleManager = React.useContext(ScheduleManagerContext);
  const [inSchedule, setInSchedule] = React.useState();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleAddClick = () => {
    setInSchedule(!inSchedule);
    if (!inSchedule) {
      props.scheduleManager.addClass(props.classInfo);
    } else {
      props.scheduleManager.removeClass(props.classInfo);
    }
  }

  return (
    <Card className="classDisplay" sx={{ width: 300 }}>
      <CardHeader
        title={props.classInfo.course.code + "-" + props.classInfo.classSection}
        subheader={props.classInfo.title}
        action={
          <Container disableGutters>
            { props.scheduleManager.checkConflicts(props.classInfo.schedules) ? <Tooltip title="Conflicts with your schedule">
              <WarningIcon color='warning'/>
            </Tooltip> : null}
            

            { props.classInfo.enrollmentTotal==props.classInfo.enrollmentCap ? 
            <Tooltip title={"Full as of " + props.classInfo.lastUpdatedAt.toLocaleString()}>
              <ReportIcon  color='error'/>
            </Tooltip> : null }
          </Container>}
      />
      <CardContent>
        {props.classInfo.schedules.map(schedule => {
          return (
            <>
              <Typography variant="body1" color="text.secondary" key={schedule.days + schedule.startTime}>
                {schedule.days} {
                (Math.floor(schedule.startTime / 60) + 1) % 12 + 1}:{schedule.startTime%60} {schedule.startTime >= 13*60 ? "PM" : "AM"} - {
                (Math.floor(schedule.endTime / 60) + 1) % 12 + 1}:{schedule.endTime%60} {schedule.endTime >= 13*60 ? "PM" : "AM"}
              </Typography>
              {schedule.instructors.map(instructor => {
                <Typography variant="body1" color="text.secondary">{instructor.name}</Typography>
              })}
            </>
          )
        }
        )}
        <Typography variant="body2" color="text.secondary">{props.classInfo.hours} credit hours</Typography>
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
    </Card>
  );
}