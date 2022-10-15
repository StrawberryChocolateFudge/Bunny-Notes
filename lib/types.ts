export type BigNumberish = string | bigint

export type Deposit = {
    nullifier: bigint,
    secret: bigint,
    preimage: Buffer,
    commitment: bigint,
    nullifierHash: bigint
}

export type SnarkArtifacts = {
    wasmFilePath: string
    zkeyFilePath: string
}

export type Proof = {
    pi_a: BigNumberish[]
    pi_b: BigNumberish[][]
    pi_c: BigNumberish[]
    protocol: string
    curve: string
}

export type FullProof = {
    proof: Proof
    publicSignals: Array<any>
}

export type PublicSignals = {
    nullifierHash: bigint,
    commitmentHash: bigint,
    recipient: string,
    fee: string
}

//TODO: CHECK TO MAKE SURE THIS IS CORRECT!!
export type SolidityProof = [
    BigNumberish,
    BigNumberish,
    BigNumberish,
    BigNumberish,
    BigNumberish,
    BigNumberish,
    BigNumberish,
    BigNumberish
]