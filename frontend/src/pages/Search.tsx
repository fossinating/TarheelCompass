import { AppBar, Unstable_Grid2 as Grid, TextField, Button, Container, MenuItem, FormControl, InputLabel } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ClassDisplay from "../comps/ClassDisplay";
import "./Search.css";
import { SectionData } from "../Common";
import { useState, useRef } from "react";

export default function Search() {
  const [items, setItems] = useState<SectionData[]>([]);
  const codeRef = useRef<HTMLInputElement | null>(null);
  const creditsRef = useRef<HTMLInputElement | null>(null);

  function search() {
    console.log(codeRef.current);
    console.log(creditsRef.current);
    fetch("/api/search", {
      method:"POST",
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        'code': codeRef.current?.value,
        'credits': creditsRef.current?.value,
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

  const [term, setTerm] = useState('SPRI2023');

  const handleChange = (event: SelectChangeEvent) => {
    setTerm(event.target.value as string);
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
          <ClassDisplay sectionData={item}></ClassDisplay>
        )}
      </Container>
      </>
    );
}