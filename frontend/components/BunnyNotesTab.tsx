import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import CardGrid, { CardType } from './CardGrid';
import { getCardPropsData } from './utils/cardPropsData';
import { Base } from './Base';
import { downloadNote } from './DownloadNote';
import { NoteDetails } from '../zkp/generateProof';
import { createQR } from '../qrcode/create';
import { onBoardOrGetProvider, requestAccounts } from '../web3/web3';
import { handleCardSelectWithProvider } from '../web3/componentParts';
import { Stack, styled, Switch } from '@mui/material';
import ScanNoteButton from './QRScannerModal';


interface BunnyNotesPageProps extends Base {

}

export const Center = styled("div")({
    textAlign: "center"
})

const GiftCardIMG = styled("img")({
    width: "150px",
    padding: "10px",
    cursor: "pointer"
})

const CashNoteIMG = styled("img")({
    width: "150px",
    padding: "10px",
    cursor: "pointer"
})

export default function BunnyNotesTab(props: BunnyNotesPageProps) {

    const [renderDownloadPage, setRenderDownloadPage] = React.useState(false);

    const [noteDetails, setNoteDetails] = React.useState<NoteDetails | undefined>(undefined);

    const [noteAddresses, setNoteAddresses] = React.useState<[string, string]>(["erc20", "noteContract"]);

    const [qrCodeDataUrl, setQRCodeDataUrl] = React.useState("");

    const [downloadClicked, setDownloadClicked] = React.useState(false);

    const [showApproval, setShowApproval] = React.useState(true);

    const [cardType, setCardType] = React.useState<CardType>("Gift Card");

    const [checkForBunnyWallet, setCheckForBunnyWallet] = React.useState(true)

    const handleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {

        if (event.target.checked) {
            setCardType("Cash Note");
        } else {
            setCardType("Gift Card")
        }

    }

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
        setCheckForBunnyWallet(true);
    }

    const setScannedAddress = (d: string) => {
        props.setMyAddress(d);
        setCheckForBunnyWallet(true);
    }

    const importAddress = async () => {
        if (props.provider === null) {
            const provider = await onBoardOrGetProvider(props.displayError);

            if (provider) {
                const account = await requestAccounts(provider);
                props.setMyAddress(account);
                props.setProvider(provider);
                setCheckForBunnyWallet(false);
            }

        } else {
            const account = await requestAccounts(props.provider);
            props.setMyAddress(account);
            setCheckForBunnyWallet(false);
        }
    }

    const handleSelectGiftCard = async (denomination: string, currency: string, cardType: CardType, addresses: [string, string]) => {
        const res = await handleCardSelectWithProvider(props, denomination, currency, cardType, props.selectedNetwork)

        if (res !== false) {
            setRenderDownloadPage(true);
            setNoteDetails(res);
            setNoteAddresses(addresses);
        }
    }

    const handleSelectCashNote = async (denomination: string, currency: string, cardType: CardType, addresses: [string, string]) => {
        const res = await handleCardSelectWithProvider(props, denomination, currency, cardType, props.selectedNetwork)

        if (res !== false) {
            setRenderDownloadPage(true);
            setNoteDetails(res);
            setNoteAddresses(addresses);
        }
    }

    const handleClickImage = (cardType: CardType) => () => {
        setCardType(cardType);
    }

    if (renderDownloadPage) {
        return downloadNote({ selectedNetwork: props.selectedNetwork, noteAddresses, myAddress: props.myAddress, checkForBunnyWallet, setRenderDownloadPage, showApproval, setShowApproval, cardType, noteDetails, qrCodeDataUrl, downloadClicked, setDownloadClicked, displayError: props.displayError, provider: props.provider })
    }

    if (props.selectedNetwork === "") {
        return <React.Fragment></React.Fragment>
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
                            <ScanNoteButton dialogTitle='Scan a Wallet Address' setData={setScannedAddress} handleError={props.displayError}></ScanNoteButton>
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
                                    Import Address                                </Button>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Center>
                <Stack justifyContent={"center"} direction="row" spacing={1} alignItems={"center"}>
                    <Tooltip title="Select Gift Cards">
                        <GiftCardIMG sx={{
                            opacity: cardType === "Cash Note" ? "0.3" : "1"
                        }} alt="Gift Card" src="/imgs/giftCard.svg" onClick={handleClickImage("Gift Card")} />
                    </Tooltip>
                    <Tooltip title="Switch between Gift Card and Cash Note">
                        <Switch checked={cardType === "Cash Note"} onChange={handleChecked}></Switch>
                    </Tooltip>
                    <Tooltip title="Select Cash Notes">
                        <CashNoteIMG sx={{
                            opacity: cardType === "Gift Card" ? "0.3" : 1
                        }} alt="Cash Note" src="/imgs/cashNote.svg" onClick={handleClickImage("Cash Note")} />
                    </Tooltip>
                </Stack>
            </Center>{cardType === "Cash Note" ? <CardGrid handleSelect={handleSelectCashNote} cardProps={getCardPropsData("Cash Note", props.selectedNetwork)} ></CardGrid>
                : <CardGrid handleSelect={handleSelectGiftCard} cardProps={getCardPropsData("Gift Card", props.selectedNetwork)} ></CardGrid>
            }
        </Paper>
    );
}