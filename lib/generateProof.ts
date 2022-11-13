import { Deposit, SnarkArtifacts } from "./types";
//@ts-ignore
import { groth16 } from "snarkjs"
import { FullProof } from "./types"


export async function generateProof({ deposit, recepient, change, snarkArtifacts }: { deposit: Deposit, recepient: string, change: string, snarkArtifacts?: SnarkArtifacts }): Promise<FullProof> {
    console.log("Generate proof start");

    const input = {
        nullifierHash: deposit.nullifierHash,
        commitmentHash: deposit.commitment,
        recepient,
        change,
        // private snark inputs
        nullifier: deposit.nullifier,
        secret: deposit.secret
    }


    if (!snarkArtifacts) {
        snarkArtifacts = {
            wasmFilePath: `circuits/withdraw_js/withdraw.wasm`,
            zkeyFilePath: `circuits/withdraw_0001.zkey`
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
export function verifyProof(verificationKey: any, { proof, publicSignals }: FullProof): Promise<boolean> {
    return groth16.verify(
        verificationKey,
        [
            publicSignals[0],
            publicSignals[1],
            publicSignals[2],
            publicSignals[3]
        ],
        proof
    )
}