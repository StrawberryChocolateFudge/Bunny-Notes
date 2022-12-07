import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import VerifyIcon from "@mui/icons-material/Note"
import Box from "@mui/material/Box"
import { Base } from './Base';
import ScanNoteButton from './QRScannerModal';
import { parseNote, toNoteHex } from '../../lib/BunnyNote';
import { generateZKProof, packSolidityProof } from '../zkp/generateProof';
import { bunnyNotesWithdrawGiftCard, getChainId, getContract, getContractAddressFromCurrencyDenomination, netId, onBoardOrGetProvider, requestAccounts } from '../web3/web3';
interface CashOutGiftCardTabProps extends Base {
    noteString: string
    setMyNoteString: (newValue: string) => void;
}

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

        if (chainId !== netId) {
            props.displayError("You are on the wrong network!")
            return;
        }


        const nullifierHash = toNoteHex(parsedNote.deposit.nullifierHash);
        const commitment = toNoteHex(parsedNote.deposit.commitment);

        const contractAddress = getContractAddressFromCurrencyDenomination(parsedNote.amount, parsedNote.currency);
        const contract = await getContract(provider, contractAddress, "/ERC20Notes.json");
        const myAddress = await requestAccounts(provider);
        const change = "0";
        const zkp = await generateZKProof(parsedNote.deposit, myAddress, change);
        const solidityProof = packSolidityProof(zkp.proof);
        await bunnyNotesWithdrawGiftCard(contract, solidityProof, nullifierHash, commitment, myAddress, change);
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
                        <VerifyIcon color="inherit" sx={{ display: 'block' }} />
                    </Grid>
                    <Grid item xs>
                        <TextField autoComplete='off' value={props.noteString} onChange={noteStringSetter} fullWidth placeholder="Paste your Note Here" InputProps={{ disableUnderline: true, sx: { fontSize: 'default' } }} variant="standard" />
                    </Grid>
                    <Grid item>
                        <ScanNoteButton setData={props.setMyNoteString} handleError={props.displayError}></ScanNoteButton>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
        <Box sx={{ marginTop: "20px", marginLeft: "20px", marginRight: "20px", marginBottom: "40px", textAlign: "center" }}>
            <Tooltip title="Cash out the Gift Card">
                <Button onClick={cashOutAction} variant="contained" sx={{ mr: 1 }}>
                    Cash out
                </Button>
            </Tooltip>
        </Box>
    </Paper >
}