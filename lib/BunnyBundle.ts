import { formatEther, parseEther } from "ethers/lib/utils";
import { createDeposit, toNoteHex } from "../lib/BunnyNote";

import { rbigint } from "./random";
//@ts-ignore
import { utils } from "ffjavascript";
import { generateMerkleTree } from "./merkleTree";

// Bunny Bundles are bulk Bunny Notes
// Instead of storing the Bunny Note commitment on chain we store a merkle tree
// The merkle tree is computed off chain with Poseidon hash
// Then we submit the root to the blockchain and save the tree leaves on public storage
// We should only allow an even sized bundle, there should be checks in the blockchain, circuit and client side to allow only an even sized tree

function isEven(size: number) {
  return size % 2 === 0;
}

export async function createBundle(
  {
    currency,
    totalValue, // Amount is the overall bundle price
    netId,
    size,
  }: {
    currency: string;
    totalValue: string;
    netId: number;
    size: number;
  },
) {
  const notes: Array<string> = [];
  const leaves: Array<bigint> = [];

  const parsedAmount = parseEther(totalValue);
  const amountPerNote = parsedAmount.div(size);
  const perNote = formatEther(amountPerNote);

  for (let i = 0; i < size; i++) {
    const deposit = await createDeposit({
      nullifier: rbigint(),
      secret: rbigint(),
    });
    const note = toNoteHex(deposit.preimage, 62);
    notes.push(note);
    const commitment = deposit.commitment;
    // The commitments are the merkle tree leaves!
    leaves.push(commitment);
  }

  const { root, tree } = generateMerkleTree(leaves);

  const bunnyBundle: Array<string> = notes.map((n) =>
    `bunnybundle-${currency}-${perNote}-${netId}-${size}-${n}-${root.toString()}`
  );

  // return the notes, the leaves and the root and convert both the root and the leaves to hex string
  return {
    bunnyBundle,
    leaves,
    root,
    tree,
  };
}

//A helper function to serialize the merkle tree
export function serializeTree(root: string, leaves: bigint[]) {
  const stringroot = toNoteHex(root);
  let stringleaves = [];
  for (let i = 0; i < leaves.length; i++) {
    stringleaves.push(leaves[i].toString());
  }
  return JSON.stringify({ root: stringroot, leaves: stringleaves });
}

// A helper function to deserialize the tree
export function deserializeTree(
  merkleTreeString: string,
): { root: string; leaves: bigint[] } {
  const parsedString = JSON.parse(merkleTreeString);
  const root = parsedString.root;
  const leaves = [];
  for (let i = 0; i < parsedString.leaves.length; i++) {
    leaves.push(BigInt(parsedString.leaves[i]));
  }
  return { root, leaves };
}

export function fromNoteHex(hex: string) {
  return BigInt(hex);
}

export async function parseBundleNote(noteString: string) {
  const noteRegex =
    /bunnybundle-(?<currency>\w+)-(?<amount>[\d.]+)-(?<netId>\d+)-(?<bundleSize>\d+)-0x(?<note>[0-9a-fA-F]{124})-(?<root>\d+)/g;
  const match = noteRegex.exec(noteString);
  if (!match) {
    throw new Error("Invalid Note!");
  }
  //@ts-ignore
  const buf = Buffer.from(match.groups.note, "hex");
  const nullifier = utils.leBuff2int(buf.slice(0, 31));
  const secret = utils.leBuff2int(buf.slice(31, 62));
  const deposit = await createDeposit({ nullifier, secret });
  //@ts-ignore
  const netId = Number(match.groups.netId);
  return {
    //@ts-ignore
    currency: match.groups.currency,
    //@ts-ignore
    amount: match.groups.amount,
    netId,
    deposit,
    //@ts-ignore
    size: match.groups.bundleSize,
    //@ts-ignore
    root: match.groups.root,
  };
}

export async function rootEncodingForVerification(
  root: string,
  network: string,
) {
  return `bundleroot-${root}-${Number(network)}`;
}

export async function verifyEncodedRoot(encodedRoot: string) {
  const rootRegex = /bundleroot-(?<root>\d+)-(?<netId>\d+)/g;
  const match = rootRegex.exec(encodedRoot);
  if (!match) {
    throw new Error("Invalid Root format");
  }
  //@ts-ignore
  const root = match?.groups.root;
  //@ts-ignore
  const netId = Number(match?.groups.netId);

  return { root, netId };
}
