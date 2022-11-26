
//Event ABIs

import { ethers } from "hardhat"

export const eventABIs = {
    InitializedContract: ["event InitializedContract(address _ownerVerifier,address _swapRouter,bytes32 _commitment,address _owner)"],
    Received: ["event Received(address from, uint256 amount)"],
    CommitmentReset: ["event CommitmentReset(bytes32 oldCommitment, bytes32 newCommitment)"],
    TransferEthByOwner: ["event TransferEthByOwner(address to, uint256 amount)"],
    TransferEthRelayed: ["event TransferEthRelayed(address to, uint256 amount)"],
    TransferTokenByOwner: ["event TransferTokenByOwner(address token, address to, uint256 amount)"],
    TransferTokenByRelayer: ["event TransferTokenByRelayer(address token, address to, uint256 amount)"],
    ApproveSpendByOwner: ["event ApproveSpendByOwner(address token, address spender, uint256 amount)"],
    ApproveSpendRelayed: ["event ApproveSpendRelayed(address token, address spender, uint256 amount)"],
    TransferERC721ByOwner: ["event TransferERC721ByOwner(address token,address from,address to,uint256 tokenId)"],
    TransferERC721Relayed: ["event TransferERC721Relayed(address token,address from,address to,uint256 tokenId)"],
    ApproveERC721ByOwner: ["event ApproveERC721ByOwner(address token,address to,uint256 tokenId,bool forAll,bool approved)"],
    ApproveERC721Relayed: ["event ApproveERC721Relayed(address token,address to,uint256 tokenId,bool forAll,bool approved)"],
    ERC721Received: ["event ERC721Received(address operator,address from,uint256 tokenId,bytes data)"],
    DepositBunnyNoteByOwner: ["event DepositBunnyNoteByOwner(ERC20Notes _notesContract,IERC20 token,bytes32 commitment)"],
    DepositBunnyNoteRelayed: ["event DepositBunnyNoteRelayed(ERC20Notes _notesContract,address token,bytes32 commitment)"],
    SwapByOwner: ["event SwapByOwner(address tokenIn,address tokenOut,uint256 amountIn,uint256 amountOutMin)"],
    SwapRelayed: ["  event SwapRelayed(address tokenIn,address tokenOut,uint256 amountIn,uint256 amountOutMin)"]
}

export function parseLog(ABI: string[], log: any) {
    const iface = new ethers.utils.Interface(ABI);
    return iface.parseLog(log);
}