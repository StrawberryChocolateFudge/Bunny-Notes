import { ethers } from "hardhat";
import { toNoteHex } from "../lib/BunnyNote";
import { createBunnyWalletNote, parseOwnerNote } from "../lib/OwnerNote";
import { BunnyWallet } from "../typechain";

const verifierAddress = "0x5b51982a95BBBCDdd831E7aba9AEb8fb0B629FA2"; // Donau Testnet verifier address
const netId = 0x405;

const ownerAddress = "0x71A713135d57911631Bb54259026Eaa030F7B881";

// NOTE: This is only deployed for testing purposes!
// In production all the bunny wallets are deployed by the relayer!

async function main() {
    const BunnyWalletFactory = await ethers.getContractFactory("BunnyWallet");
    const BunnyWallet = await BunnyWalletFactory.deploy();
    const deployed = await BunnyWallet.deployed();

    console.log("BunnyWallet address: ", BunnyWallet.address);

    // generate a note for this bunnyWallet
    const note = await createBunnyWalletNote({ smartContract: BunnyWallet.address, netId, })
    console.log("Crypto Note: ", note);

    const parsedNote = await parseOwnerNote(note);
    await deployed.initialize(verifierAddress, toNoteHex(parsedNote.deposit.commitment), ownerAddress);
}


// main().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// })

// BunnyWallet address:  0xD48E9Cad89681ecEA877641660a439D5DE59cA49
// Crypto Note:  bunnywallet-0xD48E9Cad89681ecEA877641660a439D5DE59cA49-1029-0xc7aa03458f99b7b5be3d415c9df714bc9266a73aa2546ad92e2066db00010135f0e10ca163a2e8e925ae8a51e8ff8a715e94ef51eb81c50e97fa2e000101
