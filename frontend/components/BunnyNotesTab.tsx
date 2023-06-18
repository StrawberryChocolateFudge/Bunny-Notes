import * as React from 'react';
import Paper from '@mui/material/Paper';
import CardGrid, { CardType } from './CardGrid';
import { BaseProps } from './Base';
import { downloadNote } from './DownloadNote';
import { NoteDetails } from '../zkp/generateProof';
import { createQR } from '../qrcode/create';
import { getNoteContractAddress, } from '../web3/web3';
import { Button, Link, Stack, styled, Typography } from '@mui/material';
import { EnterDenominationDialog } from './utils/EnterDenominationDialog';
import { calculateFeeAndNote } from '../web3/calculateFeeAndNote';
import { NetworkSelectorDropdown, onSelectedNetworkEmpty } from './utils/NetworkSelectorDropdown';
import { getCardPropsData } from '../web3/cardPropsData';
import { paperBackgroundGradient } from './theme';


interface BunnyNotesPageProps extends BaseProps {
}

export const Center = styled("div")({
    textAlign: "center"
})

const LogoIMG = styled("img")({
    width: "200px",
    padding: "10px",
    margin: "0 auto"
})


const EXPLAINER = styled("video")({
    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
    alignSelf: "center",
    marginBottom: "20px",
    width: "300px",
    height: '300px',
    borderRadius: "25px"
})

function BunnyNotesExplainerVideo() {
    return <EXPLAINER controls poster="/imgs/BunnyLogo.jpg" src="https://tio5nkhyzsqo3wedf4novipuspwvch4t6szdxuqq55noxtnbmp5q.arweave.net/mh3WqPjMoO3Ygy8a6qH0k-1RH5P0sjvSEO9a682hY_s"></EXPLAINER>
}



export function BunnyNotesTab(props: BunnyNotesPageProps) {

    const [renderDownloadPage, setRenderDownloadPage] = React.useState(false);

    const [noteDetails, setNoteDetails] = React.useState<NoteDetails | undefined>(undefined);

    const [noteFee, setNoteFee] = React.useState("");

    const [noteAddresses, setNoteAddresses] = React.useState<[string, string]>(["erc20", "noteContract"]);

    const [qrCodeDataUrl, setQRCodeDataUrl] = React.useState("");

    const [downloadClicked, setDownloadClicked] = React.useState(false);

    const [showApproval, setShowApproval] = React.useState(true);

    const [cardType, setCardType] = React.useState<CardType>("Bunny Note");

    const [showDenominationInput, setShowDenominationInput] = React.useState(false);

    const [selectedCard, setSelectedCard] = React.useState({ tokenAddress: "", cardType: "", currency: "", isCustom: false, isFeeless: false, description: "" });

    // Track if the deposit button is disabled with state stored here
    const [depositButtonDisabled, setDepositButtonDisabled] = React.useState(true);

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


    const handleSelectBunnyNote = async (currency: string, cardType: CardType, tokenAddress: string, isCustom: boolean, isFeeless: boolean, description: string) => {
        setSelectedCard({ currency, cardType, tokenAddress, isCustom, isFeeless, description });
        setShowDenominationInput(true);
    }

    const handleCloseDenominationDialog = () => {
        setShowDenominationInput(false);
    }

    const handleAcceptDenominationDialog = async (denomination, tokencurrency, tokenAddress) => {
        let currency = selectedCard.isCustom ? tokencurrency : selectedCard.currency;
        let token = selectedCard.isCustom ? tokenAddress : selectedCard.tokenAddress;
        const { noteDetails, fee } = await calculateFeeAndNote(denomination, currency, props.selectedNetwork);
        setShowDenominationInput(false);
        const noteContractAddr = getNoteContractAddress(props.selectedNetwork);
        setRenderDownloadPage(true);
        setNoteDetails(noteDetails);
        setNoteAddresses([token, noteContractAddr]);

        if (selectedCard.isFeeless) {
            setNoteFee("0");
        } else {
            setNoteFee(fee);
        }

    }

    if (renderDownloadPage) {
        return downloadNote({
            depositButtonDisabled,
            setDepositButtonDisabled,
            navigateToVerifyPage: props.navigateToVerifyPage,
            noteFee,
            selectedNetwork: props.selectedNetwork,
            noteAddresses,
            setRenderDownloadPage,
            showApproval,
            setShowApproval,
            cardType,
            noteDetails,
            qrCodeDataUrl,
            downloadClicked,
            setDownloadClicked,
            displayError: props.displayError,
            isFeeless: selectedCard.isFeeless
        })
    }

    return (
        <React.Fragment>
            <Paper elevation={3} sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden', background: paperBackgroundGradient }}>
                <Stack direction="row" justifyContent={"center"}>
                    <Stack direction={"column"} justifyContent="center">
                        <BunnyNotesExplainerVideo></BunnyNotesExplainerVideo>
                    </Stack>
                </Stack>
                <Stack sx={{ padding: "30px" }} direction={"row"} justifyContent="center">
                    <Typography sx={{ fontFamily: `Sans-Serif`, fontWeight: 600 }} component="div" variant="h6">Bunny Notes are verifiable claims for value that was deposited into a smart contract. Select the currency, enter the denomination, download the printable note and make a deposit to create one. By using the application you accept the <Link href="/terms" target="_blank"> Terms and Conditions.</Link>
                    </Typography>
                </Stack>
                <Stack direction="row" justifyContent="center">
                    <Button href="/tokensale" sx={{ margin: "0 auto" }}>Visit the Token Sale Page (on BSC)</Button>
                </Stack>
                <div style={{ marginBottom: "20px" }} ></div>
                <Stack direction={"row"} justifyContent="center">
                    {NetworkSelectorDropdown(
                        {
                            setSelectedNetwork: props.setSelectedNetwork,
                            selectedNetwork: props.selectedNetwork,
                            displayError: props.displayError,
                        }
                    )}
                </Stack>
                <CardGrid handleSelect={handleSelectBunnyNote} cardProps={getCardPropsData("Bunny Note", onSelectedNetworkEmpty(props.selectedNetwork), false)} ></CardGrid>

            </Paper>
            <EnterDenominationDialog
                displayError={props.displayError}
                description={selectedCard.description}
                isFeeless={selectedCard.isFeeless}
                isCustom={selectedCard.isCustom}
                showDialog={showDenominationInput}
                handleClose={handleCloseDenominationDialog}
                handleOk={handleAcceptDenominationDialog}></EnterDenominationDialog>
        </React.Fragment>
    );
}
