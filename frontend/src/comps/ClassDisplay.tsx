import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card, { CardProps } from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SectionData } from '../Common';

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


export default function ClassDisplay(props: {sectionData: SectionData}) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className="classDisplay" sx={{ width: 300 }}>
      <CardHeader
        title={props.sectionData.course_code + "-" + props.sectionData.section_code}
        subheader={props.sectionData.title}
      />
      <CardContent>
        {props.sectionData.schedules.map(schedule => {
          return (
            <>
            <Typography variant="body1" color="text.secondary">{schedule.days} {human_time(schedule.time)}</Typography>
            <Typography variant="body1" color="text.secondary">{schedule.instructors}</Typography>
            </>
          )
          }
        )}
        <Typography variant="body2" color="text.secondary">{props.sectionData.credits} credit hours</Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to schedule">
          <AddIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="body1" color="text.secondary">{props.sectionData.description}</Typography>
          <Typography variant="body2" color="text.secondary">Class Registration Number: {props.sectionData.class_number}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}