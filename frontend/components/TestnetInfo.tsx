import { Button, Paper, Typography } from "@mui/material";
import React from "react";
import { Base, Spacer } from "./Base";
import { ethers } from "ethers";
import { getContract, onBoardOrGetProvider, onboardOrSwitchNetwork, requestAccounts, switchToDonauTestnet, TESTNETMINTERC20, USDTMCONTRACTADDRESS_DOTNAU, watchAsset } from "../web3/web3";
interface TestnetInfoProps extends Base {
}


export function TestnetInfo(props: TestnetInfoProps) {

    async function doMint(provider: any) {
        const contract = await getContract(provider, USDTMCONTRACTADDRESS_DOTNAU, "/MOCKERC20.json");
        const account = await requestAccounts(provider);
        const amount = ethers.utils.parseEther("1000");
        await TESTNETMINTERC20(contract, account, amount).then(async () => {
            await watchAsset(
                {
                    address: USDTMCONTRACTADDRESS_DOTNAU,
                    symbol: "USDTM",
                    decimals: 18
                },
                () => {
                    props.displayError("Unable to add token")
                })
        });
    }


    const onMint = async () => {
        if (props.provider === null) {
            const provider = await onBoardOrGetProvider(props.displayError)

            if (provider) {
                props.setProvider(provider);
                await doMint(provider);
            }
        } else {
            // I call the mint function here too
            await doMint(props.provider);
        }
    }

    const switchNetwork = async () => {
        await onboardOrSwitchNetwork(props.displayError)
        // I set the provider null so we need to reconnect to avoid error after changing network!
        props.setProvider(null);
    }


    return <Paper sx={{ maxWidth: 936, margin: '0 auto', padding: "5px" }}>
        <Typography variant="subtitle1" component="div"> <Button variant="contained" onClick={switchNetwork}>Switch</Button> to Donau Testnet!</Typography>
        <Spacer></Spacer>
        <Typography variant="subtitle1" component="div"><Button onClick={onMint} variant="contained">Mint</Button> some USDT Mock (USDTM)  to try out the app. </Typography>
    </Paper>
}

