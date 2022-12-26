import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import { styled } from "@mui/system";
import { CardType } from './CardGrid';
import { Avatar, CardHeader } from '@mui/material';

export interface SelectableCardsParams {
  networkLogo: string;
  networkAlt: string;
  imageLink: string;
  imageAlt: string;
  denomination: string;
  currency: string;
  cardType: CardType,
  erc20Address: string,
  noteContractAddress: string
}

export interface SelectableCardsProps extends SelectableCardsParams {
  handleSelect: (denomination: string, currency: string, cardType: CardType,addresses: [string,string]) => void
}


const IMGWithMargin = styled("img")({
  marginTop: "20px"
})

const OverlayImgs = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center"

})

export function SelectableCards(props: SelectableCardsProps) {

  const purchaseSelected = () => {
    props.handleSelect(props.denomination, props.currency, props.cardType,[props.erc20Address,props.noteContractAddress])
  }

  const OverlayedImage = () => <OverlayImgs>
    <img width={"50"} style={{ margin: "0 auto", marginTop: "10px" }} src={props.imageLink} alt={props.imageAlt} />
    <img width="20" style={{ right: "80px", bottom: "85px", position: "absolute" }} src={props.networkLogo} />
  </OverlayImgs>

  const getContent = () => {
    if (props.cardType === "Payment Request") {
      return <Typography gutterBottom variant="subtitle1" component="div">
        {props.currency}
      </Typography>
    } else {
      return <Typography gutterBottom variant="subtitle1" component="div">
        {props.denomination} {props.currency} {props.cardType}
      </Typography>
    }
  }
  return (
    <Button sx={{ height: 150 }} onClick={purchaseSelected} >
      <Card sx={{ width: 200, height: 150 }}>
        <OverlayedImage></OverlayedImage>
        <CardContent>
          {getContent()}
        </CardContent>
      </Card>
    </Button>
  );
}