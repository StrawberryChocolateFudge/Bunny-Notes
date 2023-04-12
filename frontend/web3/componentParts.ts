// These are the functions using TRON that are using Props from Components

import { ethers } from "ethers";
import { CardType } from "../components/CardGrid";
import { createNote } from "../zkp/generateProof";
import { getContract, getFee, onBoardOrGetProvider, requestAccounts } from "./web3";


export async function handleCardSelectWithProvider(props: any, denomination: string, currency: string, cardType: CardType, netId: string, noteAddress: string) {
    let provider = null;
    if (props.provider === null) {
        provider = await onBoardOrGetProvider(props.displayError);
    }
    if (provider) {
        props.setProvider(provider);
    } else {
        provider = props.provider;
    }
    await requestAccounts(provider);


    if (props.provider === null && provider === null) {
        props.displayError("Unable to connect to wallet!");
        return false;
    }

    const erc20Notes = await getContract(props.provider, noteAddress, "/ERC20Notes.json");
    const fee = await getFee(erc20Notes);
    const formattedFee = ethers.utils.formatEther(fee);

    const noteDetails = await createNote(currency, parseInt(denomination), netId);

    return { noteDetails, formattedFee };

}


