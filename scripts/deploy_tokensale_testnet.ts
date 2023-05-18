import { ethers } from "hardhat";

const tokenOwnerWallet = "0x71A713135d57911631Bb54259026Eaa030F7B881";
const tokenAddress = "0xeE55e7A619343B2f045bfD9A720BF912e1FCfEC7" // BSC address

// TODO:  I NEED TO REFACTOR THIS TO USE BSC MAINNET!!!
// AFTER I DEPLOY I NEED TO APPROVE TOO

async function main() {
    const TokenSaleFactory = await ethers.getContractFactory("TokenSale");
    const tokenSaleDeploy = await TokenSaleFactory.deploy(tokenOwnerWallet, tokenAddress);
    const tokensale = await tokenSaleDeploy.deployed();

    console.log("TokenSale is deployed to :", tokensale.address);
    // TokenSale is deployed to : 0x57ca49c07328da62335Fc450176C274157C01eB6

    //TODO: Approve spending the token by the token sale contract
}


// main().catch((err) => {
//     console.error(err);
//     process.exitCode = 1;
// })