import LoadingButton from '@mui/lab/LoadingButton';
import { DialogContentText, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import { reloadSession } from '../util';


export default function OnboardingDialog() {
    const [open, setOpen] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [usernameInput, setUsernameInput] = React.useState("");
    const [errMessage, setErrMessage] = React.useState<null|string>(null);

    const handleClose = (event: object, reason: string) => {
        if (reason && reason == "backdropClick") 
            return;
      setOpen(false);
    };

    const submit = () => {
      if (usernameInput.length > 2 && usernameInput.length <= 20 && usernameInput.match("^[a-z0-9][a-z0-9\_.\-]+[a-z0-9]$") !== null) {
        setErrMessage(null);
        setLoading(true);
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: usernameInput })
        };
        fetch('/api/user/username', requestOptions)
            .then(async response => {
              if (response.ok) {
                //props.setUsername(usernameInput);
                setOpen(false);
                reloadSession();
              } else {
                setLoading(false);
                try {
                  let data = await response.json();
                  setErrMessage(data?.errMessage ? data.errMessage : "An unknown error occured, if this continues please contact support.");
                } catch {
                  setErrMessage("An unknown error occured, if this continues please contact support.");
                }
              }
            }) 
      } else {
        setErrMessage("Invalid username. Username must be 3-20 characters, characters a-Z, 0-9, `.`, `-`, or `_`, and must start and end with a-Z or 0-9.")
      }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm">
        <DialogTitle>Thank you for registering an account!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            We have just a few more steps to fully set up your account! 
          </DialogContentText>
          <br/>
          <TextField
            id="username"
            label="Username"
            type="text"
            fullWidth
            value={usernameInput}
            disabled={loading}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (!loading)
                setUsernameInput(event.target.value);
            }}
            variant="standard"
            { ... errMessage !== null ? {helperText: errMessage, error: true} : undefined}
          />
        </DialogContent>
        <DialogActions>
          <LoadingButton onClick={submit} loading={loading}><span>Finish</span></LoadingButton>
        </DialogActions>
      </Dialog>
    );
}