import { AppBar, Button, Grid, Paper, Stack, Toolbar, Tooltip, Typography } from "@mui/material";
import React from "react";
import { toNoteHex } from "../../lib/BunnyNote";
import { downloadA4PDF } from "../pdf";
import { NoteDetails } from "../zkp/generateProof";
import { CardType } from "./CardGrid";
import { ethers } from "ethers";
import { bunnyNotesCommitments, calculateFee, depositETH, depositToken, ERC20Approve, getChainId, getContract, getNetworkNameFromId, handleNetworkSelect, onboardOrSwitchNetwork, ZEROADDRESS } from "../web3/web3";
import { parseEther } from "ethers/lib/utils";
import { commitmentQR } from "../qrcode/create";

interface DownloadNoteProps {
    cardType: CardType,
    noteDetails: NoteDetails | undefined,
    qrCodeDataUrl: any,
    downloadClicked: boolean,
    setDownloadClicked: (boolean) => void
    displayError: (msg) => void;
    showApproval: boolean
    setShowApproval: (to: boolean) => void;
    setRenderDownloadPage: (to: boolean) => void;
    noteAddresses: [string, string];
    selectedNetwork: string;
    noteFee: string;
    navigateToVerifyPage: (noteDetails: NoteDetails) => void;
    depositButtonDisabled: boolean;
    setDepositButtonDisabled: (to: boolean) => void;
    isFeeless: boolean;
}


