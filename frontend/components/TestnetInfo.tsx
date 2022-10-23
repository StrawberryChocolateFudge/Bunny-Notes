import { Button, Paper, Typography } from "@mui/material";
import React from "react";
import { getContract, onBoardOrGetTronWeb, TESTNETMINTERC20, USDTMCONTRACTADDRESS } from "../tron";
import { BaseTronUser } from "./Base";
import { ethers } from "ethers";
interface TestnetInfoProps extends BaseTronUser {
}


export function TestnetInfo(props: TestnetInfoProps) {

    async function doMint(tronWeb: any) {
        const contract = await getContract(tronWeb, USDTMCONTRACTADDRESS);
        const address = tronWeb.defaultAddress.base58;
        const amount = ethers.utils.parseEther("1000");
        await TESTNETMINTERC20(contract, address, amount);
    }


    const onMint = async () => {
        if (props.tronWeb === null) {
            const tronWeb = await onBoardOrGetTronWeb(props.displayError)

            if (tronWeb) {
                props.setTronWeb(tronWeb);
                await doMint(tronWeb);
            }
        } else {
            // I call the mint function here too
            await doMint(props.tronWeb);
        }
    }


    return <Paper sx={{ maxWidth: 936, margin: '0 auto', padding: "5px" }}>
        <Typography variant="subtitle1" component="div">We are on testnet! Mint some USDT Mock (USDTM) <Button onClick={onMint} variant="contained">Here</Button> to try out the app.</Typography>
    </Paper>
}

