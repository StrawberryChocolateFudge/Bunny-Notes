import { Deposit, SnarkArtifacts } from "./types";
//@ts-ignore
import { groth16 } from "snarkjs"
import { FullProof } from "./types"


// Generates the proofs for verification! 
export async function generateNoteWithdrawProof({ deposit, recipient, change, snarkArtifacts }: { deposit: Deposit, recipient: string, change: string, snarkArtifacts?: SnarkArtifacts }): Promise<FullProof> {
    console.log("Generate proof start");

    const input = {
        nullifierHash: deposit.nullifierHash,
        commitmentHash: deposit.commitment,
        recipient,
        change,
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

export function verifyFourPublicSignals(verificationKey: any, { proof, publicSignals }: FullProof): Promise<boolean> {
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

export type IsOwnerProofDetails = {
    secret: bigint;
    nullifiler: bigint;
    commitmentHash: bigint;
    smartContract: string;
    relayer: string,
    paramsHash: string;
};

// The IsOwnerProof generation and verification
export async function generateIsOwnerProof({ details, snarkArtifacts }: { details: IsOwnerProofDetails, snarkArtifacts?: SnarkArtifacts }) {
    console.log("Generate proof start");
    const input = {
        //public inputs
        commitmentHash: details.commitmentHash,
        smartContractWallet: details.smartContract,
        relayer: details.relayer,
        paramsHash: details.paramsHash,

        // private 
        secret: details.secret,
        nullifier: details.nullifiler
    }

    if (!snarkArtifacts) {
        snarkArtifacts = {
            wasmFilePath: `circuits/wallet_owner/isOwner_js/isOwner.wasm`,
            zkeyFilePath: `circuits/wallet_owner/isOwner_0001.zkey`
        }
    }
    console.time("Proof Time");


    const { proof, publicSignals } = await groth16.fullProve(input, snarkArtifacts.wasmFilePath, snarkArtifacts.zkeyFilePath)
    console.timeEnd("Proof Time");

    return { proof, publicSignals }

}
