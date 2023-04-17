import { ethers } from "hardhat";

const VERIFIERADDRESS = "0xAca78197856E90985949DaBFA2B687f42D9d0Aa2";

async function main() {
    const BunnyNotesFactory = await ethers.getContractFactory("BunnyNotes");
    const bunnyNotesDeploy = await BunnyNotesFactory.deploy(VERIFIERADDRESS);
    const bunnyNotes = await bunnyNotesDeploy.deployed();
    console.log("Bunny notes was deployed to ", bunnyNotes.address);
    // Bunny notes was deployed to  0x9598B4A28dd48D3b4b4C8A862D3220290D8dDE1b on donau testnet
}


main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
})