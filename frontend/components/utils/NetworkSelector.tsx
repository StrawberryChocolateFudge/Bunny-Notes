import { Link, Button, Card, Dialog, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, MenuItem, Select, SelectChangeEvent, Stack, styled, Tooltip, Typography } from "@mui/material";
import React from "react";
import { setTermsAcceptedToLS } from "../../storage/local";
import { setSelectedNToSS } from "../../storage/session";
import { networkButtons, NetworkSelectProps } from "../../web3/cardPropsData";
import { handleNetworkSelect } from "../../web3/web3";
import { CheckWebsiteURLWarning } from "./CheckWebsiteURLWarning";
import { TermsCheckbox } from "./TermsCheckbox";

interface SelectNetworkProps {
    setSelectedNetwork: (n: string) => void;
    selectedNetwork: string;
    showNetworkSelect: boolean;
    setShowNetworkSelect: (s: boolean) => void;
    displayError: (err: string) => void;
    setProvider: (provider: any) => void;
    termsAccepted: boolean;
    setTermsAccepted: (to: boolean) => void;
}

const IMG = styled("img")({
    width: "288px",
    alignSelf: 'center'
})

const WALLETICON = styled("img")({
    marginLeft: "25px",
    marginRight: "25px"
})

const EXPLAINER = styled("video")({
    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
    alignSelf: "center",
    marginBottom: "20px",
    width: "300px",
    height: '300px',
    borderRadius: "25px"
})

type NetworkSelectButtonBuilderProps = {
    networks: NetworkSelectProps[],
    networkSelected: CallableFunction
};

export function NetworkSelectButtonBuilder(props: NetworkSelectButtonBuilderProps): React.ReactElement[] {
    return props.networks.map(network => <Tooltip key={network.chainId} arrow title={network.tooltipTitle}>
        <Button onClick={props.networkSelected(network.chainId)} >
            <Card sx={{ padding: "5px", width: "200px", paddingTop: "20px" }}>
                <img width="50px" alt={network.imageAlt} src={network.imageSrc} />
                <Typography gutterBottom variant="subtitle1" component="div" >{network.cardTypography}</Typography>
            </Card>
        </Button></Tooltip>)
}



export function SelectNetworkDialog(props: SelectNetworkProps) {

    const handleNetworkChange = (event: SelectChangeEvent) => {
        props.setSelectedNetwork(event.target.value);
    }

    const handleClose = (event: object, reason: string) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return
        }
    };

    const networkSelected = (networkId: string) => async () => {
        if (!props.termsAccepted) {
            props.displayError("Please accept the terms and conditions!")
            return;
        }

        setSelectedNToSS(networkId);
        // Connect to metamask, switch or add the network
        // add the provider or not don't matter if it works!
        const provider = await handleNetworkSelect(networkId, props.displayError);
        if (provider) {
            props.setProvider(provider);
            props.setSelectedNetwork(networkId)
            props.setShowNetworkSelect(false);
        }
    }

    const onTermsChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setTermsAccepted(event.target.checked);
        setTermsAcceptedToLS(event.target.checked.toString());
    }

    const availableWallets = () => {

        return <Stack justifyContent={"center"} flexDirection="row" sx={{ width: "300px", margin: "0 auto" }}>
            <WALLETICON width="35px" src="/imgs/metamaskFox.svg" />
            <WALLETICON width="60px" src="/imgs/trustWalletLogo.svg" />
            <WALLETICON width="30px" src="/imgs/braveLogo.svg" />
        </Stack>
    }

    const TwitterButton = () => {
        return <Stack justifyContent={"center"} flexDirection="column" sx={{ paddingTop: "20px" }}>
            <Stack justifyContent="center" flexDirection="row">
                <Link target="_blank" href="https://twitter.com/BunnyNotes_Guy"><img height={"20px"} src="/imgs/twitterLogo.svg" /></Link>
            </Stack>
        </Stack>
    }

    return <Dialog fullScreen open={props.showNetworkSelect} onClose={handleClose}>
        <CheckWebsiteURLWarning />

        <Button href="/tokensale" sx={{ margin: "0 auto" }}>Visit the Token Sale Page (on BSC)</Button>
        <DialogContent>
            <Stack direction="column" justifyContent="center">
                {BunnyNotesExplainerVideo()}
                <IMG alt="Bunny Notes Title" src="/imgs/BunnyNotes.svg" />
            </Stack>

            <DialogContentText sx={{ textAlign: "center" }}>
                Select the network to continue
            </DialogContentText>
            <TermsCheckbox termsAccepted={props.termsAccepted} onTermsChecked={onTermsChecked}></TermsCheckbox>
            {/* <Stack direction={"column"} justifyContent="center" alignContent={"center"}> */}
            <Stack direction={"row"} justifyContent="center" flexWrap="wrap">
                {NetworkSelectButtonBuilder({ networks: networkButtons, networkSelected })}
            </Stack>
            {/* </Stack> */}
            <DialogContentText sx={{ textAlign: "center" }}>
                Supported wallets:
            </DialogContentText>
            {availableWallets()}

        </DialogContent>

    </Dialog>
}

function BunnyNotesExplainerVideo() {
    return <EXPLAINER controls poster="/imgs/BunnyLogo.jpg" src="/imgs/BunnyNotes_video.mp4"></EXPLAINER>
}