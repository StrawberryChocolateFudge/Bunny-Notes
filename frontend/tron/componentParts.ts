// These are the functions using TRON that are using Props from Components

import { onBoardOrGetTronWeb, verifyAddress } from ".";
import { CardType } from "../components/CardGrid";
import { createNote } from "../zkp/generateProof";


export async function handleCardSelectWithTron(props: any, denomination: string, currency: string, cardType: CardType) {
    let tronWeb = null;
    if (props.tronWeb === null) {
        tronWeb = await onBoardOrGetTronWeb(props.displayError);
        if (tronWeb) {
            props.setTronWeb(tronWeb);
        }
    } else {
        tronWeb = props.tronWeb;
    }
    const addressValid = verifyAddress(props.myAddress);

    if (!addressValid) {
        props.displayError("Invalid Address!");
        return false;
    }
    if (props.tronWeb === null && tronWeb === null) {
        // if the address is valid but We can't get the tronWeb I also return
        props.displayError("Unable to connect to wallet!")
        return false;
    }

    const noteDetails = await createNote(currency, parseInt(denomination));

    return noteDetails;
}
