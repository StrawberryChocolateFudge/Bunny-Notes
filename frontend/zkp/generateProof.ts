import { Deposit, FullProof } from "../../lib/types";
import { generateProof } from "../../lib/generateProof";
import { deposit, parseNote } from "../../lib/note";
import packToSolidityProof from "../../lib/packToSolidityProof";
const urlBASE = "http://localhost:1234"

const netId = 0x2b6653dc;


export const snarkArtifacts = { wasmFilePath: urlBASE + "/withdraw.wasm", zkeyFilePath: urlBASE + "/withdraw_0001.zkey" };

export type NoteDetails = [
    string, ParsedNote
]

export type ParsedNote = { currency: string, amount: string, netId: number, deposit: Deposit }

export async function createNote(currency, amount): Promise<NoteDetails> {
    const noteString = await deposit({ currency, amount, netId })
    const parsedNote = await parseNote(noteString) as ParsedNote;

    return [noteString, parsedNote];
}

export async function generateZKProof(deposit: Deposit, recepient: string, change: string): Promise<FullProof> {
    return await generateProof({ deposit, recepient, change, snarkArtifacts })
}

export function packSolidityProof(proof: any) {
    return packToSolidityProof(proof);
}