import { Button, Link, Paper, Stack, Tooltip, Typography } from "@mui/material";
import React from "react";
import { calculateFeeAndBundle } from "../web3/calculateFeeAndNote";
import { getCardPropsData } from "../web3/cardPropsData";
import { getBundlesContractAddress } from "../web3/web3";
import { BaseProps } from "./Base";
import CardGrid, { CardType } from "./CardGrid";
import { downloadBundle } from "./downloadBundle";
import { paperBackgroundGradient } from "./theme";
import { EnterBundleDetailsDialog } from "./utils/EnterBundleDetailsDialog";
import { NetworkSelectorDropdown, onSelectedNetworkEmpty } from "./utils/NetworkSelectorDropdown";

interface BunnyNotesPageProps extends BaseProps {
}


export function BunnyBundlesTab(props: BunnyNotesPageProps) {



    const [selectedCard, setSelectedCard] = React.useState({ tokenAddress: "", cardType: "", currency: "", isCustom: false, isFeeless: false, description: "" });
    const [showparametersInput, setShowParametersInput] = React.useState(false);
    const [bundleFee, setBundleFee] = React.useState("");
    const [bundleValue, setBundleValue] = React.useState("");
    const [bundleSize, setBundleSize] = React.useState(0);
    const [bundleCurrency, setBundleCurrency] = React.useState("");
    const [renderDownloadPage, setRenderDownloadPage] = React.useState(false);
    const [bundleDetails, setBundleDetails] = React.useState<any | undefined>(undefined);
    const [bundleAddresses, setBundleAddresses] = React.useState<[string, string]>(["erc20", "bundleContract"]);
    const [downloadClicked, setDownloadClicked] = React.useState(false);
    const [cardType, setCardType] = React.useState<CardType>("Bunny Note");

    const [downloadBundlePressed, setDownloadBundlePressed] = React.useState(false);
    // Track if the deposit button is disabled with state stored here
    const [depositButtonDisabled, setDepositButtonDisabled] = React.useState(true);

    const [showApproval, setShowApproval] = React.useState(true);

    const handleSelectBunnyNote = async (currency: string, cardType: CardType, tokenAddress: string, isCustom: boolean, isFeeless: boolean, description: string) => {
        setSelectedCard({ currency, cardType, tokenAddress, isCustom, isFeeless, description });
        setShowParametersInput(true);
    }
    const handleCloseInputDialog = () => {
        setShowParametersInput(false);
    }

    const handleAcceptParametersDialog = async (
        bundleValue: string,
        bundleSize: string,
        tokenTicker: string,
        tokenAddress: string) => {
        let currency = selectedCard.isCustom ? tokenTicker : selectedCard.currency;
        let token = selectedCard.isCustom ? tokenAddress : selectedCard.tokenAddress;
        const netId: number = parseInt(props.selectedNetwork);
        const size: number = parseInt(bundleSize);
        setBundleSize(size);

        const { bundle, fee } = await calculateFeeAndBundle(bundleValue, size, currency, netId);

        const bundleContractAddr = getBundlesContractAddress(props.selectedNetwork);
        setBundleDetails(bundle);
        setBundleAddresses([token, bundleContractAddr]);
        setBundleValue(bundleValue);
        setBundleCurrency(currency);
        if (selectedCard.isFeeless) {
            setBundleFee("0");
        } else {
            setBundleFee(fee);
        }
        setShowParametersInput(false);
        setRenderDownloadPage(true);
    }

    const nftDeployClicked = () => {
        // /?TODO: IMPLEMENT
    }

    if (renderDownloadPage) {
        return downloadBundle({
            cardType,
            bundleDetails,
            bundleValue,
            bundleCurrency,
            bundleFee,
            bundleAddresses,
            bundleSize,
            downloadClicked,
            setDownloadClicked,
            displayError: props.displayError,
            depositButtonDisabled,
            setDepositButtonDisabled,
            selectedNetwork: props.selectedNetwork,
            isFeeless: selectedCard.isFeeless,
            showApproval,
            setShowApproval,
            setRenderDownloadPage,
            downloadBundlePressed,
            setDownloadBundlePressed
        })
    }

    return <React.Fragment>
        <Paper elevation={3} sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden', background: paperBackgroundGradient }}>
            <Stack direction="row" justifyContent={"center"}>
                <Stack direction={"column"} justifyContent="center">
                    <img src="/imgs/BunnyLogo.jpg" width={"300px"} />
                </Stack>
            </Stack>
            <Stack sx={{ padding: "30px" }} direction={"row"} justifyContent="center">
                <Typography sx={{ fontFamily: `Sans-Serif`, fontWeight: 600 }} component="div" variant="h6">
                    Bunny Bundles are Bunny Notes created in bulk using cryptography. Create cost effective mass payments and airdrops. Pay gas once on deposit then distribute notes to the recipients who can withdraw the value.
                    By using the application you accept the <Link href="/terms" target="_blank"> Terms and Conditions.</Link>
                </Typography>
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

            <div style={{ marginBottom: "20px" }} ></div>
            <CardGrid handleSelect={handleSelectBunnyNote} cardProps={getCardPropsData("Bunny Note", onSelectedNetworkEmpty(props.selectedNetwork), true)} ></CardGrid>

        </Paper>
        <EnterBundleDetailsDialog
            displayError={props.displayError}
            description={selectedCard.description}
            isFeeless={selectedCard.isFeeless}
            isCustom={selectedCard.isCustom}
            showDialog={showparametersInput}
            handleClose={handleCloseInputDialog}
            handleOk={handleAcceptParametersDialog}
            isNFT={selectedCard.currency === "NFT"}
        ></EnterBundleDetailsDialog>
    </React.Fragment>
}


