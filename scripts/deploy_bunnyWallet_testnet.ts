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

// BunnyWallet address:  0x3dAf9E221a8870ED5238c850333826a3f89375D2
// Crypto Note:  bunnywallet-0x3dAf9E221a8870ED5238c850333826a3f89375D2-1029-0x709aaa790203c51f59b062bb3f7fa2480857807b85d6cb085895d3bb0001018c38d2f6833be1414fa1b4e8db51bb77aa33cc21423ddcb762ed047c000101


// BunnyWallet address:  0x7c8667161e42604DBa0207d1d704e9AA8363C83b
// Crypto Note:  bunnywallet-0x7c8667161e42604DBa0207d1d704e9AA8363C83b-1029-0x4572f41f6e620a6477b0beaf3968e236ae8318a8c99b8e551459e0ab000101abaec6af0abbf09267e6df524cae7dd70b0fb630ebaaa25176a35d28000101