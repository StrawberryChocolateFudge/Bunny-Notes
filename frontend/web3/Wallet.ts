import { utils } from "ethers";
import { BunnyWallet } from "../../typechain/BunnyWallet";


// state change by owner
export async function resetCommitment(contract: BunnyWallet, newCommitment: string) {
    const res = await contract.resetCommitment(newCommitment);
    return await res.wait();
}

export async function transferETHByOwner(contract: BunnyWallet, to: string, amount: string) {
    const res = await contract.transferETHByOwner(to, utils.parseEther(amount));
    return await res.wait();
}

export async function transferTokenByOwner(contract: BunnyWallet, token: string, to: string, amount: string) {
    const res = await contract.transferTokenByOwner(token, to, utils.parseEther(amount));
    return await res.wait()
}

export async function approveERC20SpendByOwner(contract: BunnyWallet, token: string, spender: string, amount: string) {
    return await contract.approveERC20SpendByOwner(token, spender, utils.parseEther(amount));
}

export async function transferERC721ByOwner(contract: BunnyWallet, token: string, from: string, to: string, tokenId: string) {
    const res = await contract.transferERC721ByOwner(token, from, to, tokenId);
    return await res.wait();
}

export async function approveERC721ByOwner(contract: BunnyWallet, token: string, to: string, tokenId: string, forAll: boolean, approved: boolean) {
    const res = await contract.approveERC721ByOwner(token, to, tokenId, forAll, approved);
    return await res.wait();
}

export async function depositToBunnyNoteByOwner(contract: BunnyWallet, notesContract: string, token: string, newCommitment: string, cashNote: boolean, isERC20Note: boolean) {
    return await contract.depositToBunnyNoteByOwner(notesContract, token, newCommitment, cashNote, isERC20Note);
}

export async function getTokenBalance(contract: BunnyWallet, token: string) {
    return await contract.getTokenBalance(token);
}
export async function getOwner(contract: BunnyWallet) {
    return await contract.owner();
}
