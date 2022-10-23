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
import { BaseTronUser } from './Base';
import ScanNoteButton from './QRScannerModal';
import { bunnyNotesWithdrawGiftCard, getContract, getContractAddressFromCurrencyDenomination, onBoardOrGetTronWeb } from '../tron';
import { parseNote, toNoteHex } from '../../lib/note';
import { generateZKProof, packSolidityProof } from '../zkp/generateProof';
interface CashOutGiftCardTabProps extends BaseTronUser {
    noteString: string
    setMyNoteString: (newValue: string) => void;
}

export default function CashOutGiftCardTab(props: CashOutGiftCardTabProps) {

    const noteStringSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        props.setMyNoteString(event.target.value);
    }

    const cashOutAction = async () => {
        if (props.tronWeb === null) {
            const tronWeb = await onBoardOrGetTronWeb(props.displayError);
            if (tronWeb) {
                await doCashOut(tronWeb);
            }
        } else {
            await doCashOut(props.tronWeb);
        }
    }

    const doCashOut = async (tronWeb: any) => {
        let parsedNote;

        try {
            parsedNote = await parseNote(props.noteString);
        } catch (err) {
            props.displayError(err.message);
            return;
        }

        const nullifierHash = toNoteHex(parsedNote.deposit.nullifierHash);
        const commitment = toNoteHex(parsedNote.deposit.commitment);

        const contractAddress = getContractAddressFromCurrencyDenomination(parsedNote.amount, parsedNote.currency);
        const contract = await getContract(tronWeb, contractAddress);
        const myAddress = "0x" + tronWeb.defaultAddress.hex.slice(2);
        const change = "0";
        const zkp = await generateZKProof(parsedNote.deposit, myAddress, change);

        console.log(zkp);
        console.log("BEFORE PACKING")
        const solidityProof = packSolidityProof(zkp.proof);
        console.log("AFTER PACKING")
        console.log(solidityProof);

        await bunnyNotesWithdrawGiftCard(contract, solidityProof, nullifierHash, commitment, tronWeb.defaultAddress.base58, change);
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
                        <TextField value={props.noteString} onChange={noteStringSetter} fullWidth placeholder="Paste your Note Here" InputProps={{ disableUnderline: true, sx: { fontSize: 'default' } }} variant="standard" />
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