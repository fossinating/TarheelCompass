import { DialogContentText, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';


export default function MigrationDialog() {
    const [open, setOpen] = React.useState(true);

    const handleClose = (event: object, reason: string) => {
        if (reason && reason == "backdropClick") 
            return;
      setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Welcome to Tarheel Compass!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {setOpen(false)}}>Cancel</Button>
          <Button onClick={() => {setOpen(false)}}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    );
}