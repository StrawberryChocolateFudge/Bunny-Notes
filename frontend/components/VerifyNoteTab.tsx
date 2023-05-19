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
import { bunnyNoteIsSpent, bunnyNotesCommitments, ChainIds, getJsonRpcProvider, getNetworkNameFromId, getNoteContractAddress, getRpcContract } from '../web3/web3';
import { getLoading } from './LoadingIndicator';
import { commitmentQRStringParser } from '../qrcode/create';
import { ParsedNote } from '../zkp/generateProof';

interface VerifyNoteTabProps extends Base {
      noteString: string
      setMyNoteString: (newValue: string) => void;

}

export type Commitment = {
      validText: string
      creator: string
      recipient: string
      denomination: string,
      erc20Address: string,
      noteAddress: string,
      usesToken: boolean,
      network: string
}

const IMG = styled("img")({
      margin: "0 auto",
      width: '100px'
})

export const shortenAddress = (address: string) => <Tooltip title={address}><div>{address.substring(0, 6)}...{address.substring(address.length - 6)}</div></Tooltip>

export const evalQRCodeType = async (qrString) => {
      //TODO: ADD BUNNY BUNDLE HERE!
      // COMMITMENT FOR BUNNY BUNDLE ALSO!
      let cryptoNoteParseError = false;
      let commitmentParseError = false;
      let errorMessage = "";
      let parsedQrCode = {};
      try {
            parsedQrCode = await parseNote(qrString);
      } catch (err) {
            cryptoNoteParseError = true;
            errorMessage = err.message;
      }

      try {
            parsedQrCode = commitmentQRStringParser(qrString);
      } catch (err) {
            commitmentParseError = true;
            errorMessage = err.message;
      }

      if (!cryptoNoteParseError) {
            return { type: "cryptoNote", code: parsedQrCode, err: errorMessage };
      }

      if (!commitmentParseError) {
            return { type: "commitmentQR", code: parsedQrCode, err: errorMessage }
      }

      return { type: "invalid", code: parsedQrCode, err: errorMessage };
}

const getDetails = ({ type, code, err }: { type: string, code: any, err: string }) => {
      if (type === "cryptoNote") {
            const note = code as ParsedNote;
            const nullifierHash = toNoteHex(note.deposit.nullifierHash);
            const commitment = toNoteHex(note.deposit.commitment);
            return { commitment, nullifierHash, amount: note.amount, currency: note.currency, netId: code.netId };
      } else if (type === "commitmentQR") {
            const nullifierHash = code.nullifierHash;
            const commitment = code.commitment;
            return { commitment, nullifierHash, amount: code.amount, currency: code.currency, netId: code.netId };
      }
      return null;
}

export default function VerifyNoteTab(props: VerifyNoteTabProps) {

      const [commitmentDetails, setCommitmentDetails] = React.useState<null | Commitment>(null)
      const [loading, setLoading] = React.useState(false);
      const noteStringSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            props.setMyNoteString(event.target.value);
      }

      const onVerify = async () => {
            await fetchCommitment().catch(err => props.displayError(err.message));
      }

      const fetchCommitment = async () => {

            const evalResult = await evalQRCodeType(props.noteString);

            if (evalResult.type === "invalid") {
                  props.displayError(evalResult.err);
                  return;
            }

            const details = getDetails(evalResult);
            if (!details) {
                  props.displayError("Unable to parse note!");
                  return;
            }
            const { commitment, nullifierHash, amount, currency, netId } = details;
            const chainId = "0x" + netId.toString(16) as ChainIds;
            setLoading(true);

            const contractAddress = getNoteContractAddress(chainId);

            const provider = getJsonRpcProvider(chainId);

            const contract = await getRpcContract(provider, contractAddress, "/BunnyNotes.json");
            // get the commitment data

            const isSpent = await bunnyNoteIsSpent(contract, nullifierHash)

            const commitments = await bunnyNotesCommitments(contract, commitment)

            if (!commitments.used) {
                  props.displayError("Invalid note. Missing Deposit!");
                  setLoading(false);
                  return;
            }

            const recipient = !isSpent ? "Not Spent" : commitments.recipient;

            //Try to get the token, if it throws then it must be an ETH note
            let erc20Address = commitments.usesToken ? commitments.token : "Native Token";

            setCommitmentDetails({

                  validText: !isSpent ? "Valid!" : "The Note has been spent!",
                  creator: commitments.creator,
                  recipient: recipient,
                  denomination: `${amount} ${currency}`,
                  noteAddress: contractAddress,
                  erc20Address,
                  usesToken: commitments.usesToken,
                  network: getNetworkNameFromId(chainId)
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
                                    <Button variant="contained" id="verifyNoteButton" onClick={onVerify} sx={{ mr: 1, fontSize: "20px" }}>
                                          Verify
                                    </Button>
                              </Tooltip>
                        </React.Fragment>)
                        : <React.Fragment>
                              <Typography sx={{ textAlign: "center" }}>{commitmentDetails.validText}</Typography>
                              <TableContainer component={Paper}>
                                    <Table aria-label="Note details">
                                          <TableBody>
                                                <TableRow>
                                                      <TableCell align="left">Network:</TableCell>
                                                      <TableCell align="right">{commitmentDetails.network}</TableCell>
                                                </TableRow>
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
                                                      <TableCell align="right">{commitmentDetails.recipient === "Not Spent" ? commitmentDetails.recipient : shortenAddress(commitmentDetails.recipient)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                      <TableCell align="left">BunnyNote Contract:</TableCell>
                                                      <TableCell size="small" align="right">{shortenAddress(commitmentDetails.noteAddress)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                      <TableCell align="left">Token Address:</TableCell>
                                                      <TableCell size="small" align="right">{commitmentDetails.erc20Address === "Native Token" ? commitmentDetails.erc20Address : shortenAddress(commitmentDetails.erc20Address)}</TableCell>
                                                </TableRow>
                                          </TableBody>
                                    </Table>
                              </TableContainer>
                        </React.Fragment>}
            </Box>
      </Paper>
}