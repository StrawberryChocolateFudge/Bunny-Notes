import { AppBar, Box, Button, Grid, Link, Paper, Stack, styled, Table, TableBody, TableCell, TableContainer, TableRow, Toolbar, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Base, Copyright, Spacer } from "./Base";
import Header from "./Header";
import VerifyIcon from "@mui/icons-material/Note"
import TextField from '@mui/material/TextField';
import ScanNoteButton from './QRScannerModal';
import { bunnyNoteIsSpent, bunnyNotesCommitments, bunnyNotesWithdrawCashNote, getContract, getContractAddressFromCurrencyDenomination, getExplorer, getJsonRpcProvider, getRpcContract, MAXCASHNOTESIZE, onBoardOrGetProvider, relayCashNotePayment, requestAccounts, web3Injected } from "../web3/web3";
import { parseNote, toNoteHex } from "../../lib/BunnyNote";
import { ethers } from "ethers";
import { generateZKProof } from "../zkp/generateProof";
import { getLoading } from "./LoadingIndicator";

interface PaymentRequestPageProps extends Base {
}

const PayIMG = styled("img")({
    margin: "0 auto",
    width: '80px'
})


const BunnyNotesImg = styled("img")({
    width: "400px",
    padding: "10px",
})

export function PaymentRequestPage(props: PaymentRequestPageProps) {
    const { payTo, amount, currency, network } = useParams();

    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [paymentDone, setPaymentDone] = useState(false);
    const [txHash, setTxHash] = useState("");
    const [txHashLink, setTxHashLink] = useState("");

    const noteSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setNote(event.target.value);
    }

    const setData = (d: string) => {
        setNote(d);
    }

    const paymentAction = async () => {

        if (network === undefined) {
            props.displayError("Invalid Network In Link");
            return;
        }

        const provider = getJsonRpcProvider(network);

        if (provider === undefined) {
            props.displayError("Unable to find Network");
            return;
        }
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

        const contractAddress = getContractAddressFromCurrencyDenomination(parsedNote.amount, parsedNote.currency, `${network}`);
        const contract = await getRpcContract(provider, contractAddress, "/ERC20Notes.json");
        // check if the note is valid or if it has been spent already
        const isSpent = await bunnyNoteIsSpent(contract, nullifierHash);
        const commitments = await bunnyNotesCommitments(contract, commitment);

        if (!commitments.used) {
            props.displayError("Invalid note. Missing Deposit!");
            setLoading(false);
            return;
        }

        if (!commitments.cashNote) {
            props.displayError("You can only spend Cash Notes!");
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
        const change = ethers.utils.parseEther(changeFloat.toString());
        const zkp = await generateZKProof(parsedNote.deposit, payTo, change.toString());

        //PAYMENTS ARE RELAYED!!
        try {
            // Need to send the proof and the publicSignals, why? the relayer will verify the ZKP off-chain before submitting it to the network!
            const res = await relayCashNotePayment({ proof: zkp.proof, publicSignals: zkp.publicSignals, recipient: payTo, currency: parsedNote.currency, denomination: parsedNote.amount, type: "Cash Note", network });

            if (res.status === 200) {
                const json = await res.json();

                const txId = json.txId;
                setTxHash(txId);
                const link = getExplorer(txId, network);
                setTxHashLink(link);
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
        {/* <Stack display={"flex"} flexDirection="row" justifyContent="center" alignContent={"center"}>
            <BunnyNotesImg src="/imgs/BunnyNotes.svg" alt="Bunny Notes Title" />
        </Stack> */}
        <Box component="main" sx={{ flex: 1 }}>
            <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden', marginTop: "30px" }}>
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
                                <TextField autoComplete="off" value={note} onChange={noteSetter} fullWidth placeholder="Paste your Note Here" InputProps={{ disableUnderline: true, sx: { fontSize: 'default' } }} variant="standard" />
                            </Grid>
                            <Grid item>
                                <ScanNoteButton dialogTitle="Scan a Cash Note" setData={setData} handleError={props.displayError}></ScanNoteButton>
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

                    {loading ? getLoading() : (
                        paymentDone ?
                            <Stack direction={"column"} justifyContent="center" alignItems={"center"} spacing={1}>
                                <p>Done</p>
                                <Link target="_blank" rel="noopener" href={txHashLink}>Transaction: {txHash}</Link>
                            </Stack> :
                            <Tooltip arrow title="Pay with Cash Note">
                                <Button onClick={paymentAction} sx={{ mr: 1 }}>
                                    <PayIMG src="/imgs/pay.svg" alt="Pay" />
                             </Button>
                            </Tooltip>)}
                </Box>
            </Paper >
            <Box component="footer" sx={{ p: 2 }}>
                <Copyright />
            </Box>
        </Box>
    </Box>
}