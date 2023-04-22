import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { SelectableCards, SelectableCardsParams } from './SelectableCards';

export type CardType = "Bunny Note" | "Spending Note" | "Payment Request";

interface CardGridProps {
    cardProps: Array<SelectableCardsParams>
    handleSelect: (currency: string, cardType: CardType, tokenAddress: string, isCustom: boolean, isFeeless: boolean) => void

}


export default function CardGrid(props: CardGridProps) {
    const [windowSize, setWindowSize] = React.useState(window.innerWidth);
    const handleWindowResize = React.useCallback(event => {
        setWindowSize(window.innerWidth);
    }, []);

    React.useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [handleWindowResize]);

    const useMarginAuto = windowSize < 457 ? "0 auto" : "";


    const renderGrid = () => {
        return props.cardProps.map(data => {
            return <Grid item xs={4} key={`${data.currency}${data.cardType}`} justifyContent="center" alignItems="stretch" sx={{ textAlign: "center", maxWidth: "100%", margin: useMarginAuto }}>
                <SelectableCards handleSelect={props.handleSelect} {...data}></SelectableCards>
            </Grid>
        })
    }

    return (
        <Box sx={{ marginTop: "20px", marginLeft: "20px", marginRight: "20px", marginBottom: "40px" }}>
            <Grid justifyContent={"flex-start"} flexWrap="wrap" container spacing={3} >
                {renderGrid()}
            </Grid>
        </Box>
    );
}