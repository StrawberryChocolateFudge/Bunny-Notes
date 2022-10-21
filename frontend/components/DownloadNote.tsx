import { AppBar, Button, ButtonBase, Grid, Paper, styled, Toolbar, Tooltip, Typography } from "@mui/material";
import React from "react";
import { toNoteHex } from "../../lib/note";
import { downloadPDF } from "../pdf";
import { NoteDetails } from "../zkp/generateProof";
import { CardType } from "./CardGrid";

interface DownloadNoteProps {
    cardType: CardType,
    noteDetails: NoteDetails | undefined,
    qrCodeDataUrl: any,
    downloadClicked: boolean,
    setDownloadClicked: (boolean) => void
    displayError: (msg) => void;
}


export function downloadNote(props: DownloadNoteProps) {

    const noteDetails = props.noteDetails as NoteDetails;

    const denomination = `${noteDetails[1].amount} ${noteDetails[1].currency}`

    const noteString = noteDetails[0];

    const Img = styled('img')({
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    });

    const bearerText = `The smart contract will pay the bearer on demand the sum of ${denomination}`

    const noteDisplay = () => {
        return <Grid item>
            <Paper
                id="NOTE"
                sx={{
                    p: 2,
                    margin: 'auto',
                    maxWidth: "100%",
                    flexGrow: 1,
                    backgroundColor: "white"
                }}
            >
                <Typography sx={{ marginLeft: "5px" }} variant="subtitle2" color="text.secondary">{bearerText}</Typography>

                <Grid container spacing={2}>
                    <Grid item>
                        <ButtonBase sx={{ width: 128, height: 128 }}>
                            <Img alt="complex" src={props.qrCodeDataUrl} />
                        </ButtonBase>
                    </Grid>

                    <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                            <Typography gutterBottom variant="subtitle1" component="div">
                                Bunny Note
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {denomination + " " + props.cardType}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                bunnynotes.finance
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Typography sx={{ fontSize: 8, overflow: "scroll" }} variant="subtitle2" component="small">
                    {noteString}
                </Typography>
            </Paper>
        </Grid>
    }

    const depositClick = () => {
        // if download was not clicked, render errror
        if (!props.downloadClicked) {
            props.displayError("You need to download the Note before you can make a deposit!");
            return;
        }
    }
    const downloadClick = () => {
        const commitmentBigint = noteDetails[1].deposit.commitment;

        // start the download of the PDF!
        downloadPDF(bearerText, denomination, toNoteHex(commitmentBigint), props.cardType, props.qrCodeDataUrl, noteString);

        props.setDownloadClicked(true);
    }

    return <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden' }}>
        <AppBar
            position="static"
            color="default"
            elevation={0}
            sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
        >
            <Toolbar>
                <Grid container spacing={2} alignItems="center" sx={{ paddingTop: "20px" }}>
                    <Grid item>
                        <Tooltip title="Download the Note">
                            <Button onClick={downloadClick} variant="contained" sx={{ mr: 1 }}>Download</Button>
                        </Tooltip>
                    </Grid>
                    {noteDisplay()}
                    <Grid item sx={{ margin: "0 auto" }}>
                        <Grid item sx={{ textAlign: "center" }}>
                            <Typography variant="subtitle1" component="div">
                                Make sure you download the note before making a deposit!
                            </Typography>

                            <Typography variant="subtitle1" component="div">
                                If you loose the note we cannot recover the deposit for you!
                            </Typography>
                            <Tooltip title={"Deposit " + denomination}>
                                <Button onClick={depositClick} sx={{ marginBottom: "10px" }} variant="contained">Deposit</Button></Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar >
    </Paper >
}