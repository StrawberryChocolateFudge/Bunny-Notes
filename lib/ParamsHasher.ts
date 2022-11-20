import { BigNumber, ethers } from "ethers";
const keccak256 = ethers.utils.solidityKeccak256;

export async function transferParamsHash(
    token: string,
    to: string,
    amount: BigNumber) {
    return keccak256(
        ["address", "address", "uint256"],
        [token, to, amount]);
}

export async function transferERC721ParamsHash(
    token: string,
    from: string,
    to: string,
    tokenId: BigNumber) {
    return keccak256(
        [
            "address",
            "address",
            "address",
            "uint256"],
        [
            token,
            from,
            to,
            tokenId
        ])
}

export async function approveERC721ParamsHash(
    token: string,
    to: string,
    tokenId: BigNumber,
    forAll: boolean,
    approved: boolean) {
    return keccak256(
        ["address", "address", "uint256", "bool", "bool"],
        [token, to, tokenId, forAll, approved])
}

export async function depositToBunnyNoteParamsHash(
    token: string,
    to: string,
    amount: BigNumber,
    newCommitment: string,
    cashNote: boolean) {
    return keccak256(
        [
            "address",
            "address",
            "uint256",
            "bytes32",
            "bool"
        ],
        [
            token,
            to,
            amount,
            newCommitment,
            cashNote
        ]
    );
}

export async function exactInputSingleSwapParamsHash(addressParams: Array<string>[4], amounts: Array<any>[2], fee: number) {
    return keccak256(
        [
            "address", "address", "address", "address", "uint256", "uint256", "uint24"

        ], [
        addressParams[0],
        addressParams[1],
        addressParams[2],
        addressParams[3],
        amounts[0],
        amounts[1],
        fee
    ])
}
