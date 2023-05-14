import { formatEther, parseEther } from "ethers/lib/utils";
import { createDeposit, toNoteHex } from "../lib/BunnyNote";
import { generateMerkleRoot, generateMerkleTree } from "./generateCommitmentHash";
import { rbigint } from "./random";
//@ts-ignore
import { utils } from "ffjavascript";

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
        amount, // Amount is the overall bundle price
        netId,
        size }: {
            currency: string,
            amount: string,
            netId: number,
            size: number
        }) {
    if (!isEven(size)) {
        throw new Error("Invalid Tree Size!")
    }

    const notes: Array<string> = [];
    const leaves: Array<bigint> = []

    const parsedAmount = parseEther(amount);
    const amountPerNote = parsedAmount.div(size);
    const perNote = formatEther(amountPerNote);


    for (let i = 0; i < size; i++) {
        const deposit = await createDeposit({ nullifier: rbigint(), secret: rbigint() });
        const note = toNoteHex(deposit.preimage, 62);
        //TODO: notestrings need to contain the root hash also!! maybe instead of size!
        const noteString = `bunnybundle-${currency}-${perNote}-${netId}-${size}-${note}`
        notes.push(noteString);
        const commitment = deposit.commitment;
        // The commitments are the merkle tree leaves!
        leaves.push(commitment);
    }

    const { root, tree } = generateMerkleTree(leaves);

    // return the notes, the leaves and the root and convert both the root and the leaves to hex string
    return {
        notes,
        leaves,
        root,
        tree
    }
}


export function fromNoteHex(hex: string) {
    return BigInt(hex);
}


export async function parseBundleNote(noteString: string) {
    const noteRegex = /bunnybundle-(?<currency>\w+)-(?<amount>[\d.]+)-(?<netId>\d+)-(?<bundleSize>\d+)-0x(?<note>[0-9a-fA-F]{124})/g
    const match = noteRegex.exec(noteString);
    if (!match) {
        throw new Error("Invalid Note!")
    }
    //@ts-ignore
    const buf = Buffer.from(match.groups.note, 'hex');
    const nullifier = utils.leBuff2int(buf.slice(0, 31));
    const secret = utils.leBuff2int(buf.slice(31, 62));
    const deposit = await createDeposit({ nullifier, secret });
    //@ts-ignore
    const netId = Number(match.groups.netId);
    //@ts-ignore
    return { currency: match.groups.currency, amount: match.groups.amount, netId, deposit, size: match.groups.bundleSize }
}

