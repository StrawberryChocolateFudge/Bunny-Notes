import { AppBar, Box, Button, Grid, Paper, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { BaseTronUser, Copyright, Spacer } from "./Base";
import Header from "./Header";
import { TestnetInfo } from "./TestnetInfo";
import VerifyIcon from "@mui/icons-material/Note"
import TextField from '@mui/material/TextField';
import ScanNoteButton from './QRScannerModal';

interface PaymentRequestPageProps extends BaseTronUser {
}

const Column = styled("div")({
    display: "flex",
    flexDirection: "column"
})

const Row = styled("div")({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly"
});


export function PaymentRequestPage(props: PaymentRequestPageProps) {
    const { payTo, amount, currency } = useParams();

    const [note, setNote] = useState("");

    const noteSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setNote(event.target.value);
    }

    const setData = (d: string) => {
        setNote(d);
    }

    return <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header withTabs={false} />
        <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}>
            <TestnetInfo></TestnetInfo>
            <Spacer></Spacer>
            <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden' }}>
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
                                <TextField value={note} onChange={noteSetter} fullWidth placeholder="Paste your Note Here" InputProps={{ disableUnderline: true, sx: { fontSize: 'default' } }} variant="standard" />
                            </Grid>
                            <Grid item>
                                <ScanNoteButton setData={setData} handleError={props.displayError}></ScanNoteButton>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <Box sx={{ marginTop: "20px", marginLeft: "20px", marginRight: "20px", marginBottom: "40px", textAlign: "center" }}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="Transaction details">
                            <TableBody>
                                <TableRow>
                                    <TableCell align="right">Payment to:</TableCell>
                                    <TableCell align="right">{payTo}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">Amount:</TableCell>
                                    <TableCell align="right">{amount} {currency}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Spacer></Spacer>
                    <Tooltip title="Pay with Cash Note">
                        <Button variant="contained" sx={{ mr: 1 }}>
                            Pay with Cash Note
                        </Button>
                    </Tooltip>
                </Box>
            </Paper >
        </Box>
        <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
            <Copyright />
        </Box>
    </Box>
}