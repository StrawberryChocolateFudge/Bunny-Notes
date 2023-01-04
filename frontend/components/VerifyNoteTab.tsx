import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Box from "@mui/material/Box"
import { Base, Spacer } from './Base';
import ScanNoteButton from './QRScannerModal';
import { parseNote, toNoteHex } from '../../lib/BunnyNote';
import { styled, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { bunnyNoteIsSpent, bunnyNotesCommitments, getContractAddressFromCurrencyDenomination, getErc20NoteToken, getJsonRpcProvider, getRpcContract } from '../web3/web3';
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
      denomination: string,
      erc20Address: string,
      noteAddress: string
}

const IMG = styled("img")({
      margin: "0 auto",
      width: '100px'
})

export const shortenAddress = (address: string) => <Tooltip title={address}><div>{address.substring(0, 6)}...{address.substring(address.length - 6)}</div></Tooltip>


export default function VerifyNoteTab(props: VerifyNoteTabProps) {

      const [commitmentDetails, setCommitmentDetails] = React.useState<null | Commitment>(null)
      const [loading, setLoading] = React.useState(false);
      const noteStringSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            props.setMyNoteString(event.target.value);
      }

      const onVerify = async () => {
            const provider = getJsonRpcProvider(props.selectedNetwork);
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
            const contractAddress = getContractAddressFromCurrencyDenomination(parsedNote.amount, parsedNote.currency, props.selectedNetwork);
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

            //Try to get the token, if it throws then it must be an ETH note
            let erc20Address = "Native Token";
            try {
                  erc20Address = await getErc20NoteToken(contract);
            } catch (err) {
            }


            setCommitmentDetails({
                  validText: !isSpent ? "Valid!" : "The Note has been spent!",
                  noteType: commitments.cashNote,
                  creator: commitments.creator,
                  recipient: recipient,
                  denomination: `${parsedNote.amount} ${parsedNote.currency}`,
                  noteAddress: contractAddress,
                  erc20Address

            })
            setLoading(false);
      }

      const resetVerifyPage = () => {
            setCommitmentDetails(null);
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
                                    <ScanNoteButton dialogTitle='Scan a Bunny Note' setData={props.setMyNoteString} handleError={props.displayError}></ScanNoteButton>
                              </Grid>
                              <Grid item xs>
                                    <TextField autoComplete='off' value={props.noteString} onChange={noteStringSetter} fullWidth placeholder="Paste your Note Here" InputProps={{ disableUnderline: true, sx: { fontSize: 'default' } }} variant="standard" />
                              </Grid>

                              {commitmentDetails !== null ? <Grid item>
                                    <Button variant="contained" onClick={resetVerifyPage}>Reset</Button>
                              </Grid> : null}
                        </Grid>
                  </Toolbar>
            </AppBar>
            <Box sx={{ marginTop: "20px", marginLeft: "20px", marginRight: "20px", marginBottom: "40px", textAlign: "center" }}>
                  <Spacer></Spacer>

                  {commitmentDetails === null ?
                        (loading ? getLoading() : <React.Fragment>
                              <Typography component="p" variant="subtitle1">Verify a Bunny Note. You can check if it's still valid and contains a balance!</Typography>
                              <Tooltip arrow title="Verify the Note">
                                    <Button id="verifyNoteButton" onClick={onVerify} sx={{ mr: 1 }}>
                                          <IMG alt="Verify a Note" src="/imgs/VerifyLogo.svg" />
                                    </Button>
                              </Tooltip> </React.Fragment>)
                        : <React.Fragment>
                              <Typography sx={{ textAlign: "center" }}>{commitmentDetails.validText}</Typography>
                              <TableContainer component={Paper}>
                                    <Table aria-label="Note details">
                                          <TableBody>
                                                <TableRow>
                                                      <TableCell align="left">Denomination:</TableCell>
                                                      <TableCell size='small' align="right">{commitmentDetails.denomination}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                      <TableCell align="left">Creator:</TableCell>
                                                      <TableCell align="right">{shortenAddress(commitmentDetails.creator)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                      <TableCell align="left">Recipient:</TableCell>
                                                      <TableCell align="right">{commitmentDetails.recipient}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                      <TableCell align="left">Note Type:</TableCell>
                                                      <TableCell align="right">{commitmentDetails.noteType ? "Cash Note" : "Gift Card"}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                      <TableCell align="left">Note Contract Address:</TableCell>
                                                      <TableCell size="small" align="right">{shortenAddress(commitmentDetails.noteAddress)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                      <TableCell align="left">Token Address:</TableCell>
                                                      <TableCell size="small" align="right">{commitmentDetails.erc20Address === "Native Token" ? null : shortenAddress(commitmentDetails.erc20Address)}</TableCell>
                                                </TableRow>
                                          </TableBody>
                                    </Table>
                              </TableContainer>
                        </React.Fragment>}
            </Box>
      </Paper>
}