import { ethers } from "hardhat";

const VERIFIERADDRESS = "0xD98F9B6AB4fbA9b7173Cfe92Ae1Eb9A3F3F91751"; // BSC Testnet address

const ZKB = "0xeE55e7A619343B2f045bfD9A720BF912e1FCfEC7" //BSC Testnet


async function main() {
    const BunnyNotesFactory = await ethers.getContractFactory("BunnyNotes");
    const bunnyNotesDeploy = await BunnyNotesFactory.deploy(VERIFIERADDRESS, ZKB);
    const bunnyNotes = await bunnyNotesDeploy.deployed();
    console.log("Bunny notes was deployed to ", bunnyNotes.address);
    // Bunny notes was deployed to  0x3bc314B9448E1E33921a9E146bFdA16639a11e4F // on Donau testnet
    // Bunny notes was deployed to  0xF273919f7e9239D5C8C70f49368fF80c0a91064A // on BSC testnet
}


// main().catch((err) => {
//     console.error(err);
//     process.exitCode = 1;
// })