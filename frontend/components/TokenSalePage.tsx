import { Paper, Stack, TextField, Typography, CircularProgress, Button, Divider } from "@mui/material";
import { formatEther } from "ethers/lib/utils";
import React from "react";
import { BSCTESTNETID, BUNNYNOTES_TOKENSALE_TESTNET, buyTokens, getContract, handleNetworkSelect, tokensalePriceCalculator, watchAsset, ZKBTokenAddress_BSC } from "../web3/web3";

function Body1(txt) {
    return <Typography component="div" variant="body1">{txt}</Typography>
}
function Body2(txt) {
    return <Typography component="div" variant="body2">{txt}</Typography>
}

export function TokenSalePage(props: any) {
    const [bnbToSpend, setBnbToSpend] = React.useState("");

    function setBnBToSpendChange(event: React.ChangeEvent<HTMLInputElement>) {
        setBnbToSpend(event.target.value);
    }

    function getTokensToRecieve() {
        if (bnbToSpend === "") {
            return Body1("Buy 15000 ZKB for 1 BNB")
        }

        if (isNaN(parseFloat(bnbToSpend))) {
            return Body1("Buy 15000 ZKB for 1 BNB");
        }

        if (parseFloat(bnbToSpend) < 0) {
            return Body1("Buy 15000 ZKB for 1 BNB");
        }

        const salePrice = tokensalePriceCalculator(bnbToSpend);
        return Body1(`Buy ${formatEther(salePrice)} ZKB for ${bnbToSpend} BNB`);
    }

    async function buyTokens_action() {
        if (isNaN(parseFloat(bnbToSpend))) {
            props.displayError("Invalid amount");
            return;
        }
        const provider = await handleNetworkSelect(BSCTESTNETID, props.displayError);
        const tokenSaleContract = await getContract(provider, BUNNYNOTES_TOKENSALE_TESTNET, "/TokenSale.json");
        const buyTx = await buyTokens(tokenSaleContract, bnbToSpend).catch(err => {
            if (err.message.includes("insufficient funds")) {
                props.displayError("Insufficient Funds.")
            } else {
                props.displayError("An error occured. Check your wallet");
            }
            return false;
        });
        if (buyTx) {
            await buyTx.wait(async (receipt) => {
                if (receipt.status === 1) {
                    await watchAsset({
                        address: ZKBTokenAddress_BSC,
                        symbol: "ZKB",
                        decimals: 18
                    }, () => props.handleError("Unable to add token to wallet"));
                }
            })
        }
    }

    return <Paper sx={{ maxWidth: 936, margin: "auto", padding: "20px" }}>
        <Stack direction="row" justifyContent="flex-start">
            <Button href="/">Go Back</Button>
        </Stack>
        <Stack direction="row" justifyContent="center">
            <img src="/imgs/BunnyLogo.jpg" width="100px" />
        </Stack>
        <Typography component="div" variant="h4" sx={{ textAlign: "center" }}>
            Token Sale
        </Typography>
        <Typography component="div" variant="h5" sx={{ textAlign: "center" }}>
            Terms and conditions
        </Typography>
        <ol>
            <li>
                {Body1("Introduction")}
                {Body2("These Terms and Conditions(“Agreement”) govern the sale and purchase of the ZKB token (“Token”) by you (“Purchaser”) from BunnyNotes.Finance (“Issuer”) via a smart contract. By purchasing ZKB, you agree to be bound by this Agreement, as well as any additional terms and conditions set forth by the Issuer.")}
            </li>
            <li>
                {Body1("Token Description")}
                {Body2("The ZKB Token is a digital asset that is used for feeless transactions on bunnynotes.finance platform. The Token is not a registered security in the United States, nor is it intended to be treated as such. The tokens may not be bought or sold in the United States and are not an investment of any kind.")}
            </li>
            <li>
                {Body1("Token Sale")}
                {Body2("The Token sale will be conducted via a smart contract, which will automatically execute the purchase and transfer of Tokens to the Purchaser’s wallet address upon receipt of payment in the form of cryptocurrency. The price of each Token will be determined at the time of purchase, and will be denominated in the cryptocurrency used for payment.")}
            </li>
            <li>
                {Body1("OFAC Sanctioned Countries")}
                {Body2("By purchasing ZKB Tokens, the Purchaser certifies that they are not a resident or national of a country on the OFAC sanctioned countries list, which currently includes Cuba, Iran, North Korea, Syria, and the Crimea region of Ukraine,Russia and other countries. The Issuer reserves the right to refuse sale of Tokens to any individual or entity located in a sanctioned country and will refuse to communicate or work with a resident of a sanctioned country or a sanctioned entity.")}
            </li>
            <li>
                {Body1("Disclaimer of Warranties")}
                {Body2("THE TOKENS ARE SOLD “AS IS” AND WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY OR OTHERWISE, INCLUDING WITHOUT LIMITATION ANY WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE OR NON-INFRINGEMENT.")}
            </li>
            <li>
                {Body1("Limitation of Liability")}
                {Body2("IN NO EVENT SHALL THE ISSUER BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES ARISING OUT OF OR IN CONNECTION WITH THE TOKEN SALE OR THE USE OF ZKB TOKENS.")}
            </li>
            <li>
                {Body1("Tokenomics")}
                {Body2("The total supply of the tokens is 100 million ZKB and all have been minted. This tokensale sells 50% of the tokens while the remaining will be allocated for Dex Liquidity, Bridges and stored in a Treasury. The tokens are minted on the Binance Smart Chain and will be avaiable on the BitTorrent chain via Token Mapping.")}
            </li>
        </ol>
        <Stack direction="row" justifyContent="center">
            <Stack direction="column" justifyContent="center">
                {getTokensToRecieve()}
                <div style={{ marginBottom: "20px", paddingLeft: "5px" }} />
                <TextField value={bnbToSpend} onChange={setBnBToSpendChange} autoComplete="off" type="number" label="Amount (BNB)"></TextField>
            </Stack>
            <Button variant="contained" sx={{ marginLeft: "10px" }} onClick={buyTokens_action}>Buy</Button>

        </Stack>
        <Stack direction="row" justifyContent="center">
            {Body1("Enter the amount of BNB you wish to spend and the price indicator above will update.")}
        </Stack>
    </Paper>
}