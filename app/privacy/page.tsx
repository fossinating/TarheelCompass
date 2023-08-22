"use client";
import { List, ListItem, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Link from "../comps/Link";

const privacy_global_version = 1;
const privacy_account_version = 1;
const privacy_revision_version = 0;

export default function Page() {

    function createDataInfo(
        name: string,
        calories: number,
        fat: number,
        carbs: number,
        protein: number,
      ) {
        return { name, calories, fat, carbs, protein };
      }
      
    const rows = [
        createDataInfo('Frozen yoghurt', 159, 6.0, 24, 4.0),
    ];

    return (
        <Container maxWidth="md">
            <Typography variant="h4">Privacy Policy</Typography>
            <Typography variant="subtitle1">Version {privacy_global_version}.{privacy_account_version}.{privacy_revision_version}</Typography>
            <Typography variant="subtitle2">Last Updated June 11, 2023</Typography>
            <br/>
            <Typography variant="h5">Changes to this Policy</Typography>
            <Typography>
                We reserve the right to change this privacy policy at any time.
                In the event that changes are made that impact your data, you will be notified of the changes.
                If you are not logged into an account, you will not be notified of any changes that only pertain to logged-in user data.
            </Typography>
            <Typography variant="h5">Analytics</Typography>
            <Typography>
                Tarheel Compass utilizes Google Analytics in order to better understand our users.
                By using Tarheel Compass, you agree to have some level of information about your activity sent to Google Analytics servers.
                If you would like to limit the information sent, you can disable the cookies in <Link href="/settings">settings</Link>.
                Disabling analytics cookies sets the consent mode for `analytics_storage` to `denied`.
                You can learn more about what all that does on the official Google support page <Link href="https://support.google.com/analytics/answer/9976101">here</Link>.
            </Typography>
            <Typography variant="h5">Advertisements</Typography>
            <Typography>
                Tarheel Compass utilizes Google AdSense in order to support further development.
                If you would like to limit the information sent, you can disable the cookies in <Link href="/settings">settings</Link>.
                Disabling advertisement cookies sets the consent mode for `ad_storage` to `denied`.
                You can learn more about what all that does on the official Google support page <Link href="https://support.google.com/analytics/answer/9976101">here</Link>.
                In the event that you are utilizing an adblocker, you may see advertisements for various student-run organizations and clubs on campus.
                These advertisements are unpaid and are fully random at the moment.
            </Typography>
            <br/>
            <Typography variant="h6">The following applies only to registered users with an account</Typography>
            <br/>
            <Typography variant="h5">Who Manages your Data</Typography>
            <Typography>
                All user data is hosted by PlanetScale.
                As far as we are aware, PlanetScale staff has no access to your data.
            </Typography>
            <Typography variant="h5">What Data is Collected</Typography>
            <Typography>
                When using Tarheel Compass with an account, the following data is collected for the following purposes:
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>Data</TableCell>
                            <TableCell align="right">Usage</TableCell>
                            <TableCell align="right">Fat&nbsp;(g)</TableCell>
                            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                            <TableCell align="right">Protein&nbsp;(g)</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {rows.map((row) => (
                            <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.calories}</TableCell>
                            <TableCell align="right">{row.fat}</TableCell>
                            <TableCell align="right">{row.carbs}</TableCell>
                            <TableCell align="right">{row.protein}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Typography>
        </Container>
    )
}