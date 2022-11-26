import { BigNumber, ethers } from "ethers";
const keccak256 = ethers.utils.solidityKeccak256;

export async function transferParamsHash(
    commitment: string,
    nullifierHash: string,
    token: string,
    to: string,
    amount: BigNumber) {
    return keccak256(
        ["bytes32", "bytes32", "address", "address", "uint256"],
        [commitment, nullifierHash, token, to, amount]);
}

export async function transferERC721ParamsHash(
    commitment: string,
    nullifierHash: string,
    token: string,
    from: string,
    to: string,
    tokenId: BigNumber) {
    return keccak256(
        [
            "bytes32",
            "bytes32",
            "address",
            "address",
            "address",
            "uint256"],
        [commitment, nullifierHash,
            token,
            from,
            to,
            tokenId
        ])
}

export async function approveERC721ParamsHash(
    commitment: string,
    nullifierHash: string,
    token: string,
    to: string,
    tokenId: BigNumber,
    forAll: boolean,
    approved: boolean) {
    return keccak256(

        ["bytes32", "bytes32", "address", "address", "uint256", "bool", "bool"],
        [commitment, nullifierHash, token, to, tokenId, forAll, approved])
}

export async function depositToBunnyNoteParamsHash(
    commitment: string,
    nullifierHash: string,
    token: string,
    to: string,
    amount: BigNumber,
    newCommitment: string,
    cashNote: boolean) {
    return keccak256(
        [
            "bytes32",
            "bytes32",
            "address",
            "address",
            "uint256",
            "bytes32",
            "bool"
        ],
        [
            commitment,
            nullifierHash,
            token,
            to,
            amount,
            newCommitment,
            cashNote
        ]
    );
}

export async function exactInputSingleSwapParamsHash(commitment: string, nullifierHash: string, addressParams: Array<string>[4], amounts: Array<any>[2], fee: number) {
    return keccak256(
        [
            "bytes32", "bytes32", "address", "address", "address", "address", "uint256", "uint256", "uint24"

        ], [
        commitment,
        nullifierHash,
        addressParams[0],
        addressParams[1],
        addressParams[2],
        addressParams[3],
        amounts[0],
        amounts[1],
        fee
    ])
}
