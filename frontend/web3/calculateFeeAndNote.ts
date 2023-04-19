import { createNote } from "../zkp/generateProof";
import { calculateFeeLocally } from "./web3";

export async function calculateFeeAndNote(denomination: string, currency: string, netId: string) {
    const fee = calculateFeeLocally(denomination);
    const noteDetails = await createNote(currency, denomination, netId);

    return { noteDetails, fee }
}