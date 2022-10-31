import { ethers } from "hardhat";


async function main() {
    const USDTMFActory = await ethers.getContractFactory("MOCKERC20");
    const USDTMDeploy = await USDTMFActory.deploy();
    const USDTM = await USDTMDeploy.deployed();

    console.log("USDTM address: ", USDTM.address);
    //USDTM address:  0xeE55e7A619343B2f045bfD9A720BF912e1FCfEC7
}

// main().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// })