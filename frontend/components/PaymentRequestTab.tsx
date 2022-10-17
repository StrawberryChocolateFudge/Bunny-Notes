import * as React from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import VerifyIcon from "@mui/icons-material/Note"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MoneyIcon from "@mui/icons-material/Money";
import { getCardPropsData } from "./utils/cardPropsData";
import CardGrid from "./CardGrid";


export type PaymentRequest = {
    price: string,
    payTo: string
}

interface PaymentRequestTabProps {
    paymentRequest: PaymentRequest,
    setPaymentRequest: (value: PaymentRequest) => void;
}


export default function PaymentRequestTab(props: PaymentRequestTabProps) {

    const setPrice = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        props.setPaymentRequest({ ...props.paymentRequest, price: event.target.value })
    }

    const setPayToAddress = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        props.setPaymentRequest({ ...props.paymentRequest, payTo: event.target.value })
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
                        <WalletIcon color="inherit" sx={{ display: 'block' }} />
                    </Grid>
                    <Grid item xs>
                        <TextField type="text" value={props.paymentRequest.payTo} onChange={setPayToAddress} fullWidth placeholder="Paste your Address Here" InputProps={{ disableUnderline: true, sx: { fontSize: 'default' } }} variant="standard" />
                    </Grid>
                    <Grid item>
                        <Tooltip title="Import Address From Wallet Extension">
                            <Button variant="contained" sx={{ mr: 1 }}>
                                Import Address
                            </Button>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
        <AppBar
            position="static"
            color="default"
            elevation={0}
            sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
        >
            <Toolbar>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <MoneyIcon color="inherit" sx={{ display: 'block' }} />
                    </Grid>

                    <Grid item xs>
                        <TextField type={"number"} value={props.paymentRequest.price} onChange={setPrice} fullWidth placeholder="Set the Price" InputProps={{ disableUnderline: true, sx: { fontSize: 'default' } }} variant="standard"></TextField>
                    </Grid>

                </Grid>
            </Toolbar>
        </AppBar>
        <CardGrid cardProps={getCardPropsData("Payment Request")}></CardGrid>
    </Paper >
}
