import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import WalletIcon from "@mui/icons-material/AccountBalanceWallet"
import CardGrid, { CardType } from './CardGrid';
import { getCardPropsData } from './utils/cardPropsData';
import { generateZKProof, createNote } from '../zkp/generateProof';
import { onBoardOrGetTronWeb, verifyAddress } from '../tron';
import { BaseTronUser } from './Base';

interface GiftCardPageProps extends BaseTronUser {

}

export default function PurchaseGiftCardTab(props: GiftCardPageProps) {

    const addressSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        props.setMyAddress(event.target.value);
    }

    const importAddress = async () => {
        if (props.tronWeb === null) {
            const tronWeb = await onBoardOrGetTronWeb(props.displayError);

            if (tronWeb) {
                props.setMyAddress(tronWeb.defaultAddress.base58);
                props.setTronWeb(tronWeb);
            }

        } else {
            const defaultAddress = props.tronWeb.defaultAddress;
            props.setMyAddress(defaultAddress.base58);
        }
    }

    const handleSelectGiftCard = async (denomination: string, currency: string, cardType: CardType) => {
        let tronWeb = null;
        if (props.tronWeb === null) {
            tronWeb = await onBoardOrGetTronWeb(props.displayError);
            if (tronWeb) {
                props.setTronWeb(tronWeb);
            }
        }
        const addressValid = verifyAddress(props.myAddress);
        if (!addressValid) {
            props.displayError("Invalid Address!");
            return;
        }
        if (props.tronWeb === null && tronWeb === null) {
            // if the address is valid but We can't get the tronWeb I also return
            props.displayError("Unable to connect to wallet!")
            return;
        }
        // Here if props.tronWeb was null, I use the new tronWeb otherwise use the props.
        // This is relevant because of that first click that, it runs here before props.setTronWeb runs!
        if (props.tronWeb === null) {
            // use the tronWeb object
        } else {
            // use the props.tronWeb object
        }

        //TODO: Now I create a note with this denomination
        // navigate to another page where the note can be downloaded

        console.log(tronWeb);
        console.log("DENOMINATIOn", denomination);
        console.log("CURRENCY", currency);
        console.log("Card Type", cardType);
    }

    return (
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
                            <WalletIcon color="inherit" sx={{ display: 'block' }} />
                        </Grid>
                        <Grid item xs>
                            <TextField
                                fullWidth
                                value={props.myAddress}
                                onChange={addressSetter}
                                placeholder="Enter Your Tron Wallet Address"
                                InputProps={{
                                    disableUnderline: true,
                                    sx: { fontSize: 'default' },
                                }}
                                variant="standard"
                            />
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
            <CardGrid handleSelect={handleSelectGiftCard} cardProps={getCardPropsData("Gift Card")} ></CardGrid>
        </Paper>
    );
}