import * as React from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import { changeCurrentSchedule, Schedule, selectSchedules, useDispatch, useSelector } from './redux';
import { useState } from 'react';

export interface ScheduleSelectorDialogProps {
  open: boolean;
  onClose: () => void;
}

function ScheduleSelectorDialog(props: ScheduleSelectorDialogProps) {
  const { onClose, open } = props;
  const schedules = useSelector(selectSchedules);
  const dispatch = useDispatch();

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (scheduleIndex: number) => {
    dispatch(changeCurrentSchedule(scheduleIndex))
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Select Schedule</DialogTitle>
      <List sx={{ pt: 0 }}>
        {schedules.map((schedule, index) => (
          <ListItem disableGutters key={schedule.id}>
            <ListItemButton onClick={() => handleListItemClick(index)}>
              <ListItemText primary={schedule.name} />
            </ListItemButton>
          </ListItem>
        ))}
        {/*<ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={() => handleListItemClick('addAccount')}
          >
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Add account" />
          </ListItemButton>
        </ListItem>*/}
      </List>
    </Dialog>
  );
}

export default function ScheduleSelectorButton(props: {className?: string}) {
  const [scheduleSelectorVisible, setScheduleSelectorVisible] = useState(false);

  const onClose = () => {
    setScheduleSelectorVisible(false);
  }

  return (
    <className={props.className}>
      <Button variant={"outlined"} onClick={() => setScheduleSelectorVisible(true)}>Change Schedule</Button>
      <ScheduleSelectorDialog onClose={onClose} open={scheduleSelectorVisible}/>
    </>
  )
}