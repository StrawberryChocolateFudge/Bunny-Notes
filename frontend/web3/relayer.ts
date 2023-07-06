import { SolidityProof } from "../../lib/types";
import { BigNumber, ethers } from "ethers";
import { BunnyNotes } from "../../typechain";
import { bunnyNotesCommitments, estimateWithdraw, FEEDIVIDER } from "./web3";

export let RELAYERURL = "https://relayer.bunnynotes.finance";

if (process.env.NODE_ENV === "development") {
  RELAYERURL = "http://localhost:3000";
}

export type RelayerMessage = {
  status: number;
  message: string;
};

export type RelayWithdrawParams = {
  proof: SolidityProof;
  nullifierHash: string;
  commitment: string;
  recipient: string;
  network: string;
};

// check if relayer is online
export async function isRelayerOnline(): Promise<boolean> {
  try {
    const res = await fetch(RELAYERURL + "/", { method: "GET" });
    const json: RelayerMessage = await res.json();
    if (res.status === 200 && json.message === "online") {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

// this function should check if the transaciton can be relayed.
// It handles all network interaction and returns a boolean
export type CanRelayArgs = {
  provider: ethers.providers.Web3Provider;
  contract: BunnyNotes;
  myAddress: any;
  solidityProof: any;
  nullifierHash: string;
  commitment: string;
};
export async function canRelayCheck(
  args: CanRelayArgs,
): Promise<[boolean, string]> {
  const isOnline = await isRelayerOnline();

  if (!isOnline) {
    return [false, "Relayer is unavailable. Service offline."];
  }

  // I need to fetch the commitment to check the denomination and if it's a token
  const commitmentData = await bunnyNotesCommitments(
    args.contract,
    args.commitment,
  );

  if (commitmentData.usesToken) {
    // Can't relay tokens for now
    return [false, "Unable to Relay ERC20 tokens."];
  }

  const denomination = commitmentData.denomination;
  const feePaid = denomination.div(FEEDIVIDER);

  const [gotGasPrice, gasPrice] = await getGasPrice(args.provider);
  if (gotGasPrice === false) {
    return [false, gasPrice as string];
  }
  const estimatedGasUsed = await estimateWithdraw(
    args.contract,
    args.solidityProof,
    args.nullifierHash,
    args.commitment,
    args.myAddress,
  );

  if (!estimatedGasUsed) {
    return [false, "Unable to relay transaction. Estimate gas failed."];
  }
  const isSustainable = isSustainableToRelay(
    gasPrice as BigNumber,
    estimatedGasUsed,
    feePaid,
  );

  if (!isSustainable) {
    return [
      false,
      "Tx fee too low to cover relayer fees. Manual withdraw only!",
    ];
  }
  return [true, ""];
}

// Calculate if the relayer can relay this transaction for the fee
// Should do an estimateGas and do the same calculation like the relayer to see if the tx is sustainable

export function isSustainableToRelay(
  gasPrice: BigNumber,
  estimatedLimit: BigNumber,
  collectedFee: BigNumber,
): boolean {
  const totalEstimatedPrice = gasPrice.mul(estimatedLimit);
  return collectedFee.gt(totalEstimatedPrice);
}

async function getGasPrice(
  provider: any,
): Promise<[boolean, string | BigNumber]> {
  const feeData = await provider.getFeeData();
  if (!feeData.gasPrice) {
    return [false, "Unable to get gas price"];
  }
  let gasPrice: BigNumber = feeData.gasPrice;
  if (feeData.maxPriorityFeePerGas) {
    gasPrice = gasPrice.add(feeData.maxPriorityFeePerGas);
  }
  return [true, gasPrice];
}

export type PostWithdrawBody = {
  proof: string[];
  nullifierHash: string;
  commitment: string;
  recipient: string;
  network: string;
};

export async function postWithdraw(
  body: PostWithdrawBody,
): Promise<[boolean, string]> {
  try {
    const res = await fetch(RELAYERURL + "/withdraw", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    // The message should contain the transaciton Id

    if (res.status !== 200) {
      return [false, json.message];
    }

    return [true, json.message];
  } catch (err) {
    return [false, "Relaying failed"];
  }
}

export type MerkleTreeUpload = {
  root: string;
  leaves: string;
  network: string;
};

export async function uploadMerkleTree(body: MerkleTreeUpload) {
  try {
    const res = await fetch(RELAYERURL + "/bundle", {
      method: "POST",
      cache: "no-cache",

      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (res.status === 200 && json.message === "ok") {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

export type MerkleTreeDownload = {
  root: string;
};

export async function downloadMerkleTree(body: MerkleTreeDownload) {
  try {
    const res = await fetch(RELAYERURL + "/bundle", {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const json = await res.json();

    if (res.status === 200) {
      return { root: json.root, leaves: json.leaves, network: json.network };
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

export async function saveMerkleTreeString(merkleTree: string) {
  // const helia = await createNode();
  // const str = strings(helia);

  // const cid = await str.add(merkleTree);
  // return cid.toString();
  return "";
}

export async function fetchMerkleTreeString(root: string) {
  // const helia = await createNode();
  // const str = strings(helia);
  // const merkleTree = await str.get(CID.parse(cid));
  // return merkleTree;
  return "";
}
