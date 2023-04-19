import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Box from "@mui/material/Box"
import { Base } from './Base';
import ScanNoteButton from './QRScannerModal';
import { parseNote, toNoteHex } from '../../lib/BunnyNote';
import { generateZKProof, packSolidityProof } from '../zkp/generateProof';
import { getChainId, getContract, getNoteContractAddress, onBoardOrGetProvider, requestAccounts, withdraw } from '../web3/web3';
import { styled, Typography } from '@mui/material';
interface CashOutGiftCardTabProps extends Base {
    noteString: string
    setMyNoteString: (newValue: string) => void;
}
const IMG = styled("img")({
    margin: "0 auto",
    width: "130px"
})

export default function CashOutGiftCardTab(props: CashOutGiftCardTabProps) {

    const noteStringSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        props.setMyNoteString(event.target.value);
    }

    const cashOutAction = async () => {
        if (props.provider === null) {
            const provider = await onBoardOrGetProvider(props.displayError);
            if (provider) {
                await doCashOut(provider);
            }
        } else {
            await doCashOut(props.provider);
        }
    }

    const doCashOut = async (provider: any) => {
        let parsedNote;

        try {
            parsedNote = await parseNote(props.noteString);
        } catch (err) {
            props.displayError(err.message);
            return;
        }

        // Check if we are on the correct network!
        const chainId = await getChainId(props.provider);

        if (chainId !== parseInt(props.selectedNetwork)) {
            props.displayError("You are on the wrong network!")
            return;
        }


        const nullifierHash = toNoteHex(parsedNote.deposit.nullifierHash);
        const commitment = toNoteHex(parsedNote.deposit.commitment);

        const contractAddress = getNoteContractAddress(props.selectedNetwork);
        const contract = await getContract(provider, contractAddress, "/BunnyNotes.json");
        const myAddress = await requestAccounts(provider);
        const zkp = await generateZKProof(parsedNote.deposit, myAddress);
        const solidityProof = packSolidityProof(zkp.proof);

        const tx = await withdraw(contract, solidityProof, nullifierHash, commitment, myAddress).catch(err => {
            props.displayError("Unable to Withdraw");
            console.error(err);
        });

        if (tx !== undefined) {
            await tx.wait().then((receipt) => {
                if (receipt.status === 1) {
                    props.navigateToVerifyPage([props.noteString, parsedNote])
                }
            })
        }

    }

    return <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden' }}>
        <AppBar
            position="static"
            color="default"
            elevation={0}
            sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
        >
            <Toolbar>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <ScanNoteButton dialogTitle="Scan a Bunny Note" setData={props.setMyNoteString} handleError={props.displayError}></ScanNoteButton>
                    </Grid>
                    <Grid item xs>
                        <TextField autoComplete='off' value={props.noteString} onChange={noteStringSetter} fullWidth placeholder="Paste your Note Here" InputProps={{ disableUnderline: true, sx: { fontSize: 'default' } }} variant="standard" />
                    </Grid>

                </Grid>
            </Toolbar>
        </AppBar>
        <Box sx={{ marginTop: "20px", marginLeft: "20px", marginRight: "20px", marginBottom: "40px", textAlign: "center" }}>
            <Typography component="p" variant="subtitle1">You can withdraw the Bunny Note balance to your wallet.</Typography>
            <Tooltip arrow title="Withdraw the Bunny Note">
                <Button onClick={cashOutAction} sx={{ mr: 1 }}>
                    <IMG alt="Withdraw a Bunny Note" src="/imgs/CashOut.svg" />
                </Button>
            </Tooltip>
        </Box>
    </Paper >
}