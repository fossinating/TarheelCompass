"use client";
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

const privacy_global_version = 1;
const privacy_account_version = 0;
const privacy_revision_version = 0;

export default function Page() {

    function createDataInfo(
        usage: string,
        dataUsed: string,
      ) {
        return { usage, dataUsed };
      }
      
    const rows = [
        createDataInfo("Account Maintenance", "Your email, Google openid, username, and public Google profile data"),
        createDataInfo("Schedule Saving", "Schedule names, terms, and the classes that have been added"),
    ];

    return (
        <Container maxWidth="md">
            <Typography variant="h4">Privacy Policy</Typography>
            <Typography variant="subtitle1">Version {privacy_global_version}.{privacy_account_version}.{privacy_revision_version}</Typography>
            <Typography variant="subtitle2">Last Updated September 23, 2024</Typography>
            <br/>
            <Typography variant="h5">Changes to this Policy</Typography>
            <Typography>
                We reserve the right to change this privacy policy at any time.
                In the event that changes are made that impact your data, you will be notified of the changes.
                If you are not logged into an account, you will not be notified of any changes that only pertain to user accounts.
            </Typography>
            <Typography variant="h5">Analytics</Typography>
            <Typography>
                Tarheel Compass utilizes Google Analytics in order to better understand our users.
                User consent for Google Analytics tracking is based on cookie consent provided, and no data will be collected if cookie consent is not provided.
                If consent is provided, we collect the following information through Google Analytics, however none of this information is associated with you specifically:

                <br/>
                <b>General Usage</b>: Activity within the site, including what pages are being visited and what features are being interacted with.
                <br/>
                <b>Approximate Location</b>: Data about where our users are coming from.
                <br/>
                <b>Search Data</b>: Data about what searches are being completed, including all parameters in each search.
                <br/>
                <b>Schedule Interaction</b>: Activity regarding schedules, including the creation, deletion, and renaming of schedules, along with the classes added and removed.
                To preserve anonymity, the scheduleID is not shared for these events.

                <br/>
                <br/>

                This data is used to help us better understand how users interact with our services so we can best improve your expeirences.
            </Typography>
            {/*<Typography variant="h5">Advertisements</Typography>
            <Typography>
                Tarheel Compass utilizes Google AdSense in order to support further development.
                If you would like to limit the information sent, you can disable the cookies in <Link href="/settings">settings</Link>.
                Disabling advertisement cookies sets the consent mode for `ad_storage` to `denied`.
                You can learn more about what all that does on the official Google support page <Link href="https://support.google.com/analytics/answer/9976101">here</Link>.
                In the event that you are utilizing an adblocker, you may see advertisements for various student-run organizations and clubs on campus.
                These advertisements are unpaid and are fully random at the moment.
            </Typography>*/}
            <br/>
            <Typography variant="h6">The following applies only to registered users with an account</Typography>
            <br/>
            <Typography variant="h5">Data we receieve about you</Typography>

            <Typography variant="h6">Data you provide to us</Typography>
            <Typography>
                <b>Account creation data</b>: This is data provided during the account creation process.
                This includes your email, Google openid, your public Google profile, and username.

                <br/>
                <b>Content data</b>: We receive content as a part of your usage of our service.
                This includes any schedules you create.
            </Typography>
            <Typography variant="h6">Data we collect when you use our Services</Typography>
            <Typography>For purposes of the operation of our Services, the following data is collected and associated with your account.</Typography>
            <br/>
            <Typography>
            <b>Account and connection data</b>: IP address, account creation date, last login date.
            </Typography>
            <Typography variant="h5">How we use data we receive about you</Typography>
            <Typography>

                <b>Operation of the Service</b>: In order to provide you with our account benefits, such as saving schedules across devices. Your data is not used to provide for the experiences of other users.
                <br/>
                <b>Improvement of the Service</b>: While developing new features, we may use user data to better understand how users would be able to use our features.
            </Typography>
            <Typography variant="h5">When we share your data</Typography>
            <Typography>
                We only share your information as necessary for the operation of the Service or as required by law.

                <b>Tarheel Compass Employees</b>: As needed, authorized Tarheel Compass employees may access your information exclusively to improve our Services for you.
                <br/>
                <b>Service Providers</b>: To provide our Services, we work with third party providers to provide specific services.
                In working with these providers, we may share your data as necessary to provide you with our Services.
                We currently work with Cloudflare for the hosting of both our website and our user data. We also work with Oracle Cloud for the hosting of course data.
            </Typography>
            <Typography variant="h5">How long do we keep your data</Typography>
            <Typography>
                We work to minimize the collection of data, and so we only collect information that is required for the operation of our services.
                As a result, all of the data we collect is retained indefinitely as it is required to provide our services to you.
                If you would like your data to be deleted, reach out to us at privacy@tarheelcompass.com.
            </Typography>
            <Typography variant="h5">Data Summary</Typography>
            <Typography>
                For your convenience, the following table is provided with examples of usage, however there are no guarantees that it will be complete.
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>Usage</TableCell>
                            <TableCell align="right">Data Used</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {rows.map((row) => (
                            <TableRow
                            key={row.usage}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                                {row.usage}
                            </TableCell>
                            <TableCell align="right">{row.dataUsed}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Typography>
        </Container>
    )
}