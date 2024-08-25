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
import { Schedule, selectSchedules, useSelector } from './redux';

export interface ScheduleSelectorDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ScheduleSelectorDialog(props: ScheduleSelectorDialogProps) {
  const { onClose, open } = props;
  const schedules = useSelector(selectSchedules);

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (value: Schedule) => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Set backup account</DialogTitle>
      <List sx={{ pt: 0 }}>
        {schedules.map((schedule) => (
          <ListItem disableGutters key={schedule.id}>
            <ListItemButton onClick={() => handleListItemClick(schedule)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
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