export function downloadNote(props: DownloadNoteProps) {
    const noteDetails = props.noteDetails as NoteDetails;
    const amount = noteDetails[1].amount;
    const currency = noteDetails[1].currency;
    const denominationAndCurr = `${amount} ${currency}`;

    const displayedFee = `${props.noteFee} ${noteDetails[1].currency}`;

    const noteString = noteDetails[0];

    const erc20Address = props.noteAddresses[0];
    const noteAddress = props.noteAddresses[1];
    // Native tokens need no approval to spend!
    const isNativeToken = erc20Address === ZEROADDRESS;

    const networkName = getNetworkNameFromId(props.selectedNetwork);

    const bearerText = `The smart contract on ${networkName} will pay the bearer on demand the sum of ${denominationAndCurr}`

    const handleDepositTx = async (tx) => {
        if (tx !== undefined) {
            await tx.wait().then((receipt) => {
                if (receipt.status === 1) {
                    props.navigateToVerifyPage(noteDetails)
                } else {
                    // If the deposit transaction fails the deposit button will be reenabled
                    // This can happen if the deposit was dispatched too fast and the approval didn't succeed, yet
                    props.setDepositButtonDisabled(false);
                }
            })
        }
    }

    const handleApprovalTx = async (tx, notesContract, deposit) => {
        if (tx !== undefined) {
            await tx.wait().then(async (receipt) => {
                if (receipt.status === 1) {
                    await handleDepositToken(notesContract, deposit)
                }
            })
        }
    }

    const handleDepositToken = async (notesContract, deposit) => {
        const tx = await depositToken(notesContract, toNoteHex(deposit.commitment), parseEther(amount), erc20Address).catch(err => {
            if (err.message.includes("underlying network changed")) {
                props.displayError("Underlying error changed! Refresh the application!")
                return;
            }
            console.log(err);
            props.displayError("Unable to deposit ERC20 Note");
            props.setDepositButtonDisabled(false);
        });
        await handleDepositTx(tx);
    }

    const depositWithOwnerAddress = async (provider) => {
        const notesContract = await getContract(provider, noteAddress, "/BunnyNotes.json");
        const deposit = noteDetails[1].deposit;
        const commitments = await bunnyNotesCommitments(notesContract, toNoteHex(deposit.commitment));
        if (commitments.used) {
            props.displayError("Invalid commitment. Deposit already exists!");
            return;
        }

        if (props.showApproval && !isNativeToken) {
            // approve the spend, need to approve for the fee
            const fee = await calculateFee(notesContract, parseEther(amount));
            const approveAmount = props.isFeeless ? ethers.utils.parseEther(noteDetails[1].amount) : fee.add(ethers.utils.parseEther(noteDetails[1].amount));

            if (erc20Address === "") {
                props.displayError("Token address missing. Maybe you are on testnet?")
            }


            const ERC20Contract = await getContract(provider, erc20Address, "/ERC20.json");
            props.setDepositButtonDisabled(true);
            props.setShowApproval(false);
            const tx = await ERC20Approve(ERC20Contract, noteAddress, approveAmount).catch((err) => {
                props.setShowApproval(true);
            });

            await handleApprovalTx(tx, notesContract, deposit);
            return;
        } else {
            props.setDepositButtonDisabled(true);
            // Check if the commitment exists already to stop the deposit!
            if (isNativeToken) {
                const tx = await depositETH(notesContract, toNoteHex(deposit.commitment), parseEther(amount)).catch(err => {
                    props.displayError("Unable to deposit  Note");
                    props.setDepositButtonDisabled(false);

                }).catch(err => {
                    console.log(err);
                    {
                        if (err.message.includes("underlying network changed")) {
                            props.displayError("Underlying error changed! Refresh the application!")
                        }
                    }
                });
                await handleDepositTx(tx);
                return;
            } else {
                await handleDepositToken(notesContract, deposit)
                return;
            }
        }
    }

    const depositClick = async () => {
        // if download was not clicked, render errror
        if (!props.downloadClicked) {
            props.displayError("You need to download the Note before you can make a deposit!");
            return;
        }
        // I'm gonna onboard here and switch to the selected network and return the provider!
        const provider = await handleNetworkSelect(props.selectedNetwork, props.displayError)
        await depositWithOwnerAddress(provider);
    }


    const downloadClick = async () => {
        const commitmentBigint = noteDetails[1].deposit.commitment;
        const nullifierHashBigint = noteDetails[1].deposit.nullifierHash;
        // start the download of the PDF!
        const commitment = toNoteHex(commitmentBigint);
        const nullifierHash = toNoteHex(nullifierHashBigint);
        const commitmentQRData = await commitmentQR({ amount, currency, commitment, nullifierHash, netId: props.selectedNetwork });

        downloadA4PDF({
            bearerText,
            denomination: denominationAndCurr,
            commitment,
            cardType: props.cardType,
            dataUrl: props.qrCodeDataUrl,
            noteString,
            commitmentQRCodeString: commitmentQRData.QRString,
            commitmentQRCodeDataUrl: commitmentQRData.buffer,
            network: props.selectedNetwork,
            tokenAddress: isNativeToken ? "Native Token" : erc20Address
        })
        props.setDownloadClicked(true);
    }

    const backButtonClicked = () => {
        props.setRenderDownloadPage(false);
        props.setDepositButtonDisabled(false);
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
                        <Tooltip arrow title="Go back">
                            <Button onClick={backButtonClicked}>Back</Button>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip arrow title="Download the Note">
                            <Button onClick={downloadClick} variant="contained" sx={{ mr: 1 }}>Download</Button>
                        </Tooltip>
                    </Grid>

                    <Grid item sx={{ margin: "0 auto" }}>
                        <Stack sx={{ textAlign: "center" }}>
                            <Typography variant="h6" component="div">{"Deposit " + denominationAndCurr}</Typography>
                        </Stack>
                        {props.isFeeless ? null :
                            <Stack sx={{ textAlign: "center" }}>
                                <Typography variant="subtitle2" component="div">
                                    plus 1% fee ({displayedFee})
                                </Typography>
                            </Stack>}
                        <Grid item sx={{ textAlign: "center", paddingBottom: "20px", marginTop: "20px" }}>

                            {props.showApproval && !isNativeToken ? <Tooltip arrow title={"Approve spending " + denominationAndCurr + ` (plus ${displayedFee} fee)`}>
                                <span><Button onClick={depositClick} sx={{ marginBottom: "10px" }} variant="contained">Approve Spend<img width="35px" src="/imgs/metamaskFox.svg" /></Button></span></Tooltip> : <Tooltip arrow title={"Deposit " + denominationAndCurr + ` (plus ${displayedFee} fee)`}>
                                <span><Button disabled={props.depositButtonDisabled} onClick={depositClick} sx={{ marginBottom: "10px" }} variant="contained">Deposit<img width="35px" src="/imgs/metamaskFox.svg" /></Button></span></Tooltip>}
                            <Typography variant="subtitle1" component="div">
                                Make sure to download the note before making the deposit! If you loose the note we cannot recover the deposit for you!
                            </Typography>

                        </Grid>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar >
    </Paper >
}