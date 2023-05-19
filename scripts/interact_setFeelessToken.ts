import { ethers } from "hardhat";


async function interactWithBSC_TESTNET() {
    const tokenAddress = "0xeDc320436A3d390B65Dfc0dc868909c914F431cA" // BSC ZKB address
    const BunnyNotesFactory = await ethers.getContractFactory("BunnyNotes");
    const bunnyNotesContract = await BunnyNotesFactory.attach("0x29EbE72886d007cC4F2c3F43c9f899ab242Cc917")

    await bunnyNotesContract.setFeelessToken(tokenAddress).then((receipt) => {
        console.log("set feeless token");
        console.table(receipt);
    });
}


async function main() {
    await interactWithBSC_TESTNET();
}

// main().catch((err) => {
//     console.error(err);
//     process.exitCode = 1;
// })
