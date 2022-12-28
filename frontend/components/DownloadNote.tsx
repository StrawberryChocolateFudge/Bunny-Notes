import { AppBar, Button, ButtonBase, Grid, Paper, styled, Toolbar, Tooltip, Typography } from "@mui/material";
import React from "react";
import { toNoteHex } from "../../lib/BunnyNote";
import { downloadPDF } from "../pdf";
import { NoteDetails } from "../zkp/generateProof";
import { CardType } from "./CardGrid";
import { ethers } from "ethers";
import { bunnyNotesCommitments, bunnyNotesDeposit, ERC20Approve, getChainId, getContract, getFee, getIsContract, requestAccounts } from "../web3/web3";
import { approveERC20SpendByOwner } from "../web3/Wallet";

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
    checkForBunnyWallet: boolean;
    myAddress: string;
    noteAddresses: [string, string];
    selectedNetwork: string;
}


export function downloadNote(props: DownloadNoteProps) {
    const noteDetails = props.noteDetails as NoteDetails;

    const denomination = `${noteDetails[1].amount} ${noteDetails[1].currency}`

    const noteString = noteDetails[0];

    const erc20Address = props.noteAddresses[0];
    const noteAddress = props.noteAddresses[1];

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
        </Grid>
    }

    const depositWithOwnerAddress = async () => {
        //TODO: NOTE CONTRACT IS NOW HARDCODED IN!
        //TODO: IMPLEMENT ETH NOTES TOO
        if (props.showApproval) {
            // approve the spend, need to approve for the fee
            const contract = await getContract(props.provider, noteAddress, "/ERC20Notes.json");

            const fee = await getFee(contract);
            const formattedFee = ethers.utils.formatEther(fee);

            const approveAmount = parseFloat(formattedFee) + parseFloat(noteDetails[1].amount);

            const ERC20Contract = await getContract(props.provider, erc20Address, "/ERC20.json");

            const convertedApproveAmount = ethers.utils.parseEther(approveAmount.toString());
            props.setShowApproval(false);

            await ERC20Approve(ERC20Contract, noteAddress, convertedApproveAmount).catch((err) => {
                props.setShowApproval(true);
            });

        } else {
            // after succesful approval  I can prompt the user to deposit the tokens to add value to the note

            const notesContract = await getContract(props.provider, noteAddress, "/ERC20Notes.json");

            const address = await requestAccounts(props.provider);

            const isCashNote = props.cardType === "Cash Note" ? true : false;

            const deposit = noteDetails[1].deposit;

            // CHECK if the commitment exists already to stop the deposit!

            const commitments = await bunnyNotesCommitments(notesContract, toNoteHex(deposit.commitment));

            if (commitments.used) {
                props.displayError("Invalid commitment. Deposit already exists!");
                return;
            }

            await bunnyNotesDeposit(notesContract, toNoteHex(deposit.commitment), isCashNote, address);
        }
    }

    const depositWithBunnyWallet = async () => {
        const address = await requestAccounts(props.provider);

        const bunnyWallet = await getContract(props.provider, props.myAddress, "/BunnyWallet.json");

        const owner = await bunnyWallet.owner();

        if (owner !== address) {
            props.displayError("You don't own the Bunny Wallet");
            return;
        }

        //TODO: Implement ETH NOTES TOO

        if (props.showApproval) {
            // approve the spend using the bunny wallet, you must be the owner of the wallet

            const erc20Notes = await getContract(props.provider, noteAddress, "/ERC20Notes.json");

            const fee = await getFee(erc20Notes);
            const formattedFee = ethers.utils.formatEther(fee);

            const approveAmount = parseFloat(formattedFee) + parseFloat(noteDetails[1].amount);

            props.setShowApproval(false);
            //TODO: NOW USING HARDCODED USDTMADDRESS

            const receipt = await approveERC20SpendByOwner(bunnyWallet, erc20Address, erc20Address, approveAmount.toString()).catch(err => {
                props.setShowApproval(true);
            });

            //TODO: DO AN APPROVAL WITH THE BUNNY WALLET
        } {
            //TODO: DO A DEPOSIT WITH THE BUNNY WALLET


        }

    }


    const depositClick = async () => {
        let isContract = false;

        if (props.checkForBunnyWallet) {
            isContract = await getIsContract(props.provider, props.myAddress, props.displayError);
        }

        // if download was not clicked, render errror
        if (!props.downloadClicked) {
            props.displayError("You need to download the Note before you can make a deposit!");
            return;
        }

        //TODO: This is for TESTNET ONLY!!
        // if the selected currency is not USDT, I render error
        if (noteDetails[1].currency !== "USDTM") {
            props.displayError("We are on testnet. Currently only USDTM deposits are allowed!");
            return;
        }

        // Check if we are on the correct network!
        const chainId = await getChainId(props.provider);

        if (chainId !== parseInt(props.selectedNetwork)) {
            props.displayError("You are on the wrong network!")
            return;
        }

        // BUNNY WALLET WILL HAVE A DIFFERENT APPROVAL AND DEPOSIT FUNCTION!!
        if (!isContract) {
            await depositWithOwnerAddress();
        } else {
            await depositWithBunnyWallet();
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
                        <Tooltip title="Go back">
                            <Button onClick={() => props.setRenderDownloadPage(false)}>Back</Button>
                        </Tooltip>
                    </Grid>
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
                            {props.showApproval ? <Tooltip title={"Approve spending " + denomination + " (plus 10% fee)"}>
                                <Button onClick={depositClick} sx={{ marginBottom: "10px" }} variant="contained">Approve Spend</Button></Tooltip> : <Tooltip title={"Deposit " + denomination + " (plus 10% fee)"}>
                                <Button onClick={depositClick} sx={{ marginBottom: "10px" }} variant="contained">Deposit</Button></Tooltip>}
                        </Grid>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar >
    </Paper >
}