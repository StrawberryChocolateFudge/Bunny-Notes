import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import React from "react";

interface DisplayAddressesProps {
    erc20Address: string,
    noteAddress: string
}

export function DisplayAddresses(props: DisplayAddressesProps) {
    return <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
            <TableBody>
                {props.erc20Address === "0x0000000000000000000000000000000000000000" ? null : <TableRow>
                    <TableCell align="left">ERC20 Address:</TableCell>
                    <TableCell align="right">{props.erc20Address}</TableCell>
                </TableRow>}
                <TableRow>
                    <TableCell align="left">Note Contract:</TableCell>
                    <TableCell align="right">{props.noteAddress}</TableCell>
                </TableRow>

            </TableBody>
        </Table>
    </TableContainer>
}