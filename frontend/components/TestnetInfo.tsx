import { Button, Paper, Typography } from "@mui/material";
import React from "react";

export function TestnetInfo() {
    return <Paper sx={{ maxWidth: 936, margin: '0 auto', padding: "5px" }}>
        <Typography variant="subtitle1" component="div">We are on testnet! Mint some USDT Mock (USDTM) <Button variant="contained">Here</Button> to try out the app.</Typography>
    </Paper>
}