// These are the functions using TRON that are using Props from Components

import { ethers } from "ethers";
import { CardType } from "../components/CardGrid";
import { createNote } from "../zkp/generateProof";
import { onBoardOrGetProvider } from "./web3";


export async function handleCardSelectWithProvider(props: any, denomination: string, currency: string, cardType: CardType, netId: string) {
    let provider = null;
    if (props.provider === null) {
        provider = await onBoardOrGetProvider(props.displayError);
    }
    if (provider) {
        props.setProvider(provider);
    } else {
        provider = props.provider;
    }

    const addressValid = ethers.utils.isAddress(props.myAddress);

    if (!addressValid) {
        props.displayError("Invalid Address!");
        return false;
    }

    if (props.provider === null && provider === null) {
        props.displayError("Unable to connect to wallet!");
        return false;
    }
    const noteDetails = await createNote(currency, parseInt(denomination), netId);

    return noteDetails;

}


