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

//TESTNET ADDRESSES AND COMMTIMENTS DO NOT USE IN PROD:

// BunnyWallet address:  0x9Fe4E43ED13ae2f0D49a4C53907D12201106fbDa
// Crypto Note:  bunnywallet-0x9Fe4E43ED13ae2f0D49a4C53907D12201106fbDa-1029-0xd046ed27b7542ca82bed6b1665f9cd518db899ce258eebcacec49058000101cad0f920e621d0b936a155fc33f5409d239c484d9453ed945775cf7a000101
