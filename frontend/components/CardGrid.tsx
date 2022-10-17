import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { SelectableCards, SelectableCardsProps } from './SelectableCards';

interface CardGridProps {
    cardProps: Array<SelectableCardsProps>
}


export default function CardGrid(props: CardGridProps) {

    const renderGrid = () => {
        return props.cardProps.map(data => {
            return <Grid item xs={6} key={`${data.denomination}${data.currency}${data.cardType}`} justifyContent="center" alignItems="stretch" sx={{ textAlign: "center" }}>

                <SelectableCards cardType={data.cardType} currency={data.currency} denomination={data.denomination} imageAlt={data.imageAlt} imageLink={data.imageLink}></SelectableCards>
            </Grid>
        })
    }

    return (
        <Box sx={{ marginTop: "20px", marginLeft: "20px", marginRight: "20px", marginBottom: "40px" }}>
            <Grid container rowSpacing={5} sx={{ margin: "0 auto" }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                {renderGrid()}
            </Grid>
        </Box>
    );
}