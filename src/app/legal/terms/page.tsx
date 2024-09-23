"use client";
import { Container, Typography } from "@mui/material";
import Link from "../../lib/Link";

const terms_version = 1;

export default function Page() {
    return (
        <Container maxWidth="md">
            <Typography variant="h4">Terms of Service</Typography>
            <Typography variant="subtitle1">Version {terms_version}</Typography>
            <Typography variant="subtitle2">Last Updated September 23, 2024</Typography>
            <br />
            <Typography variant="h5">Introduction</Typography>
            <Typography>
                Welcome to Tarheel Compass&apos;s Terms of Service! These terms govern your use of our services, including our website, software, and any associated products or features (collectively referred to as the &quot;Service&quot;).
                By accessing or using our Service, you agree to be bound by these terms. If you do not agree with any part of these terms, please refrain from using our Service.
            </Typography>
            <Typography variant="h5">User Obligations</Typography>
            <Typography>
                You must be at least 13 years old and possess the legal authority to agree to these terms and use the Service.
                If you create an account, you are responsible for maintaining the confidentiality of your account credentials and are fully responsible for all activities that occur under your account.
                You agree not to engage in any unlawful, abusive, or unauthorized activities while using the Service.
            </Typography>
            {/*<Typography variant="h5">Advertisements</Typography>
            <Typography>
                In order to support further development, Tarheel Compass has a few ads in place on certain pages.
                If you would like to show your appreciation for the service, we ask that you leave any ad blockers off.
                However, we recognize that it is fully within your right to utilize a form of ad blocker, in which case unpaid UNC related ads may be shown as a backup.
                These ads do not provide any revenue, nor do they utilize any form of tracking, they were created by student-run clubs and organizations at UNC.
                If you run a club and are interested in having it advertised here, please reach out to us on Twitter or Instagram @Tarheel Compass.
            </Typography>*/}
            <Typography variant="h5">Intellectual Property</Typography>
            <Typography>
                All intellectual property rights in the Service, including but not limited to trademarks, copyrights, and patents, are owned by Tarheel Compass.
                We grant you a limited, non-exclusive, non-transferable license to use the Service in accordance with these terms. This license does not permit you to sell, distribute, or modify the Service without our prior written consent.
            </Typography>
            <Typography variant="h5">Privacy and Data</Typography>
            <Typography>
                Our collection, use, and disclosure of personal information are governed by our <Link href="/legal/privacy">Privacy Policy</Link>. By using the Service, you agree to our Privacy Policy.
                We implement reasonable security measures to protect your data, but we cannot guarantee the absolute security of information transmitted through the Service.
            </Typography>
            <Typography variant="h5">Disclaimer of Warranties</Typography>
            <Typography>
                The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis, without any warranties or conditions, express or implied.
                We do not warrant that the Service will be uninterrupted, error-free, or free from viruses or other harmful components.
            </Typography>
            <Typography variant="h5">Limitation of Liability</Typography>
            <Typography>
                To the extent permitted by applicable law, Tarheel Compass and its affiliates shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the Service or these terms.
            </Typography>
            <Typography variant="h5">Termination</Typography>
            <Typography>
                We reserve the right to suspend or terminate your access to the Service at any time for any reason without prior notice.
            </Typography>
            <Typography variant="h5">Changes to the Terms</Typography>
            <Typography>
                We may modify or update these terms from time to time. We will notify you of any material changes. By continuing to use the Service after the changes take effect, you agree to be bound by the revised terms.
            </Typography>
            <Typography variant="h5">Governing Law</Typography>
            <Typography>
                These terms shall be governed by and construed in accordance with the laws of North Carolina. Any legal actions or proceedings arising out of or relating to the Service or these terms shall be exclusively subject to the jurisdiction of the courts of North Carolina.
            </Typography>
            <Typography variant="h5">Severability</Typography>
            <Typography>
                If any provision of these terms is held to be invalid or unenforceable, the remaining provisions shall continue to be valid and enforceable to the fullest extent permitted by law.
            </Typography>
            <Typography variant="h5">Entire Agreement</Typography>
            <Typography>
                These terms constitute the entire agreement between you and Tarheel Compass regarding your use of the Service and supersede any prior agreements or understandings, whether written or oral.
            </Typography>
        </Container>
    )
}