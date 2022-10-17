import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import { styled } from "@mui/system";


export interface SelectableCardsProps {
  imageLink: string;
  imageAlt: string;
  denomination: string;
  currency: string;
  cardType: "Gift Card" | "Cash Note" | "Payment Request",


}


const IMG = styled("img")({
  marginTop: "20px"
})

export function SelectableCards(props: SelectableCardsProps) {


  const purchaseSelected = () => {
    console.log(props.denomination);
    console.log(props.currency);
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