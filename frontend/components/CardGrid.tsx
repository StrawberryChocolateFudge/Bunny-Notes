import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { SelectableCards, SelectableCardsParams } from './SelectableCards';

export type CardType = "Bunny Note" | "Spending Note" | "Payment Request";

interface CardGridProps {
    cardProps: Array<SelectableCardsParams>
    handleSelect: (currency: string, cardType: CardType, tokenAddress: string, isCustom: boolean) => void

}


export default function CardGrid(props: CardGridProps) {

    const renderGrid = () => {
        return props.cardProps.map(data => {
            return <Grid item xs={6} key={`${data.currency}${data.cardType}`} justifyContent="center" alignItems="stretch" sx={{ textAlign: "center", maxWidth: "100%" }}>
                <SelectableCards isCustom={data.isCustom} erc20Address={data.erc20Address} networkAlt={data.networkAlt} networkLogo={data.networkLogo} handleSelect={props.handleSelect} cardType={data.cardType} currency={data.currency} imageAlt={data.imageAlt} imageLink={data.imageLink}></SelectableCards>
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