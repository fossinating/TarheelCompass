'use client';
import { AppBar, Unstable_Grid2 as Grid, TextField, Button, Container, MenuItem, FormControl, InputLabel, Snackbar, IconButton } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ClassDisplay from "../comps/ClassDisplay";
import "./Search.css";
import { SectionData } from "../Common";
import { useState, useRef } from "react";
import React from "react";
import CloseIcon from '@mui/icons-material/Close';
import { ScheduleManager } from "../scheduleManager";

export interface SnackbarMessage {
  message: string;
  key: number;
}

export default function Page() {
  const [items, setItems] = useState<SectionData[]>([]);
  const codeRef = useRef<HTMLInputElement | null>(null);
  const creditsRef = useRef<HTMLInputElement | null>(null);

  function search() {
    fetch("http://132.145.143.61:80/search", {
      method:"POST",
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        'class_code': codeRef.current?.value,
        'credits': creditsRef.current?.value,
        'component': "",
        'term': term
      })})
      .then(res => res.json())
      .then(
        (result) => {
          setItems(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
        }
      )
  }

  const [term, setTerm] = useState('FALL2023');

  const handleChange = (event: SelectChangeEvent) => {
    setTerm(event.target.value as string);
  };

  let class_numbers: Array<number> = [];

  const setMessage = (message: string) => {
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
  };

  let last_action: {add: boolean, section_data: SectionData}

  const scheduleManager = new ScheduleManager();

  const scheduleMiddleman = {
    addClass: (section_data: SectionData) => {
      scheduleManager.addClass(section_data);
      setMessage(section_data.course_code + "-" + section_data.section_code + " added to schedule");
      last_action = {add:true, section_data:section_data}
    },
    removeClass: (section_data: SectionData) => {
      scheduleManager.removeClass(section_data);
      setMessage(section_data.course_code + "-" + section_data.section_code + " removed from schedule");
      last_action = {add:false, section_data:section_data}
    },
    checkClass: (section_data: SectionData) => {
      return scheduleManager.checkClass(section_data);
    },
    checkConflicts: (section_data: SectionData) => {
      return scheduleManager.checkConflicts(section_data);
    }
  }
  const [snackPack, setSnackPack] = React.useState<readonly SnackbarMessage[]>([]);
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState<SnackbarMessage | undefined>(
    undefined,
  );

  React.useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const handleUndo = () => {
    if (last_action.add) {
      scheduleMiddleman.removeClass(last_action.section_data);
    } else {
      scheduleMiddleman.addClass(last_action.section_data);
    }
    setOpen(false);
  }

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };


  return (
      <>
      <Grid container spacing={2}>
        <Grid>
          <TextField name="code" label="Course Code" inputRef={codeRef} variant="outlined" size="small" margin="none" />
        </Grid>
        <Grid>
          <TextField name="credits" label="Credits" inputRef={creditsRef}  variant="outlined" size="small"  margin="none"/>
        </Grid>
        <Grid>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Term</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              name="term"
              value={term}
              label="Term"
              size="small"
              onChange={handleChange}
            >
              <MenuItem value="SPRI2023">Spring 2023</MenuItem>
              <MenuItem value="FALL2023">Fall 2023</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid>
          <Button onClick={search} variant="contained" size="medium">Search</Button>
        </Grid>
      </Grid>
      <Container id="resultsContainer">
        {items.map((item) =>
          <ClassDisplay sectionData={item} scheduleManager={scheduleMiddleman}></ClassDisplay>
        )}
      </Container>
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        message={messageInfo ? messageInfo.message : undefined}
        action={
          <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
              UNDO
            </Button>
            <IconButton
              aria-label="close"
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={handleUndo}
            >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      />
      </>
    );
}