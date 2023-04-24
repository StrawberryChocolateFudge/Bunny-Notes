import { formatEther } from "ethers/lib/utils";
import { ethers } from "hardhat";

const tokenOwnerWallet = "0x71A713135d57911631Bb54259026Eaa030F7B881";
const tokenAddress = "0xeE55e7A619343B2f045bfD9A720BF912e1FCfEC7" // BSC testnet address
const tokenSale = "0x57ca49c07328da62335Fc450176C274157C01eB6" //BSC Testnet
const approveAmount = ethers.utils.parseEther("50000000");

async function main() {
    const ZKBFactory = await ethers.getContractFactory("ZKBToken");
    const zkb = await ZKBFactory.attach(tokenAddress);
    const tx = await zkb.approve(tokenSale, approveAmount);

    await tx.wait().then(async (receipt) => {
        console.log("Transaction finished with status code : ", receipt.status);
        const allowance = await zkb.allowance(tokenOwnerWallet, tokenSale);
        console.log(`Wallet ${tokenOwnerWallet} has ${formatEther(allowance)} ZKB Allowance`)
    })

}


// main().catch((err) => {
//     console.error(err);
//     process.exitCode = 1;
// })