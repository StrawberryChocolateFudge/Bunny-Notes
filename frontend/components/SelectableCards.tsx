import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import { styled } from "@mui/system";
import { CardType } from './CardGrid';


export interface SelectableCardsProps {
  imageLink: string;
  imageAlt: string;
  denomination: string;
  currency: string;
  cardType: CardType,
  handleSelect: (denomination: string, currency: string, cardType: CardType) => void
}


const IMG = styled("img")({
  marginTop: "20px"
})

export function SelectableCards(props: SelectableCardsProps) {


  const purchaseSelected = () => {
    props.handleSelect(props.denomination, props.currency, props.cardType)
  }


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
    <Button onClick={purchaseSelected} >
      <Card sx={{ minWidth: 200 }}>
        <IMG
          width="50"
          src={props.imageLink}
          alt={props.imageAlt}
        />
        <CardContent>
          {getContent()}
        </CardContent>
      </Card>
    </Button>
  );
}