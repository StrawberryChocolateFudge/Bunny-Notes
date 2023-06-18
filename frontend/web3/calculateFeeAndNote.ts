import { createNote } from "../zkp/generateProof";
import { calculateFeeLocally } from "./web3";
import { createBundle } from "../../lib/BunnyBundle";
export async function calculateFeeAndNote(
  denomination: string,
  currency: string,
  netId: string,
) {
  const fee = calculateFeeLocally(denomination);
  const noteDetails = await createNote(currency, denomination, netId);

  return { noteDetails, fee };
}

export async function calculateFeeAndBundle(
  totalValue: string,
  size: number,
  currency: string,
  netId: number,
) {
  const fee = calculateFeeLocally(totalValue);
  const bundle = await createBundle({ currency, totalValue, size, netId });
  return { bundle, fee };
}
