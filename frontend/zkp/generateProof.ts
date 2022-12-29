import { Deposit, FullProof } from "../../lib/types";
import { generateNoteWithdrawProof } from "../../lib/generateProof";
import { deposit, parseNote } from "../../lib/BunnyNote";
import packToSolidityProof from "../../lib/packToSolidityProof";
const urlBASE = "https://bunnynotes.finance"



export const snarkArtifacts = { wasmFilePath: urlBASE + "/withdraw.wasm", zkeyFilePath: urlBASE + "/withdraw_0001.zkey" };

export type NoteDetails = [
    string, ParsedNote
]

export type ParsedNote = { currency: string, amount: string, netId: number, deposit: Deposit }

export async function createNote(currency, amount, netId: string): Promise<NoteDetails> {
    console.log(netId);
    console.log(currency);
    console.log(amount);
    const noteString = await deposit({ currency, amount, netId:parseInt(netId) })
    const parsedNote = await parseNote(noteString) as ParsedNote;

    return [noteString, parsedNote];
}

export async function generateZKProof(deposit: Deposit, recipient: string, change: string): Promise<FullProof> {
    return await generateNoteWithdrawProof({ deposit, recipient, change, snarkArtifacts })
}

export function packSolidityProof(proof: any) {
    return packToSolidityProof(proof);
}