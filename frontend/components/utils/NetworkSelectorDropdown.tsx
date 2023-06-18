import React from "react";
import { setSelectedNToSS } from "../../storage/session";
import { networkButtons, networkbuttonWhere } from "../../web3/cardPropsData";
import { MenuItem, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';

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
        <Stack direction="column">
            <Typography sx={{ margin: "0 auto", color: "grey" }} component="div" variant="subtitle1">Selected Network</Typography>
            <Select onChange={onSelected} value={onSelectedNetworkEmpty(props.selectedNetwork)} renderValue={(value: string) => {
                const btn = networkbuttonWhere(value);

                return <div  ><img width="15px" style={{ paddingRight: "10px" }} alt={btn.imageAlt} src={btn.imageSrc} />{btn.cardTypography}</div>
            }} id="networkSelect">
                {networkButtons.map(n => <MenuItem key={n.chainId} value={n.chainId}>{<img width="30px" style={{ paddingRight: "10px" }} alt={n.imageAlt} src={n.imageSrc} />}{n.cardTypography}</MenuItem>)}
            </Select>
        </Stack>
    </React.Fragment>
}