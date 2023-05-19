import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import { styled } from "@mui/system";
import { CardType } from './CardGrid';
import { Stack, Tooltip } from '@mui/material';

export interface SelectableCardsParams {
  networkLogo: string;
  networkAlt: string;
  imageLink: string;
  imageAlt: string;
  currency: string;
  cardType: CardType,
  erc20Address: string,
  isCustom: boolean,
  isFeeless: boolean
}

export interface SelectableCardsProps extends SelectableCardsParams {
  handleSelect: (currency: string, cardType: CardType, tokenAddress: string, isCustom: boolean, isFeeless: boolean) => void
}



const OverlayImgs = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center"

})

export function SelectableCards(props: SelectableCardsProps) {

  const purchaseSelected = () => {
    props.handleSelect(props.currency, props.cardType, props.erc20Address, props.isCustom, props.isFeeless)
  }

  const OverlayedImage = () => <OverlayImgs>
    <img width={"50"} height={"50"} style={{ margin: "0 auto", marginTop: "10px" }} src={props.imageLink} alt={props.imageAlt} />
    <img width="20" style={{ right: "80px", bottom: "85px", position: "absolute" }} src={props.networkLogo} />
  </OverlayImgs>
  const getContent = () => {
    return <Stack direction="column" alignItems="center">

      <React.Fragment><Typography gutterBottom variant="subtitle1" component="div">
        {props.currency}
      </Typography> {props.isFeeless ? <Typography sx={{ color: "grey" }} variant="subtitle1">
        (Feeless)
      </Typography> : null}</React.Fragment>
    </Stack>
  }
  return (
    <Tooltip arrow title={props.erc20Address === "0x0000000000000000000000000000000000000000" ? "Native Token" : props.erc20Address}>
      <Button sx={{ height: 150 }} onClick={purchaseSelected} >
        <Card sx={{ width: 180, height: 150 }}>
          <OverlayedImage></OverlayedImage>
          <CardContent>
            {getContent()}
          </CardContent>
        </Card>
      </Button>
    </Tooltip>
  );
}