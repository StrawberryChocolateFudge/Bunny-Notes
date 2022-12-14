//@ts-ignore
import { poseidon } from "circomlibjs";
import { BigNumberish } from "./types";


export function generateCommitmentHash(nullifier: BigNumberish, secret: BigNumberish): bigint {
    return poseidon([BigInt(nullifier), BigInt(secret)]);
}

export function generateNullifierHash(nullifier: BigNumberish): bigint {
    return poseidon([BigInt(nullifier)])
}