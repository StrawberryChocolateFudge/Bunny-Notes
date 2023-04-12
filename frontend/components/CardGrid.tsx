import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { SelectableCards, SelectableCardsParams } from './SelectableCards';

export type CardType = "Bunny Note" | "Spending Note" | "Payment Request";

interface CardGridProps {
    cardProps: Array<SelectableCardsParams>
    handleSelect: (denomination: string, currency: string, cardType: CardType, addresses: [string, string]) => void

}


export default function CardGrid(props: CardGridProps) {

    const renderGrid = () => {
        return props.cardProps.map(data => {
            return <Grid item xs={6} key={`${data.denomination}${data.currency}${data.cardType}`} justifyContent="center" alignItems="stretch" sx={{ textAlign: "center",maxWidth: "100%" }}>
                <SelectableCards erc20Address={data.erc20Address} noteContractAddress={data.noteContractAddress} networkAlt={data.networkAlt} networkLogo={data.networkLogo} handleSelect={props.handleSelect} cardType={data.cardType} currency={data.currency} denomination={data.denomination} imageAlt={data.imageAlt} imageLink={data.imageLink}></SelectableCards>
            </Grid>
        })
    }

    return (
        <Box sx={{ marginTop: "20px", marginLeft: "20px", marginRight: "20px", marginBottom: "40px" }}>
            <Grid justifyContent={"center"} container rowSpacing={5} sx={{ margin: "0 auto" }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                {renderGrid()}
            </Grid>
        </Box>
    );
}