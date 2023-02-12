import { Stack, Switch, Tooltip, Typography, styled } from "@mui/material";
import { minWidth } from "@mui/system";
import React from "react";


export interface PayGasToggleProps {
    payGasToggleChecked: boolean;
    setPayGasToggleChecked: (to: boolean) => void;
}


export function PayGasToggle(props: PayGasToggleProps) {
    const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setPayGasToggleChecked(event.target.checked);
    };
    function SwitchTypography(tooltipTitle: string, text: string) {

        const handleClick = () => {
            if (text === "Gasless") {
                props.setPayGasToggleChecked(false);
            } else {
                props.setPayGasToggleChecked(true);
            }
        }


        return <Tooltip arrow title={tooltipTitle}>
            <Typography onClick={handleClick} sx={{ cursor: "pointer" }} component={"div"} variant="subtitle2">{text}</Typography></Tooltip>;
    }



    return <Stack
        direction="row"
        spacing={1}
        justifyContent={"center"}
        alignItems="center">


        {SwitchTypography("Relayed transaction. Our backend will submit it to the network.", "Gasless")}
        <Switch onChange={handleToggle} checked={props.payGasToggleChecked}></Switch>
        {SwitchTypography("Use the Browser Wallet to sign the transaction.", "Pay Gas")}

    </Stack>
}