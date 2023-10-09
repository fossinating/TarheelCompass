'use client';
import { AppBar, Unstable_Grid2 as Grid, TextField, Button, Container, MenuItem, FormControl, InputLabel, Snackbar, IconButton } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ClassDisplay from "../lib/ClassDisplay";
import "./Search.css";
import { SectionData, useTerms } from "../lib/Common";
import { useState, useRef, useEffect } from "react";
import React from "react";
import CloseIcon from '@mui/icons-material/Close';
import { ScheduleProvider } from "../scheduleManager";
import { useLazyQuery, useQuery } from "@apollo/client";
import { gql } from "../../src/__generated__";

export interface SnackbarMessage {
  message: string;
  key: number;
}

export default function Page() {
  const [items, setItems] = useState<SectionData[]>([]);
  const codeRef = useRef<HTMLInputElement | null>(null);
  const creditsRef = useRef<HTMLInputElement | null>(null);
  const [terms, term, setTerm] = useTerms();
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

  const handleChange = (event: SelectChangeEvent) => {
    setTerm(event.target.value as string);
  };

  let class_numbers: Array<number> = [];

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
                {terms != undefined && terms.length > 0 ? 
                  terms.map((term) =>
                    <MenuItem key={term.id} value={term.id}>{term.name}</MenuItem>
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
          <ClassDisplay key={item.classNumber} classInfo={item}></ClassDisplay>
        ) : null }
        
      </Container>
      </>
    );
}