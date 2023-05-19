import { ethers } from "hardhat";

const initialSupply = ethers.utils.parseEther("100000000");

async function main() {
    const ZKBFactory = await ethers.getContractFactory("ZKBToken");
    const ZKBDeploy = await ZKBFactory.deploy(initialSupply);
    const zkbtoken = await ZKBDeploy.deployed();
    console.log("ZKB Token deployed to ", zkbtoken.address);
    // ZKB Token deployed to  0x72b5bD690A3253e4B6cCB7A4bAe53EC34b1e8Df2 on Donau testnet
    // ZKB Token deployed to  0xeDc320436A3d390B65Dfc0dc868909c914F431cA on BSC testnet
}


// main().catch((err) => {
//     console.error(err);
//     process.exitCode = 1;
// })