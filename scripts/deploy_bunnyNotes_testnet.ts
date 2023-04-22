import { ethers } from "hardhat";

const VERIFIERADDRESS = "0xAca78197856E90985949DaBFA2B687f42D9d0Aa2";
const ZKB = "0x72b5bD690A3253e4B6cCB7A4bAe53EC34b1e8Df2"
async function main() {
    const BunnyNotesFactory = await ethers.getContractFactory("BunnyNotes");
    const bunnyNotesDeploy = await BunnyNotesFactory.deploy(VERIFIERADDRESS, ZKB);
    const bunnyNotes = await bunnyNotesDeploy.deployed();
    console.log("Bunny notes was deployed to ", bunnyNotes.address);
    // Bunny notes was deployed to  0x3bc314B9448E1E33921a9E146bFdA16639a11e4F // on Donau testnet
}


// main().catch((err) => {
//     console.error(err);
//     process.exitCode = 1;
// })