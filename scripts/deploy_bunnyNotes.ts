import { ethers } from "hardhat";
import { ZEROADDRESS } from "../frontend/web3/web3";


async function deployOnBTTTestnet() {
    const VeriierBTTTestnet = "0x02B721A1dB666CE9E6dF903BE2664872D9F98345";
    const BunnyNotesFactory = await ethers.getContractFactory("BunnyNotes");
    // Deploying on BTT mainnet without a feeless token!
    const bunnyNotesDeploy = await BunnyNotesFactory.deploy(VeriierBTTTestnet, ZEROADDRESS);
    const bunnyNotes = await bunnyNotesDeploy.deployed();
    console.log("Bunny notes was deployed to ", bunnyNotes.address);
}


async function deployOnBTTMAINNET() {
    const VERIFIERBTTMAINNET = "0x5586938a2fC4489661E868c5800769Fb10847fC5"; //BTT MAINNET ADDRESS

    const BunnyNotesFactory = await ethers.getContractFactory("BunnyNotes");
    // Deploying on BTT mainnet without a feeless token!
    const bunnyNotesDeploy = await BunnyNotesFactory.deploy(VERIFIERBTTMAINNET, ZEROADDRESS);
    const bunnyNotes = await bunnyNotesDeploy.deployed();
    console.log("Bunny notes was deployed to ", bunnyNotes.address);
}

async function deployOnBSCTestnet() {
    const VERIFIERADDRESS = "0x18a8C98DBfe92d739f4134493F39cE8b692f323B"; // BSC Testnet address

    const ZKB = "0xeE55e7A619343B2f045bfD9A720BF912e1FCfEC7" //BSC Testnet

    const BunnyNotesFactory = await ethers.getContractFactory("BunnyNotes");
    // Deploying on BTT mainnet without a feeless token!
    const bunnyNotesDeploy = await BunnyNotesFactory.deploy(VERIFIERADDRESS, ZKB);
    const bunnyNotes = await bunnyNotesDeploy.deployed();
    console.log("Bunny notes was deployed to ", bunnyNotes.address);
}

//TODO: Deploy on BSC mainnet


async function main() {
    // await deployOnBTTMAINNET();
    // await deployOnBTTTestnet();
    // await deployOnBSCTestnet();
}


// main().catch((err) => {
//     console.error(err);
//     process.exitCode = 1;
// })

    // Bunny notes was deployed to  0x859576e721404004dab525EB2Da0865E949eA717 // on Donau testnet // latest verifier
    // Bunny notes was deployed to  0x29EbE72886d007cC4F2c3F43c9f899ab242Cc917 // on BSC testnet // latest verifier nows
    // Bunny notes was deployed to  0x3Cad43A3038F0E657753C0129ce7Ea4a5801EC90 ON BTT MAINNET!! // latest veriier