import * as React from 'react';
import Paper from '@mui/material/Paper';
import CardGrid, { CardType } from './CardGrid';
import { getCardPropsData } from './utils/cardPropsData';
import { Base } from './Base';
import { downloadNote } from './DownloadNote';
import { NoteDetails } from '../zkp/generateProof';
import { createQR } from '../qrcode/create';
import { getNoteContractAddress, onBoardOrGetProvider, requestAccounts } from '../web3/web3';
import { Stack, styled, Typography } from '@mui/material';
import { EnterDenominationDialog } from './utils/EnterDenominationDialog';
import { calculateFeeAndNote } from '../web3/calculateFeeAndNote';


interface BunnyNotesPageProps extends Base {
}

export const Center = styled("div")({
    textAlign: "center"
})

const BunnyNotesIMG = styled("img")({
    width: "300px",
    padding: "10px",
});

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

    const [noteFee, setNoteFee] = React.useState("");

    const [noteAddresses, setNoteAddresses] = React.useState<[string, string]>(["erc20", "noteContract"]);

    const [qrCodeDataUrl, setQRCodeDataUrl] = React.useState("");

    const [downloadClicked, setDownloadClicked] = React.useState(false);

    const [showApproval, setShowApproval] = React.useState(true);

    const [cardType, setCardType] = React.useState<CardType>("Bunny Note");

    const [showDenominationInput, setShowDenominationInput] = React.useState(false);

    const [selectedCard, setSelectedCard] = React.useState({ tokenAddress: "", cardType: "", currency: "", isCustom: false });


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


    // Instead of having a bar to import address, you can just select a bunny note and the request accounts will run and provider will be set!
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

    const handleSelectBunnyNote = async (currency: string, cardType: CardType, tokenAddress: string, isCustom: boolean) => {
        setSelectedCard({ currency, cardType, tokenAddress, isCustom });
        setShowDenominationInput(true);
    }

    const handleCloseDenominationDialog = () => {
        setShowDenominationInput(false);
    }

    const handleAcceptDenominationDialog = async (denomination, tokencurrency, tokenAddress) => {
        let currency = selectedCard.isCustom ? tokencurrency : selectedCard.currency;
        let token = selectedCard.isCustom ? tokenAddress : selectedCard.tokenAddress;
        await importAddress();
        const { noteDetails, fee } = await calculateFeeAndNote(denomination, currency, props.selectedNetwork);
        setShowDenominationInput(false);
        const noteContractAddr = getNoteContractAddress(props.selectedNetwork);
        setRenderDownloadPage(true);
        setNoteDetails(noteDetails);
        setNoteAddresses([token, noteContractAddr]);
        setNoteFee(fee);
    }


    if (renderDownloadPage) {
        return downloadNote({
            depositButtonDisabled: props.depositButtonDisabled,
            setDepositButtonDisabled: props.setDepositButtonDisabled,
            navigateToVerifyPage: props.navigateToVerifyPage,
            noteFee,
            selectedNetwork: props.selectedNetwork,
            noteAddresses,
            myAddress: props.myAddress,
            setRenderDownloadPage,
            showApproval,
            setShowApproval,
            cardType,
            noteDetails,
            qrCodeDataUrl,
            downloadClicked,
            setDownloadClicked,
            displayError: props.displayError,
            provider: props.provider
        })
    }

    if (props.selectedNetwork === "") {
        return <React.Fragment></React.Fragment>
    }

    return (
        <React.Fragment>
            <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden' }}>
                <Stack direction={"row"} justifyContent="center">
                    <BunnyNotesIMG alt="Bunny Notes" src="/imgs/BunnyNotes.svg" />
                </Stack>
                <Stack sx={{ padding: "30px" }} direction={"row"} justifyContent="center">
                    <Typography component="p" variant="subtitle1">Bunny Notes are financial claims for value that was deposited into a smart contract. Select the currency,enter the denomination, download the printable note and make a deposit to create one. It can be used to store value without a wallet or to transfer value.</Typography>
                </Stack>
                <CardGrid handleSelect={handleSelectBunnyNote} cardProps={getCardPropsData("Bunny Note", props.selectedNetwork)} ></CardGrid>

            </Paper>
            <EnterDenominationDialog displayError={props.displayError} isCustom={selectedCard.isCustom} showDialog={showDenominationInput} handleClose={handleCloseDenominationDialog} handleOk={handleAcceptDenominationDialog}></EnterDenominationDialog>
        </React.Fragment>
    );
}