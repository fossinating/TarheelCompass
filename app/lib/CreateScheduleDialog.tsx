import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { DialogContentText, FormControl, FormLabel, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { useTerms } from './Common';
import { useDispatch } from 'react-redux';
import { createSchedule } from './redux';


export default function CreateScheduleDialog(props: {term?: string, open: boolean, onClose: () => void}) {
    const [terms, term, setTerm] = useTerms();
    const nameRef = React.useRef<HTMLInputElement>();
    const [nameError, setNameError] = React.useState<string|undefined>();
    const dispatch = useDispatch();
    

    if (props.term !== undefined) {
        setTerm(props.term);
    }

    const handleChange = (event: SelectChangeEvent) => {
      setTerm(event.target.value as string);
    };

    const handleCreateClick = () => {
        if(nameRef.current == undefined) {
            return;
        }
        if (nameRef.current.value == "") {
            setNameError("Cannot have an empty schedule name")
            return;
        }
        if (nameRef.current.value.length > 64) {
            setNameError("Schedule name must be less than 64 characters");
            return;
        }
        setNameError(undefined);
        dispatch(createSchedule(term as string, nameRef.current.value))
        props.onClose();
    }

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Create New Schedule</DialogTitle>
            <DialogContent>
                <Grid container direction={"column"} spacing={2} minWidth={"25vw"}>
                    <Grid item>
                        <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Schedule Name"
                        type="text"
                        inputRef={nameRef}
                        fullWidth
                        variant="outlined"
                        helperText={nameError}
                        error={nameError != undefined}

                        />
                    </Grid>
                    <Grid item>
                        <FormControl disabled = {props.term != undefined} size="small">
                            <InputLabel>Term</InputLabel>
                            <Select
                                labelId="term-select-label"
                                id="term-select"
                                value={term}
                                label="Term"
                                onChange={handleChange}>
                                {terms != undefined && terms.length > 0 ? 
                                    terms.map((term) => <MenuItem key={term.id} value={term.id}>{term.name}</MenuItem>)
                                : <MenuItem value="Loading">Loading</MenuItem>
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                
            </DialogContent>
            <DialogActions>
                <Button variant='text' onClick={() => {props.onClose()}}>Cancel</Button>
                <Button variant='contained' onClick={() => {handleCreateClick()}}>Create</Button>
            </DialogActions>
        </Dialog>
    );
}