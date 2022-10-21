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
import { BaseTronUser } from "./Base";
import { onBoardOrGetTronWeb } from "../tron";
import { useNavigate } from "react-router-dom";

export type PaymentRequest = {
    price: string,
    payTo: string
}

interface PaymentRequestTabProps extends BaseTronUser {
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

    const importAddress = async () => {
        if (props.tronWeb === null) {
            const tronWeb = await onBoardOrGetTronWeb(props.displayError);
            if (tronWeb) {
                props.setPaymentRequest({ ...props.paymentRequest, payTo: tronWeb.defaultAddress.base58 })
                props.setTronWeb(tronWeb);
            }

        } else {
            const defaultAddress = props.tronWeb.defaultAddress;
            props.setPaymentRequest({ ...props.paymentRequest, payTo: defaultAddress.base58 })
        }
    }

    const handleSelectPaymentRequest = async (maxAmount: string, currency: string, cardType: CardType) => {
        if (parseFloat(props.paymentRequest.price) > parseFloat(maxAmount)) {
            props.displayError(`Maximum amount per payment request is ${maxAmount} ${currency}`);
            return;
        }

        // For verification I use a temporary tronweb instance, just to call isAddress
        // the props.tronWeb might be null at this point if the user manually copies the address.
        //@ts-ignore
        if (TronWeb.isAddress(props.paymentRequest.payTo)) {
            navigate(`/paymentRequest/${props.paymentRequest.payTo}/${parseFloat(props.paymentRequest.price).toFixed(2)}/${currency}`)
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
                        <WalletIcon color="inherit" sx={{ display: 'block' }} />
                    </Grid>
                    <Grid item xs>
                        <TextField type="text" value={props.paymentRequest.payTo} onChange={setPayToAddress} fullWidth placeholder="Paste your Address Here" InputProps={{ disableUnderline: true, sx: { fontSize: 'default' } }} variant="standard" />
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
                        <TextField type={"number"} value={props.paymentRequest.price} onChange={setPrice} fullWidth placeholder="Set the Price" InputProps={{ disableUnderline: true, sx: { fontSize: 'default' } }} variant="standard"></TextField>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
        <CardGrid handleSelect={handleSelectPaymentRequest} cardProps={getCardPropsData("Payment Request")}></CardGrid>
    </Paper >
}
