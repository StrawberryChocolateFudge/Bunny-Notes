import * as React from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MoneyIcon from "@mui/icons-material/Money";
import { getCardPropsData } from "./utils/cardPropsData";
import CardGrid, { CardType } from "./CardGrid";
import { Base } from "./Base";
import { useNavigate } from "react-router-dom";
import { onBoardOrGetProvider, requestAccounts } from "../web3/web3";
import { ethers } from "ethers";
import ScanNoteButton from "./QRScannerModal";

export type PaymentRequest = {
    price: string,
    payTo: string
}

interface PaymentRequestTabProps extends Base {
    paymentRequest: PaymentRequest,
    setPaymentRequest: (value: PaymentRequest) => void;
    displayError: (msg: string) => void;

}


export default function PaymentRequestTab(props: PaymentRequestTabProps) {

    const navigate = useNavigate();
    const setPrice = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        props.setPaymentRequest({ ...props.paymentRequest, price: event.target.value })
    }

    const setPayToAddress = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        props.setPaymentRequest({ ...props.paymentRequest, payTo: event.target.value })
    }

    const scanPayToAddress = (d: string) => {
        props.setPaymentRequest({ ...props.paymentRequest, payTo: d });
    }
    
    const importAddress = async () => {
        if (props.provider === null) {
            const provider = await onBoardOrGetProvider(props.displayError);
            if (provider) {
                const account = await requestAccounts(provider);
                props.setPaymentRequest({ ...props.paymentRequest, payTo: account })
                props.setProvider(provider);
            }
        } else {
            const account = await requestAccounts(props.provider);
            props.setPaymentRequest({ ...props.paymentRequest, payTo: account })
        }
    }

    const handleSelectPaymentRequest = async (maxAmount: string, currency: string, cardType: CardType) => {
        if (parseFloat(props.paymentRequest.price) > parseFloat(maxAmount)) {
            props.displayError(`Maximum amount per payment request is ${maxAmount} ${currency}`);
            return;
        }

        // For verification I use a temporary tronweb instance, just to call isAddress
        // the props.tronWeb might be null at this point if the user manually copies the address.
        if (ethers.utils.isAddress(props.paymentRequest.payTo)) {
            navigate(`/paymentRequest/${props.paymentRequest.payTo}/${parseFloat(props.paymentRequest.price)}/${currency}`)
        } else {
            props.displayError(`Invalid wallet address!`);
            return;
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
                        <ScanNoteButton dialogTitle='Scan a Wallet Address' setData={scanPayToAddress} handleError={props.displayError}></ScanNoteButton>
                    </Grid>
                    <Grid item xs>
                        <TextField autoComplete="off" type="text" value={props.paymentRequest.payTo} onChange={setPayToAddress} fullWidth placeholder="Paste your Address Here" InputProps={{ disableUnderline: true, sx: { fontSize: 'default' } }} variant="standard" />
                    </Grid>
                    <Grid item>
                        <Tooltip title="Import Address From Wallet Extension">
                            <Button onClick={importAddress} variant="contained" sx={{ mr: 1 }}>
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
                        <TextField autoComplete="off" type={"number"} value={props.paymentRequest.price} onChange={setPrice} fullWidth placeholder="Set the Price" InputProps={{ disableUnderline: true, sx: { fontSize: 'default' } }} variant="standard"></TextField>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
        <CardGrid handleSelect={handleSelectPaymentRequest} cardProps={getCardPropsData("Payment Request")}></CardGrid>
    </Paper >
}
