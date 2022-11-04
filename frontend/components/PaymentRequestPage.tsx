import { AppBar, Box, Button, Grid, Paper, styled, Table, TableBody, TableCell, TableContainer, TableRow, Toolbar, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Base, Copyright, Spacer } from "./Base";
import Header from "./Header";
import VerifyIcon from "@mui/icons-material/Note"
import TextField from '@mui/material/TextField';
import ScanNoteButton from './QRScannerModal';
import { bunnyNoteIsSpent, bunnyNotesCommitments, bunnyNotesWithdrawCashNote, getContract, getContractAddressFromCurrencyDenomination, getJsonRpcProvider, getRpcContract, MAXCASHNOTESIZE, onBoardOrGetProvider, relayCashNotePayment, requestAccounts } from "../web3/web3";
import { parseNote, toNoteHex } from "../../lib/note";
import { ethers } from "ethers";
import { generateZKProof, packSolidityProof } from "../zkp/generateProof";
import { getLoading } from "./LoadingIndicator";

interface PaymentRequestPageProps extends Base {
}

const Column = styled("div")({
    display: "flex",
    flexDirection: "column"
})

const Row = styled("div")({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly"
});


export function PaymentRequestPage(props: PaymentRequestPageProps) {
    const { payTo, amount, currency } = useParams();

    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [paymentDone, setPaymentDone] = useState(false);

    const noteSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setNote(event.target.value);
    }

    const setData = (d: string) => {
        setNote(d);
    }

    const paymentAction = async () => {
        const provider = getJsonRpcProvider();
        await doPay(provider);
    }

    const doPay = async (provider: any) => {
        if (payTo === undefined) {
            props.displayError("Invalid Payment Address")
            return;
        }

        if (amount === undefined) {

            props.displayError("Invalid Payment Amount");

            return;
        }

        // verify the amount in the url is correct

        if (parseFloat(amount) > MAXCASHNOTESIZE) {

            props.displayError(`Invalid Payment Amount. Maximum ${MAXCASHNOTESIZE} is permitted!`)

            return;
        }

        let parsedNote;
        try {
            parsedNote = await parseNote(note);
        } catch (err) {
            props.displayError("Invalid Note");
            return;
        }

        if (parsedNote.currency !== currency) {
            props.displayError("Invalid payment currency!");
        }

        // verify the address in the url is correct

        if (!ethers.utils.isAddress(payTo as string)) {
            props.displayError("Invalid Payment Address")
            return;
        }
        setLoading(true);
        const nullifierHash = toNoteHex(parsedNote.deposit.nullifierHash);
        const commitment = toNoteHex(parsedNote.deposit.commitment);

        const contractAddress = getContractAddressFromCurrencyDenomination(parsedNote.amount, parsedNote.currency);
        const contract = await getRpcContract(provider, contractAddress, "/ERC20Notes.json");
        // check if the note is valid or if it has been spent already
        const isSpent = await bunnyNoteIsSpent(contract, nullifierHash);
        const commitments = await bunnyNotesCommitments(contract, commitment);

        if (!commitments.used) {
            props.displayError("Invalid note. Missing Deposit!");
            setLoading(false);
            return;
        }

        if (isSpent) {
            props.displayError("Invalid.You can't spend a note twice!");
            setLoading(false);
            return;
        }

        // Calculate change
        // The denomination - payment amount;
        const changeFloat = parseFloat(parsedNote.amount) - parseFloat(amount);
        const change = changeFloat.toString();
        const zkp = await generateZKProof(parsedNote.deposit, payTo, change);
        const solidityProof = packSolidityProof(zkp.proof);

        //PAYMENTS WILL BE ARE RELAYED!!
        try {
            const res = await relayCashNotePayment({ solidityProof, nullifierHash, commitment, recepient: payTo, change, currency: parsedNote.currency, denomination: parsedNote.amount, type: "Cash Note" });

            if (res.status === 200) {
                setPaymentDone(true);
            } else {
                const json = await res.json();
                props.displayError(json.msg);
            }

        } catch (err) {
            props.displayError("Network Error!")
        } finally {
            setLoading(false);
        }

    }

    return <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header withTabs={false} />
        <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}>
            <Spacer></Spacer>
            <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden' }}>
                <AppBar
                    position="static"
                    color="default"
                    elevation={0}
                    sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
                >
                    <Toolbar>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <VerifyIcon color="inherit" sx={{ display: 'block' }} />
                            </Grid>
                            <Grid item xs>
                                <TextField value={note} onChange={noteSetter} fullWidth placeholder="Paste your Note Here" InputProps={{ disableUnderline: true, sx: { fontSize: 'default' } }} variant="standard" />
                            </Grid>
                            <Grid item>
                                <ScanNoteButton setData={setData} handleError={props.displayError}></ScanNoteButton>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <Box sx={{ marginTop: "20px", marginLeft: "20px", marginRight: "20px", marginBottom: "40px", textAlign: "center" }}>
                    <TableContainer component={Paper}>
                        <Table aria-label="Transaction details">
                            <TableBody>
                                <TableRow>
                                    <TableCell align="left">Payment to:</TableCell>
                                    <TableCell align="right">{payTo}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="left">Amount:</TableCell>
                                    <TableCell align="right">{amount} {currency}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Spacer></Spacer>

                    {loading ? getLoading() : (paymentDone ? <p>Done</p> : <Tooltip title="Pay with Cash Note">
                        <Button onClick={paymentAction} variant="contained" sx={{ mr: 1 }}>
                            Pay with Cash Note
                        </Button>
                    </Tooltip>)}
                </Box>
            </Paper >
        </Box>
        <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
            <Copyright />
        </Box>
    </Box>
}