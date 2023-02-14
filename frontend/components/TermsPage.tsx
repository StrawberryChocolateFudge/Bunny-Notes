import { Button, IconButton } from "@mui/material";
import Paper from "@mui/material/Paper/Paper";
import React from "react";
import Close from "@mui/icons-material/Close";
import { setTermsAcceptedToLS } from "../storage/local";

export function TermsPage() {

    const acceptTerms = () => {
        setTermsAcceptedToLS("true");
        window.close();
    }


    return <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden', padding: "20px" }} >
        <IconButton onClick={() => {
            window.close();
        }}><Close /></IconButton>
        <h2 style={{ textAlign: "center" }}><strong>Terms and Conditions</strong></h2>
        <p style={{ textAlign: "center" }}>Welcome to bunnynotes.finance!</p>

        <div>

            <p>These terms and conditions outline the rules and regulations for the use of bunnynotes.finance's Website, located at bunnynotes.finance.</p>

            <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use bunnynotes.finance if you do not agree to take all of the terms and conditions stated on this page.</p>

            <p>The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with and subject to, prevailing law of Netherlands. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.</p>

            <h2><strong>Testnet</strong></h2>
            <p>Bunny Notes is currently only available on testnet. It is provided as-is without warranty of any kind.</p>
            <p>bunnynotes.finance reserves the right to monitor all transactions and to block any transactions which can violate sanctions, come from hacker's wallet or causes breach of these Terms and Conditions.</p>

            <h2><strong>Cookies</strong></h2>

            <p>We do not use cookies but might use them in the future. By accessing bunnynotes.finance, you agreed to use cookies in agreement with the bunnynotes.finance's Privacy Policy. </p>

            <h2><strong>iFrames</strong></h2>

            <p>Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.</p>

            <h2><strong>Your Privacy</strong></h2>

            <p>At bunnynotes.finance, accessible from https://bunnynotes.finance, one of our main priorities is the privacy of our visitors. This document contains types of information that is collected and recorded by bunnynotes.finance and how we use it.</p>

            <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.</p>

            <h3>Log Files</h3>

            <p>bunnynotes.finance follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information. Our Privacy Policy was created with the help of the <a href="https://www.privacypolicygenerator.org">Privacy Policy Generator</a>.</p>


            <h3>Children's Information</h3>

            <p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p>

            <p>bunnynotes.finance does not knowingly collect any Personal Identifiable Information from children under the age of 13.</p>

            <h3>Online Privacy Policy Only</h3>

            <p>This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in bunnynotes.finance. This policy is not applicable to any information collected offline or via channels other than this website.</p>

            <h3>Consent</h3>

            <p>By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.</p>

            <h2><strong>Reservation of Rights</strong></h2>

            <p>We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it’s linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.</p>

            <h2><strong>Disclaimer</strong></h2>

            <p>bunnynotes.finance is not responsible for financial loss of any kind. Cryptocurrencies pose high financial risk. You use them at your own risk!</p>

        </div>
        <div style={{ display: "flex", justifyContent: "center", flexDirection: "row" }}>
            <Button variant="contained" onClick={() => { acceptTerms() }}>Accept</Button>
        </div>
    </Paper>
}