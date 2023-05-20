import { Button, IconButton, Stack, Typography } from "@mui/material";
import Paper from "@mui/material/Paper/Paper";
import React from "react";
import Close from "@mui/icons-material/Close";
import { setTermsAcceptedToLS } from "../storage/local";
import { default as MuiLink } from "@mui/material/Link";

export function TermsPage() {

    const acceptTerms = () => {
        setTermsAcceptedToLS("true");
        window.close();
    }


    return <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden', padding: "20px",fontFamily: "sans-serif" }} >
        <IconButton onClick={() => {
            window.close();
        }}><Close /></IconButton>
        <h2 style={{ textAlign: "center" }}><strong>Terms and Conditions</strong></h2>
        <p style={{ textAlign: "center" }}>Welcome to bunnynotes.finance!</p>

        <div>

            <p>By accessing this website, you agree to be bound by these terms and conditions of use, which govern your use of this website. If you do not agree with these terms and conditions, please do not use this website.</p>

            <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use bunnynotes.finance if you do not agree to take all of the terms and conditions stated on this page.</p>

            <ol>
                <li><p>OWNERSHIP AND USE OF WEBSITE CONTENT:
                    All content on this website, including but not limited to text, graphics, images, logos, and software, is the property of bunnynotes.finance and is protected by applicable intellectual property laws. You may use the content on this website only for personal, non-commercial purposes. You may not copy, reproduce, distribute, or modify any content on this website without our prior written consent.</p></li>
                <li> <p>DISCLAIMER OF WARRANTIES AND LIMITATION OF LIABILITY
                    Bunnynotes.finance provides this website on an "as is" and "as available" basis. We make no representations or warranties of any kind, express or implied, regarding the operation of this website or the information, content, materials, or products included on this website. We will not be liable for any damages arising from the use of this website, including but not limited to direct, indirect, incidental, punitive, and consequential damages.</p></li>
                <li>
                    <p>CHANGES TO TERMS AND CONDITIONS:S
                        Bunnynotes.finance reserves the right to modify these terms and conditions at any time without prior notice. Your continued use of this website after such modifications will constitute your acceptance of the modified terms and conditions.</p>
                </li>
                <li>
                    <p>GOVERNING LAW AND JURISDICTION:
                        These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which bunnynotes.finance is located. Any disputes arising out of or in connection with these terms and conditions will be subject to the exclusive jurisdiction of the courts in that jurisdiction.</p>
                </li>
            </ol>




            <h4>Privacy Policy</h4>
            <p>Bunnynotes.finance is committed to protecting your privacy. This privacy policy explains how we collect, use, and disclose your personal information. By using this website, you consent to the collection, use, and disclosure of your personal information in accordance with this privacy policy.</p>

            <ol>
                <li><p>
                    COLLECTION OF PERSONAL INFORMATION:
                    We do not collect any personal information from users of this website.
                </p>
                </li>
                <li><p>
                    USE OF COOKIES AND SIMILAR TECHNOLOGIES:
                    We do not use cookies or similar technologies on this website.
                </p>
                </li>
                <li><p>
                    DISCLOSURE OF PERSONAL INFORMATION:
                    We do not disclose any personal information to third parties.
                </p>
                </li>
                <li>
                    <p>
                        DATA RETENTION:
                        We do not retain any personal information.
                    </p>
                </li>
                <li>
                    <p>
                        GDPR COMPLIANCE:
                        We are committed to complying with the General Data Protection Regulation (GDPR). As we do not collect or process any personal data, we do not require a Data Protection Officer or a lawful basis for processing personal data.
                    </p>
                </li>
                <li>
                    <p>CHANGES TO PRIVACY POLICY:
                        Bunnynotes.finance reserves the right to modify this privacy policy at any time without prior notice. Your continued use of this website after such modifications will constitute your acceptance of the modified privacy policy.</p>
                </li>
            </ol>

            <h4>Bunny Notes</h4>
            <Stack display="flex" flexDirection="row" justifyContent="space-around" sx={{ gap: "20px" }}>
                <Typography variant="body2" color="text.secondary" align="left">
                    <MuiLink color="inherit" href="https://raw.githubusercontent.com/StrawberryChocolateFudge/Bunny-Notes/bunnyNotesOnly/contracts/BunnyNotes.sol">
                        Smart Contract
                    </MuiLink>
                </Typography>
                <Typography variant="body2" color="text.secondary" align="left">
                    <MuiLink color="inherit" href="imgs/Audit_Report_BunnyNotes.pdf">
                        Audit
                    </MuiLink>
                </Typography>
                <Typography variant="body2" color="text.secondary" align="left">
                    <MuiLink color="inherit" href="/imgs/BunnyNotesWhitePaper.pdf">
                        White Paper
                    </MuiLink>
                </Typography>
            </Stack>
            <p>The following terms and conditions apply to the use of Bunny Notes on the website bunnynotes.finance:</p>
            <ol>
                <li>
                    <p>PURPOSE: A bunny note is a printable and verifiable claim to withdraw value that was deposited into a smart contract through the website bunnynotes.finance. It is designed to facilitate the transfer of value between parties who deposit into and withdraw funds from a smart contract.</p>
                </li>
                <li>
                    <p>INDEMNIFICATION: The creator of the smart contract and the website bunnynotes.finance are indemnified from any claims, damages, or losses arising from the use of Bunny Note. Parties acknowledge and agree that they use Bunny Note at their own risk and that the creator of the smart contract and the website bunnynotes.finance shall not be liable for any damages, losses, or expenses arising from the use of Bunny Note. Bunnynotes.finance offers no guarantee of any kind. Use it at your own risk.</p>
                </li>
                <li>
                    <p>VERIFICATION: Bunny Note can be verified on the blockchain. Parties acknowledge and agree that they are solely responsible for verifying the authenticity of the Bunny Note and ensuring that it has not been tampered with.</p>
                </li>
                <li>
                    <p>TRANSFERABILITY: Bunny Note is transferable and can be redeemed by the holder of the note. Parties acknowledge and agree that they are solely responsible for transferring the note to the intended recipient and that the creator of the smart contract and the website bunnynotes.finance shall not be liable for any losses or damages arising from the transfer of the note.</p>
                </li>
                <li>
                    <p>GOVERNING LAW AND JURISDICTION: These terms and conditions shall be governed by and construed in accordance with the laws of the jurisdiction where the parties are located. Any dispute arising between the parties shall be resolved in the courts of the jurisdiction where the parties are located without involveing bunnynotes.finance or the creator of the smart contract.</p>
                </li>
            </ol>
            <p>By using Bunny Note on the website bunnynotes.finance, parties acknowledge and agree to be bound by these terms and conditions. If parties do not agree to these terms and conditions, they should not use the Bunny Note and the website bunnynotes.finance.</p>

            <p>bunnynotes.finance is not responsible for financial loss of any kind. Cryptocurrencies pose high financial risk. You use them at your own risk!</p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", flexDirection: "row" }}>
            <Button variant="contained" onClick={() => { acceptTerms() }}>Accept</Button>
        </div>
    </Paper >
}