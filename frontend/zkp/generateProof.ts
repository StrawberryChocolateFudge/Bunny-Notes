import { Deposit, FullProof } from "../../lib/types";
import { generateProof } from "../../lib/generateProof";
import { deposit, parseNote } from "../../lib/note";

const urlBASE = "http://localhost:1234"

export const snarkArtifacts = { wasmFilePath: urlBASE + "/withdraw.wasm", zkeyFilePath: urlBASE + "/withdraw_0001.zkey" };

export async function createNote() {
    const noteString = await deposit({ currency: "UDST", amount: 10, netId: 0x2b6653dc })
    return await parseNote(noteString);
}

export async function generateZKProof(deposit: Deposit, recepient: string, change: "0"): Promise<FullProof> {
    return await generateProof({ deposit, recepient, change, snarkArtifacts })
}