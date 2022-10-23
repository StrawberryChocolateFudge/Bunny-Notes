import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import WalletIcon from "@mui/icons-material/AccountBalanceWallet"
import { getCardPropsData } from './utils/cardPropsData';
import CardGrid, { CardType } from './CardGrid';
import { BaseTronUser } from './Base';
import { handleCardSelectWithTron } from '../tron/componentParts';
import { NoteDetails } from '../zkp/generateProof';
import { createQR } from '../qrcode/create';
import { downloadNote } from './DownloadNote';
import { onBoardOrGetTronWeb } from '../tron';


interface PurchaseCashNoteProps extends BaseTronUser {

}


export default function PurchaseCashNote(props: PurchaseCashNoteProps) {

    const [renderDownloadPage, setRenderDownloadPage] = React.useState(false);

    const [noteDetails, setNoteDetails] = React.useState<NoteDetails | undefined>(undefined);

    const [qrCodeDataUrl, setQRCodeDataUrl] = React.useState("");

    const [downloadClicked, setDownloadClicked] = React.useState(false);

    const [showApproval, setShowApproval] = React.useState(true);

    React.useEffect(() => {
        async function getQRCode() {
            const details = noteDetails;
            if (details === undefined) {
                setQRCodeDataUrl("");
            } else {
                const dataUrl = await createQR(details[0]);
                setQRCodeDataUrl(dataUrl);
            }
        }
        getQRCode();
    }, [noteDetails])

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


    const handleSelectCashNote = async (denomination: string, currency: string, cardType: CardType) => {
        const res = await handleCardSelectWithTron(props, denomination, currency, cardType)

        if (res !== false) {
            setRenderDownloadPage(true);
            setNoteDetails(res);
        }
    }

    if (renderDownloadPage) {
        return downloadNote({ showApproval, setShowApproval, cardType: "Cash Note", noteDetails, qrCodeDataUrl, downloadClicked, setDownloadClicked, displayError: props.displayError, tronWeb: props.tronWeb })
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
                                value={props.myAddress}
                                onChange={addressSetter}
                                fullWidth
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
            <CardGrid handleSelect={handleSelectCashNote} cardProps={getCardPropsData("Cash Note")} ></CardGrid>
        </Paper>
    );
}