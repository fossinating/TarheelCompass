import { AppBar, Unstable_Grid2 as Grid, TextField, Button, Box } from "@mui/material";
import ClassDisplay from "../comps/ClassDisplay";

export default function Search() {
    return (
        <>
        <Grid container spacing={2}>
          <Grid>
            <TextField id="outlined-basic" label="Course Code" variant="outlined" size="small" margin="none" />
          </Grid>
          <Grid>
            <TextField id="outlined-basic" label="Credits" variant="outlined" size="small"  margin="none"/>
          </Grid>
          <Grid>
            <Button variant="contained" size="medium">Search</Button>
          </Grid>
        </Grid>
        <Box id="resultsContainer"><ClassDisplay></ClassDisplay></Box>
        </>
      );
}