import { AppBar, Button, ButtonBase, Grid, Paper, Stack, styled, Toolbar, Tooltip, Typography } from "@mui/material";
import React from "react";
import { toNoteHex } from "../../lib/BunnyNote";
import { downloadPDF } from "../pdf";
import { NoteDetails } from "../zkp/generateProof";
import { CardType } from "./CardGrid";
import { BigNumber, ethers } from "ethers";
import { bunnyNotesCommitments, bunnyNotesDeposit, ERC20Approve, ethNotesDeposit, getChainId, getContract, getFee, getIsContract, requestAccounts, ZEROADDRESS } from "../web3/web3";
import { parseEther } from "ethers/lib/utils";
import { commitmentQR } from "../qrcode/create";

interface DownloadNoteProps {
    provider: any,
    cardType: CardType,
    noteDetails: NoteDetails | undefined,
    qrCodeDataUrl: any,
    downloadClicked: boolean,
    setDownloadClicked: (boolean) => void
    displayError: (msg) => void;
    showApproval: boolean
    setShowApproval: (to: boolean) => void;
    setRenderDownloadPage: (to: boolean) => void;
    myAddress: string;
    noteAddresses: [string, string];
    selectedNetwork: string;
    noteFee: string;
    navigateToVerifyPage: (noteDetails: NoteDetails) => void;
    depositButtonDisabled: boolean;
    setDepositButtonDisabled: (to: boolean) => void;
}


export function downloadNote(props: DownloadNoteProps) {
    const noteDetails = props.noteDetails as NoteDetails;
    const amount = noteDetails[1].amount;
    const currency = noteDetails[1].currency;
    const denomination = `${amount} ${currency}`;

    const displayedFee = `${props.noteFee} ${noteDetails[1].currency}`;

    const noteString = noteDetails[0];

    const erc20Address = props.noteAddresses[0];
    const noteAddress = props.noteAddresses[1];

    // Native tokens need no approval to spend!
    const isNativeToken = erc20Address === ZEROADDRESS;

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
                            <Img alt="Bunny Note QR Code" src={props.qrCodeDataUrl} />
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
                <Typography sx={{ fontSize: 5, overflow: "scroll" }} variant="subtitle2" component="small">
                    {noteString}
                </Typography>

            </Paper>
            <Stack sx={{ textAlign: "center" }}>
                <Typography variant="subtitle2" component="div">
                    Deposit Fee: {displayedFee}
                </Typography>
            </Stack>
        </Grid>
    }

    const getIsSpendingNote = () => props.cardType === "Spending Note" ? true : false;

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

    const handleApprovalTx = async (tx) => {
        if (tx !== undefined) {
            await tx.wait().then((receipt) => {
                if (receipt.status === 1) {
                    props.setDepositButtonDisabled(false);
                }
            })
        }
    }

    const depositWithOwnerAddress = async () => {
        if (props.showApproval && !isNativeToken) {
            // approve the spend, need to approve for the fee
            const contract = await getContract(props.provider, noteAddress, "/ERC20Notes.json");
            const fee = await getFee(contract);
            const formattedFee = ethers.utils.formatEther(fee);
            const approveAmount = parseFloat(formattedFee) + parseFloat(noteDetails[1].amount);
            const ERC20Contract = await getContract(props.provider, erc20Address, "/ERC20.json");
            const convertedApproveAmount = ethers.utils.parseEther(approveAmount.toString());
            props.setDepositButtonDisabled(true);
            props.setShowApproval(false);
            const tx = await ERC20Approve(ERC20Contract, noteAddress, convertedApproveAmount).catch((err) => {
                props.setShowApproval(true);
            });

            await handleApprovalTx(tx);
            return;
        } else {
            props.setDepositButtonDisabled(true);
            // after succesful approval  I can prompt the user to deposit the tokens to add value to the note
            const notesContract = await getContract(props.provider, noteAddress, "/BunnyNotes.json");
            const address = await requestAccounts(props.provider);
            const isSpendingNote = getIsSpendingNote();
            const deposit = noteDetails[1].deposit;
            // Check if the commitment exists already to stop the deposit!
            const commitments = await bunnyNotesCommitments(notesContract, toNoteHex(deposit.commitment));
            if (commitments.used) {
                props.displayError("Invalid commitment. Deposit already exists!");
                props.setDepositButtonDisabled(false);
                return;
            }


            if (isNativeToken) {
                const fee: BigNumber = await notesContract.fee();
                const denomination: BigNumber = await notesContract.denomination();

                // A quick check to make sure the note is correct denomination
                if (denomination._hex !== parseEther(noteDetails[1].amount)._hex) {
                    props.displayError("Note has invalid Denomination!");
                    props.setDepositButtonDisabled(false);

                    return;
                }

                const tx = await ethNotesDeposit(notesContract, toNoteHex(deposit.commitment), isSpendingNote, address, fee.add(denomination)).catch(err => {
                    props.displayError("Unable to deposit  Note");
                    props.setDepositButtonDisabled(false);

                });
                await handleDepositTx(tx);
                return;
            } else {
                const tx = await bunnyNotesDeposit(notesContract, toNoteHex(deposit.commitment), isSpendingNote, address).catch(err => {
                    props.displayError("Unable to deposit ERC20 Note");
                    props.setDepositButtonDisabled(false);
                });
                await handleDepositTx(tx);
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

        // Check if we are on the correct network!
        const chainId = await getChainId(props.provider);

        if (chainId !== parseInt(props.selectedNetwork)) {
            props.displayError("You are on the wrong network!")
            return;
        }

        await depositWithOwnerAddress();
    }



    const downloadClick = async () => {
        const commitmentBigint = noteDetails[1].deposit.commitment;
        const nullifierHashBigint = noteDetails[1].deposit.nullifierHash;
        // start the download of the PDF!
        const commitment = toNoteHex(commitmentBigint);
        const nullifierHash = toNoteHex(nullifierHashBigint);
        const commitmentQRDataUrl = await commitmentQR({ amount, currency, commitment, nullifierHash });
        downloadPDF(bearerText, denomination, commitment, props.cardType, props.qrCodeDataUrl, noteString, commitmentQRDataUrl);
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
                        {noteDisplay()}
                        <Grid item sx={{ textAlign: "center" }}>
                            <Typography variant="subtitle1" component="div">
                                Make sure you download the note before making a deposit! If you loose the note we cannot recover the deposit for you!
                            </Typography>
                            {props.showApproval && !isNativeToken ? <Tooltip arrow title={"Approve spending " + denomination + ` (plus ${displayedFee} fee)`}>
                                <span><Button onClick={depositClick} sx={{ marginBottom: "10px" }} variant="contained">Approve Spend</Button></span></Tooltip> : <Tooltip arrow title={"Deposit " + denomination + ` (plus ${displayedFee} fee)`}>
                                <span><Button disabled={props.depositButtonDisabled} onClick={depositClick} sx={{ marginBottom: "10px" }} variant="contained">Deposit</Button></span></Tooltip>}
                        </Grid>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar >
    </Paper >
}