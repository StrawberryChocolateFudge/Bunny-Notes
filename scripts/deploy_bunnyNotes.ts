import { ethers } from "hardhat";
import { ZEROADDRESS } from "../frontend/web3/web3";

const VERIFIERADDRESS = "0xD98F9B6AB4fbA9b7173Cfe92Ae1Eb9A3F3F91751"; // BSC Testnet address

const VERIFIERBTTMAINNET = "0x5586938a2fC4489661E868c5800769Fb10847fC5"; //BTT MAINNET ADDRESS

const ZKB = "0xeE55e7A619343B2f045bfD9A720BF912e1FCfEC7" //BSC Testnet


async function deployOnBTTMAINNET() {
    const BunnyNotesFactory = await ethers.getContractFactory("BunnyNotes");
    // Deploying on BTT mainnet without a feeless token!
    const bunnyNotesDeploy = await BunnyNotesFactory.deploy(VERIFIERBTTMAINNET, ZEROADDRESS);
    const bunnyNotes = await bunnyNotesDeploy.deployed();
    console.log("Bunny notes was deployed to ", bunnyNotes.address);

}

//TODO: DEPLOY ON BSC MAINNET

async function main() {
    await deployOnBTTMAINNET();
}


main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
})

    // Bunny notes was deployed to  0x3bc314B9448E1E33921a9E146bFdA16639a11e4F // on Donau testnet
    // Bunny notes was deployed to  0xF273919f7e9239D5C8C70f49368fF80c0a91064A // on BSC testnet
    // Bunny notes was deployed to  0x3Cad43A3038F0E657753C0129ce7Ea4a5801EC90 ON BTT MAINNET!!