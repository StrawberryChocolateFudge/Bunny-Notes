import { BigNumber } from "ethers";
import { ethers } from "hardhat";

const DEPLOYEDNFT = "0x05a18942658b49dd3a2A9F2D1C6ea35C5029EF00";

const BUNNYWALLET = "0x3dAf9E221a8870ED5238c850333826a3f89375D2"

async function main() {
    // await mint();
    await safeTransferFrom();
}

async function deploy() {
    const NFTFactory = await ethers.getContractFactory("MOCKERC721");
    const NFT = await NFTFactory.deploy();

    console.log("NFT address", NFT.address);

}

async function mint() {
    const factory = await ethers.getContractFactory("MOCKERC721");
    const nftContract = await factory.attach(DEPLOYEDNFT);
    await nftContract.mintUniqueTokenTo("0x71A713135d57911631Bb54259026Eaa030F7B881", BigNumber.from(2));
    await nftContract.mintUniqueTokenTo("0x71A713135d57911631Bb54259026Eaa030F7B881", BigNumber.from(3));


}

async function safeTransferFrom() {
    const factory = await ethers.getContractFactory("MOCKERC721");
    const nftContract = await factory.attach(DEPLOYEDNFT);

    await nftContract["safeTransferFrom(address,address,uint256)"]("0x71A713135d57911631Bb54259026Eaa030F7B881", BUNNYWALLET, BigNumber.from(2));
    await nftContract["safeTransferFrom(address,address,uint256)"]("0x71A713135d57911631Bb54259026Eaa030F7B881", BUNNYWALLET, BigNumber.from(3));

}



main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})