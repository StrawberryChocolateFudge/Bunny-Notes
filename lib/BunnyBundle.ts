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
  //@ts-ignore
  return {
    currency: match.groups.currency,
    amount: match.groups.amount,
    netId,
    deposit,
    size: match.groups.bundleSize,
    root: match.groups.root,
  };
}
