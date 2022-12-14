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
import { Base, Spacer } from './Base';
import { downloadNote } from './DownloadNote';
import { NoteDetails } from '../zkp/generateProof';
import { createQR } from '../qrcode/create';
import { onBoardOrGetProvider, requestAccounts } from '../web3/web3';
import { handleCardSelectWithProvider } from '../web3/componentParts';
import { styled } from '@mui/material';

interface GiftCardPageProps extends Base {

}

export const Center = styled("div")({
    textAlign: "center"
})

export default function PurchaseGiftCardTab(props: GiftCardPageProps) {

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
        if (props.provider === null) {
            const provider = await onBoardOrGetProvider(props.displayError);

            if (provider) {
                const account = await requestAccounts(provider);
                props.setMyAddress(account);
                props.setProvider(provider);
            }

        } else {
            const account = await requestAccounts(props.provider);
            props.setMyAddress(account);
        }
    }

    const handleSelectGiftCard = async (denomination: string, currency: string, cardType: CardType) => {
        const res = await handleCardSelectWithProvider(props, denomination, currency, cardType)

        if (res !== false) {
            setRenderDownloadPage(true);
            setNoteDetails(res);
        }
    }

    if (renderDownloadPage) {
        return downloadNote({ setRenderDownloadPage, showApproval, setShowApproval, cardType: "Gift Card", noteDetails, qrCodeDataUrl, downloadClicked, setDownloadClicked, displayError: props.displayError, provider: props.provider })
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
                                placeholder="Enter Your Wallet Address"
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
            <Center>
                <Spacer></Spacer>
                <Button target="_blank" variant="outlined" href="https://bt.io/wallet/?language=EN">My Assets</Button>
            </Center>
            <CardGrid handleSelect={handleSelectGiftCard} cardProps={getCardPropsData("Gift Card")} ></CardGrid>
        </Paper>
    );
}