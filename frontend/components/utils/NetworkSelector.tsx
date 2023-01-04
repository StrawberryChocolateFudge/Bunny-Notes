import { Button, Card, Dialog, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, styled, TextField, Tooltip, Typography } from "@mui/material";
import React from "react";
import { setSelectedNToSS } from "../../storage/session";
import { BTTCTESTNETID, handleNetworkSelect } from "../../web3/web3";
import { Center } from "../BunnyNotesTab";

interface SelectNetworkProps {
    setSelectedNetwork: (n: string) => void;
    selectedNetwork: string;
    showNetworkSelect: boolean;
    setShowNetworkSelect: (s: boolean) => void;
    displayError: (err: string) => void;
    setProvider: (provider: any) => void;
}

const IMG = styled("img")({
    width: "300px",
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingTop: "10px",
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


    return <Dialog open={props.showNetworkSelect} onClose={handleClose}>
        <DialogTitle sx={{ paddingBottom: "0", marginBottom: "0" }}><IMG alt="Bunny Notes Title" src="/imgs/BunnyNotes.svg" /></DialogTitle>
        <DialogContent>
            <DialogContentText sx={{ textAlign: "center" }}>
                A Gift Card and Cash Note Protocol
            </DialogContentText>
            <Center>
                {NetworkCardButtons({ networkSelected })}
            </Center>
            <Typography sx={{ textAlign: "center" }} variant="subtitle2" component="div">Select Network</Typography>
        </DialogContent>
    </Dialog>
}

export function NetworkCardButtons(props: any) {
    //Single button, hardcoded to select BTTC Chain for now
    return <Tooltip arrow title="Select Bittorrent Chain">
        <Button onClick={props.networkSelected("0x405")}>
            <Card sx={{ padding: "5px" }}>
                <img width="50px" alt="Bittorrent Chain" src="/imgs/bttLogo.svg" />
                <Typography gutterBottom variant="subtitle1" component="div" >BTTC Donau Testnet</Typography>
            </Card>
        </Button></Tooltip>
}