import { DialogContentText, FormControl, FormGroup } from '@mui/material';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from 'next/link';
import * as React from 'react';


export default function WelcomeDialog() {
    const [open, setOpen] = React.useState(true);
    const [state, setState] = React.useState({
        ads: true,
        analytics: true,
        terms: false,
    });

    const { ads, analytics, terms } = state;
    const [termsError, setTermsError] = React.useState(true);

    const handleClose = (event: object, reason: string) => {
        if (reason && reason == "backdropClick") 
            return;
      setOpen(false);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
          ...state,
          [event.target.name]: event.target.checked,
        });
      };

    const onAccept = () => {
        //console.log(state)
        if (terms) {
            localStorage.setItem("ads", JSON.stringify(ads));
            localStorage.setItem("analytics", JSON.stringify(analytics));
            localStorage.setItem("terms", JSON.stringify(true));
            setOpen(false);
        } else {
            setTermsError(true);
        }
    }

    return (
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Welcome to Tarheel Compass!</DialogTitle>
        <DialogContent>
            <DialogContentText>
                We&apos;re happy to have you, but before you can continue, we have to ask a few legal questions.
            </DialogContentText>
            <DialogContentText fontWeight="bold">
                <br/>
                Cookie usage
            </DialogContentText>
            <FormGroup>
                <FormControlLabel control={<Checkbox checked={ads} onChange={handleChange} name="ads" />} label="Ad Personalization" />
                <FormControlLabel control={<Checkbox checked={analytics} onChange={handleChange} name="analytics" />} label="Analytics" />
                <FormControlLabel disabled control={<Checkbox defaultChecked />} label="Essential" />
            </FormGroup>
            <DialogContentText>
                These settings can be changed at any time from the settings page.
            </DialogContentText>
            <DialogContentText fontWeight="bold">
                <br/>
                Terms of Service and Privacy Policy
            </DialogContentText>
            <FormControl error={termsError}>
                <FormControlLabel control={<Checkbox checked={terms} onChange={handleChange} name="terms" />} label={
                    <div>
                        <span>I have read and accept the </span>
                        <Link href="/terms">terms of use</Link>
                        <span> and </span>
                        <Link href="/privacy">privacy policy</Link>
                    </div>
                    } />
            </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onAccept}>Accept</Button>
        </DialogActions>
      </Dialog>
    );
}