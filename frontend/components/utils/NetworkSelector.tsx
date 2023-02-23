import { Button, Card, Checkbox, Dialog, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, InputLabel, Link, MenuItem, Select, SelectChangeEvent, Stack, styled, TextField, Tooltip, Typography } from "@mui/material";
import React from "react";
import { setTermsAcceptedToLS } from "../../storage/local";
import { setSelectedNToSS } from "../../storage/session";
import { BTTCTESTNETID, handleNetworkSelect } from "../../web3/web3";
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
    width: "300px",
    alignSelf: 'center'
})

export function SelectNetwork(props: SelectNetworkProps) {
    const handleNetworkChange = (event: SelectChangeEvent) => {
        props.setSelectedNetwork(event.target.value);
    }

    return <Stack direction="row" justifyContent={"flex-end"}>
        <FormControl variant="standard" sx={{ width: "200px" }}>
            <Select
                id="network-select"
                value={props.selectedNetwork}
                label="Network"
                onChange={handleNetworkChange}
            >
                <MenuItem value={BTTCTESTNETID}>Bittorrent Chain</MenuItem>
            </Select>
        </FormControl>
    </Stack>;
}


type NetworkSelectProps = {
    tooltipTitle: string,
    chainId: string,
    imageAlt: string,
    imageSrc: string,
    cardTypography: string,
}

type NetworkSelectButtonBuilderProps = {
    networks: NetworkSelectProps[],
    networkSelected: CallableFunction
};

export function NetworkSelectButtonBuilder(props: NetworkSelectButtonBuilderProps): React.ReactElement[] {
    return props.networks.map(network => <Tooltip key={network.chainId} arrow title={network.tooltipTitle}>
        <Button onClick={props.networkSelected(network.chainId)}>
            <Card sx={{ padding: "5px" }}>
                <img width="50px" alt={network.imageAlt} src={network.imageSrc} />
                <Typography gutterBottom variant="subtitle1" component="div" >{network.cardTypography}</Typography>
            </Card>
        </Button></Tooltip>)
}

const networkButtons: NetworkSelectProps[] = [
    {
        tooltipTitle: "Select Bittorrent Chain",
        chainId: "0x405",
        imageAlt: "Bittorrent Chain",
        imageSrc: "/imgs/bttLogo.svg",
        cardTypography: "BTTC Testnet"
    },
    {
        tooltipTitle: " Select Fantom",
        chainId: "0xfa2",
        imageAlt: "Fantom",
        imageSrc: "/imgs/FantomLogo.svg",
        cardTypography: "Fantom Testnet"
    }
]


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

        return <Stack justifyContent={"space-around"} flexDirection="row">
            <img width="35px" src="/imgs/metamaskFox.svg" />
            <img width="60px" src="/imgs/trustWalletLogo.svg" />
            <img width="30px" src="/imgs/braveLogo.svg" />
        </Stack>
    }

    return <Dialog open={props.showNetworkSelect} onClose={handleClose}>
        <CheckWebsiteURLWarning />

        <DialogTitle sx={{ paddingBottom: "0", marginBottom: "0", display: "flex", justifyContent: "center" }}><IMG alt="Bunny Notes Title" src="/imgs/BunnyNotes.svg" /></DialogTitle>
        <DialogContent>
            <DialogContentText sx={{ textAlign: "center" }}>
                A Gift Card and Cash Note Protocol
            </DialogContentText>
            <Divider light />
            <Stack direction={"row"} justifyContent="center">
                {NetworkSelectButtonBuilder({ networks: networkButtons, networkSelected })}
            </Stack>
            <Divider light />
            <TermsCheckbox termsAccepted={props.termsAccepted} onTermsChecked={onTermsChecked}></TermsCheckbox>
            {availableWallets()}

        </DialogContent>

    </Dialog>
}