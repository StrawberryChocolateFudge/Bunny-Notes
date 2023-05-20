import { Link, Paper, Stack, styled, Typography } from "@mui/material";
import React from "react";

const networkLogoPaths = [
    "/imgs/arbitrum-arb-logo.svg",
    "/imgs/avalanche-avax-logo.svg",
    "/imgs/celo-celo-logo.svg",
    "/imgs/ethereum-eth-logo.svg",
    "/imgs/fantom-ftm-logo.svg",
    "/imgs/gnosis-gno-gno-logo.svg",
    "/imgs/klaytn-klay-logo.svg",
    "/imgs/optimism-ethereum-op-logo.svg",
    "/imgs/polygon-matic-logo.svg"
]

const networkTokenPaths = [
    "/imgs/multi-collateral-dai-dai-logo.svg",
    "/imgs/tether-usdt-logo.svg",
    "/imgs/usd-coin-usdc-logo.svg",
    "/imgs/wrapped-bitcoin-wbtc-logo.svg",
    "/imgs/aave-aave-logo.svg",
    "/imgs/apecoin-ape-ape-logo.svg",
    "/imgs/binance-usd-busd-logo.svg",
    "/imgs/chainlink-link-logo.svg",
    "/imgs/curve-dao-token-crv-logo.svg",
    "/imgs/lido-dao-ldo-logo.svg",
    "/imgs/uniswap-uni-logo.svg",
];

const LOGOS = styled("img")({
    maxWidth: "50px",
    minWidth: "20px"
})

export function Roadmap() {
    return <Paper sx={{ maxWidth: 936, margin: "auto" }}>
        <Stack direction="row" justifyContent="center">
            <Typography sx={{ fontFamily: `"Finger Paint", cursive`, margin: "0 auto", padding: "30px", fontWeight: 800 }} variant="h5" component="div">ROADMAP 🚀🚀🚀</Typography>
        </Stack>
        <ol style={{ fontFamily: `"Finger Paint", cursive` }}>
            <li>
                <Typography sx={{ fontFamily: `"Finger Paint", cursive`, margin: "0 auto", padding: "30px", fontWeight: 300 }} variant="h5" component="div">MOAR CHAINS!</Typography>
                <Stack direction="row" justifyContent={"space-around"}>{networkLogoPaths.map(n => <LOGOS src={n}></LOGOS>)}</Stack>
            </li>
            <li>
                <Typography sx={{ fontFamily: `"Finger Paint", cursive`, margin: "0 auto", padding: "30px", fontWeight: 300 }} variant="h5" component="div">MOAR Tokens!</Typography>
                <Stack direction="row" justifyContent={"space-around"}>{networkTokenPaths.map(n => <LOGOS src={n} />)}</Stack>
            </li>
            <li>
                <Typography sx={{ fontFamily: `"Finger Paint", cursive`, margin: "0 auto", padding: "30px", fontWeight: 300 }} variant="h5" component="div">SCALING!</Typography>
                <Typography sx={{ fontFamily: `Sans-Serif`, margin: "0 auto", padding: "30px", fontWeight: 100 }} variant="h6" component="div">That's right, folks! We are developing Bunny Bundles! ✅ Bundles will allow you to deposit once and create thousands of bunny notes that you can transfer off-chain! Instead of deploying the notes one by one, you will have the potential to create 2^20 bunny notes with a single deposit! Isn't that mind-boggling? <strong>How? Merkle trees 🤝 Decentralized Storage!</strong> Our ZKP circuit ceremony is currently hosted at <Link href="https://snarkyceremonies.com" target="_blank">Snarky Ceremonies</Link> where you can contribute to cryptographic decentralization before we launch this feature!</Typography>
            </li>
        </ol>
    </Paper >
}