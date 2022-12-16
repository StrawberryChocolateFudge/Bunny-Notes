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
import { Base, Spacer } from './Base';
import ScanNoteButton from './QRScannerModal';
import { parseNote, toNoteHex } from '../../lib/BunnyNote';
import { styled, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { bunnyNoteIsSpent, bunnyNotesCommitments, getContractAddressFromCurrencyDenomination, getJsonRpcProvider, getRpcContract } from '../web3/web3';
import { getLoading } from './LoadingIndicator';
interface VerifyNoteTabProps extends Base {
      noteString: string
      setMyNoteString: (newValue: string) => void;

}

export type Commitment = {
      validText: string
      noteType: boolean
      creator: string
      recipient: string
      denomination: string
}

const IMG = styled("img")({
      margin: "0 auto",
      width: '150px'
})

export default function VerifyNoteTab(props: VerifyNoteTabProps) {

      const [commitmentDetails, setCommitmentDetails] = React.useState<null | Commitment>(null)
      const [loading, setLoading] = React.useState(false);
      const noteStringSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            props.setMyNoteString(event.target.value);
      }

      const onVerify = async () => {
            const provider = getJsonRpcProvider();
            await fetchCommitment(provider)
      }



      const fetchCommitment = async (provider: any) => {
            let parsedNote;

            try {
                  parsedNote = await parseNote(props.noteString);
            } catch (err) {
                  props.displayError(err.message);
                  return;
            }
            setLoading(true);
            const contractAddress = getContractAddressFromCurrencyDenomination(parsedNote.amount, parsedNote.currency);
            const contract = await getRpcContract(provider, contractAddress, "/ERC20Notes.json");
            const commitmentBigInt = parsedNote.deposit.commitment;
            const nullifierHash = parsedNote.deposit.nullifierHash
            // // get the commitment data

            const isSpent = await bunnyNoteIsSpent(contract, toNoteHex(nullifierHash))

            const commitments = await bunnyNotesCommitments(contract, toNoteHex(commitmentBigInt))

            if (!commitments.used) {
                  props.displayError("Invalid note. Missing Deposit!");
                  setLoading(false);
                  return;
            }

            const recipient = !isSpent ? "Not Spent" : commitments.recipient;
            setCommitmentDetails({
                  validText: !isSpent ? "Valid!" : "The Note has been spent!",
                  noteType: commitments.cashNote,
                  creator: commitments.creator,
                  recipient: recipient,
                  denomination: `${parsedNote.amount} ${parsedNote.currency}`
            })
            setLoading(false);
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
                                    <ScanNoteButton dialogTitle='Scan a Bunny Note' setData={props.setMyNoteString} handleError={props.displayError}></ScanNoteButton>
                              </Grid>
                        </Grid>
                  </Toolbar>
            </AppBar>
            <Box sx={{ marginTop: "20px", marginLeft: "20px", marginRight: "20px", marginBottom: "40px", textAlign: "center" }}>
                  <Spacer></Spacer>

                  {commitmentDetails === null ?
                        (loading ? getLoading() : <React.Fragment>
                              <Typography component="p" variant="subtitle1">Verify a Bunny Note. You can check if it's still valid and contains a balance!</Typography>
                              <Tooltip title="Verify the Note">
                                    <Button onClick={onVerify} sx={{ mr: 1 }}>
                                          <IMG src="/imgs/VerifyLogo.svg" />
                                    </Button>
                              </Tooltip> </React.Fragment>)
                        : <React.Fragment>
                              <Typography sx={{ textAlign: "center" }}>{commitmentDetails.validText}</Typography>
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
                                                      <TableCell align="left">recipient:</TableCell>
                                                      <TableCell align="right">{commitmentDetails.recipient}</TableCell>
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