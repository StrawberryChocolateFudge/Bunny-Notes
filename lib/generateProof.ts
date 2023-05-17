import { Deposit, SnarkArtifacts } from "./types";
//@ts-ignore
import { groth16 } from "snarkjs"
import { FullProof } from "./types"
import { EncodedForCircuit } from "./merkleTree";


// Generates the proofs for verification! 
export async function generateNoteWithdrawProof({ deposit, recipient, snarkArtifacts }: { deposit: Deposit, recipient: string, snarkArtifacts?: SnarkArtifacts }): Promise<FullProof> {
    console.log("Generate proof start");
    const input = {
        nullifierHash: deposit.nullifierHash,
        commitmentHash: deposit.commitment,
        recipient,
        // private snark inputs
        nullifier: deposit.nullifier,
        secret: deposit.secret
    }


    if (!snarkArtifacts) {
        snarkArtifacts = {
            wasmFilePath: `circuits/withdraw_bunnyNote/withdraw_js/withdraw.wasm`,
            zkeyFilePath: `circuits/withdraw_bunnyNote/withdraw_0001.zkey`
        }
    }

    console.time("Proof Time");

    const { proof, publicSignals } = await groth16.fullProve(input, snarkArtifacts.wasmFilePath, snarkArtifacts.zkeyFilePath)
    console.timeEnd("Proof Time");

    return { proof, publicSignals }
}



/**
 * Verifies a SnarkJS proof.
 * @param verificationKey The zero-knowledge verification key.
 * @param fullProof The SnarkJS full proof.
 * @returns True if the proof is valid, false otherwise.
 */

export function verifyThreePublicSignals(verificationKey: any, { proof, publicSignals }: FullProof): Promise<boolean> {
    return groth16.verify(
        verificationKey,
        [
            publicSignals[0],
            publicSignals[1],
            publicSignals[2]
        ],
        proof
    )
}

export function verifyFourPublicSignals(verificationKey: any, { proof, publicSignals }: FullProof): Promise<boolean> {
    return groth16.verify(
        verificationKey,
        [
            publicSignals[0],
            publicSignals[1],
            publicSignals[2],
            publicSignals[3],
        ],
        proof
    )
}

export async function generateBundleWithdrawProof(
    {
        deposit,
        root,
        merkleProof,
        recipient,
        snarkArtifacts
    }: {
        deposit: Deposit,
        root: BigInt,
        merkleProof: EncodedForCircuit,
        recipient: string,
        snarkArtifacts?: SnarkArtifacts
    }): Promise<FullProof> {
    console.log("Generate proof start");
    const input = {
        nullifierHash: deposit.nullifierHash,
        commitmentHash: deposit.commitment,
        recipient,
        root,

        // Private snark inputs
        nullifier: deposit.nullifier,
        secret: deposit.secret,
        pathElements: merkleProof.pathElements,
        pathIndices: merkleProof.pathIndices
    }

    if (!snarkArtifacts) {
        snarkArtifacts = {
            wasmFilePath: "circuits/withdraw_bunnyBundle/withdrawBundledNote_js/withdrawBundledNote.wasm",
            zkeyFilePath: "circuits/withdraw_bunnyBundle/withdrawBundledNote_0001.zkey"
        }
    }

    console.time("Proof time");
    const { proof, publicSignals } = await groth16.fullProve(input, snarkArtifacts.wasmFilePath, snarkArtifacts.zkeyFilePath)
    console.timeEnd("Proof time");
    return { proof, publicSignals }
}