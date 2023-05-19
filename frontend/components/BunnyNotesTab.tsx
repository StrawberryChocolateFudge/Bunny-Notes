import * as React from 'react';
import Paper from '@mui/material/Paper';
import CardGrid, { CardType } from './CardGrid';
import { Base } from './Base';
import { downloadNote } from './DownloadNote';
import { NoteDetails } from '../zkp/generateProof';
import { createQR } from '../qrcode/create';
import { getNoteContractAddress, } from '../web3/web3';
import { Button, Link, MenuItem, Select, SelectChangeEvent, Stack, styled, Typography } from '@mui/material';
import { EnterDenominationDialog } from './utils/EnterDenominationDialog';
import { calculateFeeAndNote } from '../web3/calculateFeeAndNote';
import { setSelectedNToSS } from '../storage/session';
import { getCardPropsData, networkButtons, networkbuttonWhere } from '../web3/cardPropsData';


interface BunnyNotesPageProps extends Base {
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

    const [selectedCard, setSelectedCard] = React.useState({ tokenAddress: "", cardType: "", currency: "", isCustom: false, isFeeless: false });

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


    const handleSelectBunnyNote = async (currency: string, cardType: CardType, tokenAddress: string, isCustom: boolean, isFeeless: boolean) => {
        setSelectedCard({ currency, cardType, tokenAddress, isCustom, isFeeless });
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
            depositButtonDisabled: props.depositButtonDisabled,
            setDepositButtonDisabled: props.setDepositButtonDisabled,
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
            <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden' }}>
                <Stack direction="row" justifyContent={"center"}>
                    <Stack direction={"column"} justifyContent="center">
                        <BunnyNotesExplainerVideo></BunnyNotesExplainerVideo>
                    </Stack>
                </Stack>
                <Stack sx={{ padding: "30px" }} direction={"row"} justifyContent="center">
                    <Typography component="p" variant="subtitle1">Bunny Notes are verifiable claims for value that was deposited into a smart contract. Select the currency, enter the denomination, download the printable note and make a deposit to create one. By using the application you accept the <Link href="/terms" target="_blank"> Terms and Conditions.</Link>
                    </Typography>
                </Stack>
                {/* <Stack direction="row" justifyContent="center">
                    <Button href="/tokensale" sx={{ margin: "0 auto" }}>Visit the Token Sale Page (on BSC)</Button>
                </Stack> */}
                <Stack direction={"row"} justifyContent="center">
                    {NetworkSelectorDropdown(
                        {
                            setSelectedNetwork: props.setSelectedNetwork,
                            selectedNetwork: props.selectedNetwork,
                            displayError: props.displayError,
                        }
                    )}
                </Stack>
                <CardGrid handleSelect={handleSelectBunnyNote} cardProps={getCardPropsData("Bunny Note", onSelectedNetworkEmpty(props.selectedNetwork))} ></CardGrid>

            </Paper>
            <EnterDenominationDialog displayError={props.displayError} isFeeless={selectedCard.isFeeless} isCustom={selectedCard.isCustom} showDialog={showDenominationInput} handleClose={handleCloseDenominationDialog} handleOk={handleAcceptDenominationDialog}></EnterDenominationDialog>
        </React.Fragment>
    );
}

export interface SelectNetworkProps {
    setSelectedNetwork: (n: string) => void;
    selectedNetwork: string;
    displayError: (err: string) => void;
}

export function onSelectedNetworkEmpty(selectedNetwork: string) {
    return selectedNetwork === "" ? networkButtons[0].chainId : selectedNetwork;
}

export function NetworkSelectorDropdown(props: SelectNetworkProps) {

    const networkSelected = (networkId: string) => {
        setSelectedNToSS(networkId);
        props.setSelectedNetwork(networkId)

    }

    const onSelected = (event: SelectChangeEvent<string>) => {
        networkSelected(event.target.value);

    };

    return <React.Fragment>
        <Select onChange={onSelected} value={onSelectedNetworkEmpty(props.selectedNetwork)} renderValue={(value: string) => {
            const btn = networkbuttonWhere(value);
            return <React.Fragment><img width="15px" style={{ paddingRight: "10px" }} alt={btn.imageAlt} src={btn.imageSrc} />{btn.cardTypography}</React.Fragment>
        }} id="networkSelect">
            {networkButtons.map(n => <MenuItem key={n.chainId} value={n.chainId}>{<img width="30px" style={{ paddingRight: "10px" }} alt={n.imageAlt} src={n.imageSrc} />}{n.cardTypography}</MenuItem>)}
        </Select>
    </React.Fragment>

}