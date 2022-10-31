import { Box, Typography } from "@mui/material";
import React from "react";
import Header from "./Header";

export default function HelpPage() {

    const Title = (txt) => <Typography sx={{ margin: "0 auto" }} component={"h3"} variant="h3">{txt}</Typography>
    const Body = (txt) => <Typography component={"div"} variant="body1">{txt}</Typography>
    const STitle = (txt) => <Typography sx={{ margin: "0 auto" }} component="h6" variant="h6">{txt}</Typography>
    const Img = (src, width) => <img style={{ margin: "0 auto" }} width={width} src={src} />

    return <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header withTabs={false}></Header>
        <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1', display: "flex", flexDirection: "column" }}>
            {Img("/Bunny-Note.jpg", "200px")}
            <hr />
            {Title("Help")}

            {Body(`Welcome to Bunny Notes. This is a step by step tutorial to show you how the application works!
                Bunny Notes is a Gift Card and Cash Note protocol.It allows you to create cryptographic notes that you can spend in various ways after creating them.
                You can do offline payments by handing other people the notes or you can pay safely with cash notes on the go without touching your crypto wallet while you can be sure the merchant has no access to your balance other than the note!`)}
            <hr />
            {STitle('We are on Testnet')}

            {Body("A Hot Wallet is needed to try out the DApp. You need to use Metamask or similar The Bunny Notes Smart contracts are deployed on Donau testnet and use the BitTorrent Chain!")}
            {Img("/testnet-banner.png", "600px")}
            <hr />
            {STitle("Purchase Gift Cards or Cash Notes")}
            {Body("You can select a token from the list and purchase it. All you need is to provide your crypto address. Click \"Import Address\" to connect metamask and fill it out automatically. Select USDTM from the list to proceed with your purchase. Because we are on testnet, only that token works. Make sure you mint some first so you can make the deposit!")}
            {Img("/depositPage.png", "600px")}
            {Body("Congratulations! After a successful deposit, your Note now has value! You can give it to somebody to cash it out or if you created a cash note, you can spend it!")}
            <hr />
            {STitle("Gift Cards VS Cash Notes")}
            {Body("The difference between a cash note and gift card is how it's spent. The gift card is always cashed out as a whole while when using a cash note you can spend fractional value. The creator of the cash note will receive back the change from the transaction if not all the note value is spent, just like when making payments with a larger cash note bill in person, you don't need to spend it all when you use it to make a purchase. The reason for this is to create secure payments, so you can have the same added security as single use virtual credit cards. These notes can be spent safely in person without exposing the underlying a crypto wallet's balance.")}
            <hr />
            {STitle("The Note")}
            {Body("The Bunny Note is a cryptographic note, a secret number is generated with a nullifier (also a number) that is used to create a commitment that identifies the deposit. The PDF contains the secret in the QR code or on the bottom of the page. When withdrawing the value from the note, a zero-knowledge proof is generated to prove the owner owns the Note.")}
            <hr />
            <iframe style={{ margin: "0 auto" }} width="500" height={'200'} src="/testNote.pdf"></iframe>
            <hr />
            {STitle("Verify a Note")}
            {Body("You should verify a note if you find one to check if it's valid. Use the QR code scanner or copy the text from the bottom of the pdf image to the input field and click verify!")}
            {Img("/verifyPage.png", "600px")}
            <hr />
            {STitle("Cash Out a Gift Card")}
            {Body("Gift cards can be converted back to tokens. When cashing out the user needs to scan the QR code or paste the note and they are ready to withdraw the tokens!")}
            {Img("/cashOut.png", "600px")}
            <hr />
            {STitle("Request Payment")}
            {Body("Payment Requests are very versatile. Using this page will create a link to the application that you can share online or you can show it to your customer in person, and he can pay with the note instantly using the QR Code Scanner!")}
            {Img("/paymentRequestPage.png", "600px")}
            <hr />
            {STitle("Payment Link Page")}
            {Body("The payment link page can be used to pay in person or online. In the current version one of the parties must use a crypto wallet however it can be either of the parties. A seller can just scan the QR code of the Note and the buyer can be sure the seller has no access to his wallet when making payments or in another scenario the seller can send the link to the buyer and the buyer will submit the transaction to the network. Either way, it works.")}
            {Img("/payWithCashNote.png", "600px")}
        </Box>
    </Box>
}