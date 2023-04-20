import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, Divider, Stack, TextField } from "@mui/material"
import { isAddress } from "ethers/lib/utils";
import React from "react"

interface EnterDenominationDialogProps {
    handleOk: CallableFunction,
    handleClose: CallableFunction,
    showDialog: boolean,
    isCustom: boolean,
    displayError: CallableFunction
}

export function EnterDenominationDialog(props: EnterDenominationDialogProps) {
    const [amount, setAmount] = React.useState("");
    const [tokenAddress, setTokenAddress] = React.useState("");
    const [tokenTicker, setTokenTicker] = React.useState("");

    const handleClose = (event: object, reason: string) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return
        }
        props.handleClose();
    }

    const proceed = () => {
        if (props.isCustom) {
            if (!isAddress(tokenAddress)) {
                props.displayError("Invalid Address");
                return;
            }
            if (tokenTicker === "") {
                props.displayError("Please Enter a Ticker");
                return;
            }

        }
        if (isNaN(parseFloat(amount))) {
            props.displayError("Please enter the correct denomination")
            return;
        }
        if (parseFloat(amount) === 0) {
            props.displayError("Please enter the correct denomination");
            return;
        }

        props.handleOk(amount, tokenTicker, tokenAddress);
    }

    const renderCustomInputs = () => {
        return <React.Fragment>
            <TextField autoFocus={props.isCustom} sx={{ marginBottom: "10px" }} autoComplete="off" placeholder="..." label="Currency (Ticker)" type={"text"} value={tokenTicker} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTokenTicker(event.target.value);
            }}></TextField>

            <TextField sx={{ marginBottom: "10px" }} autoComplete="off" placeholder="0x" label="Token Address" type={"text"} value={tokenAddress} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTokenAddress(event.target.value);
            }}></TextField>
        </React.Fragment>
    }


    return <Dialog open={props.showDialog} onClose={handleClose}>
        <DialogContent>

            <Divider sx={{ marginBottom: "10px" }} light />
            <Stack direction="column" justifyContent={"space-around"}>
                {props.isCustom ? renderCustomInputs() : null}

                <TextField autoFocus={!props.isCustom} sx={{ marginBottom: "10px" }} autoComplete="off" placeholder="Face Value" label="Denomination" type={"number"} value={amount} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setAmount(event.target.value);
                }}></TextField>
                <DialogContentText>
                    The entered denomination is the note's face value. A 1% fee is charged on deposit.
                </DialogContentText>
            </Stack>
            <Divider sx={{ marginBottom: "10px" }} light />
            <Stack direction="row" justifyContent={"space-evenly"}>
                <Button onClick={() => props.handleClose()} variant="outlined">Cancel</Button>
                <Button onClick={() => proceed()} variant="contained">Proceed</Button>
            </Stack>
        </DialogContent>
    </Dialog>
}