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
import { BaseTronUser, Spacer } from './Base';
import ScanNoteButton from './QRScannerModal';
import { bunnyNoteIsSpent, bunnyNotesCommitments, getContract, getContractAddressFromCurrencyDenomination, getWindowTronWeb, onBoardOrGetTronWeb } from '../tron';
import { parseNote, toNoteHex } from '../../lib/note';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
interface VerifyNoteTabProps extends BaseTronUser {
      noteString: string
      setMyNoteString: (newValue: string) => void;

}

export type Commitment = {
      noteType: boolean
      creator: string
      recepient: string
      denomination: string
}

export default function VerifyNoteTab(props: VerifyNoteTabProps) {

      const [commitmentDetails, setCommitmentDetails] = React.useState<null | Commitment>(null)

      const noteStringSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            props.setMyNoteString(event.target.value);
      }

      const onVerify = async () => {
            if (props.tronWeb === null) {
                  const tronWeb = await onBoardOrGetTronWeb(props.displayError);
                  if (tronWeb) {
                        await fetchCommitment(tronWeb);
                  }
            } else {
                  await fetchCommitment(props.tronWeb)
            }


      }

      const fetchCommitment = async (tronWeb: any) => {
            let parsedNote;

            try {
                  parsedNote = await parseNote(props.noteString);
            } catch (err) {
                  props.displayError(err.message);
                  return;
            }
            const contractAddress = getContractAddressFromCurrencyDenomination(parsedNote.amount, parsedNote.currency);
            const contract = await getContract(tronWeb, contractAddress);
            const commitmentBigInt = parsedNote.deposit.commitment;
            const nullifierHash = parsedNote.deposit.nullifierHash
            // get the commitment data

            const isSpent = await bunnyNoteIsSpent(contract, toNoteHex(nullifierHash))

            const commitments = await bunnyNotesCommitments(contract, toNoteHex(commitmentBigInt))

            if (!commitments.used) {
                  props.displayError("Invalid note. Missing Deposit!");
                  return;
            }

            const recepient = !isSpent ? "Not Spent" : tronWeb.address.fromHex(commitments.recepient);

            setCommitmentDetails({
                  noteType: commitments.cashNote,
                  creator: tronWeb.address.fromHex(commitments.creator),
                  recepient: recepient,
                  denomination: `${parsedNote.amount} ${parsedNote.currency}`
            })
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
                  <Spacer></Spacer>

                  {commitmentDetails === null ? <Tooltip title="Verify the Note">
                        <Button onClick={onVerify} variant="contained" sx={{ mr: 1 }}>
                              Verify
                        </Button>
                  </Tooltip> : <React.Fragment>
                        <Typography sx={{ textAlign: "center" }}>Valid!</Typography>
                        <TableContainer component={Paper}>
                              <Table sx={{ minWidth: 650 }} aria-label="Note details">
                                    <TableBody>
                                          <TableRow>
                                                <TableCell align="left">Denomination:</TableCell>
                                                <TableCell align="right">{commitmentDetails.denomination}</TableCell>
                                          </TableRow>
                                          <TableRow>
                                                <TableCell align="left">Creator:</TableCell>
                                                <TableCell align="right">{commitmentDetails.creator}</TableCell>
                                          </TableRow>
                                          <TableRow>
                                                <TableCell align="left">Recepient:</TableCell>
                                                <TableCell align="right">{commitmentDetails.recepient}</TableCell>
                                          </TableRow>
                                          <TableRow>
                                                <TableCell align="left">Note Type:</TableCell>
                                                <TableCell align="right">{commitmentDetails.noteType ? "Cash Note" : "Gift Card"}</TableCell>
                                          </TableRow>
                                    </TableBody>
                              </Table>
                        </TableContainer>
                  </React.Fragment>}
            </Box>
      </Paper>
}