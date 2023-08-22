'use client';
import { AppBar, Unstable_Grid2 as Grid, TextField, Button, Container, MenuItem, FormControl, InputLabel, Snackbar, IconButton } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ClassDisplay from "../comps/ClassDisplay";
import "./Search.css";
import { SectionData } from "../Common";
import { useState, useRef, useEffect } from "react";
import React from "react";
import CloseIcon from '@mui/icons-material/Close';
import getScheduleManager, { ScheduleManager } from "../scheduleManager";
import { useLazyQuery, useQuery } from "@apollo/client";
import { gql } from "../../src/__generated__";

export interface SnackbarMessage {
  message: string;
  key: number;
}

interface TermData {
  id: string;
  name: string;
  default?: boolean;
}

export default function Page() {
  const [items, setItems] = useState<SectionData[]>([]);
  const codeRef = useRef<HTMLInputElement | null>(null);
  const creditsRef = useRef<HTMLInputElement | null>(null);
  const [terms, setTerms] = useState<TermData[]>([]);
  const [term, setTerm] = useState<string | null>(null);
  const GET_CLASSES = gql(`
    query GetClasses($term: String!, $code: String!) {
      classes(term: $term, courseId: $code) {
        term,
        classNumber,
        course {
          code,
          description
        },
        classSection,
        title,
        schedules {
          location,
          instructors {
            name
          }
          days,
          startTime,
          endTime
        },
        enrollmentTotal,
        enrollmentCap,
        hours,
        lastUpdatedAt
      }
    }
  `)
  const [ loadClasses, {called, loading, data} ] = useLazyQuery(
    GET_CLASSES,{ variables: {term: term as string, code: codeRef.current?.value as string} });

  useEffect( () => {
    fetch("http://132.145.143.61:80/terms", {
      method: "GET",
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      }
    }).then(
      res => res.json()
    ).then(
      (result: TermData[]) => {
        setTerms(result);
        result.forEach(element => {
          if (element.default) {
            setTerm(element.id);
            return;
          }
        });
        setTerm(result[0].id);
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        console.log(error);
      }
    )
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    setTerm(event.target.value as string);
  };

  let class_numbers: Array<number> = [];

  const setMessage = (message: string) => {
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
  };

  let last_action: {add: boolean, section_data: SectionData}

  let scheduleManager: ScheduleManager = getScheduleManager();

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
      return scheduleManager.hasConflicts(section_data);
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
            <InputLabel id="term-select">Term</InputLabel>
              <Select
                labelId="term-select"
                name="term"
                label="Term"
                size="small"
                onChange={handleChange}
                value = {term != null ? term : "Loading"}
                disabled = {term == null}
              >
                {term != null ? 
                  terms.map((term) =>
                    <MenuItem value={term.id}>{term.name}</MenuItem>
                  )
                  : <MenuItem value="Loading">Loading</MenuItem>
                }
                
              </Select>
            
          </FormControl>
        </Grid>
        <Grid>
          <Button onClick={() => loadClasses()} variant="contained" size="medium">Search</Button>
        </Grid>
      </Grid>
      <Container id="resultsContainer">
        { data ? data.classes.map((item) =>
          <ClassDisplay key={item.classNumber} classInfo={item} scheduleManager={scheduleMiddleman}></ClassDisplay>
        ) : null }
        
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