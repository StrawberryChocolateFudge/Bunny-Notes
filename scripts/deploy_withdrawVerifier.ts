import { ethers } from "hardhat";

// /?TODO: DEPLOY ON BSC MAINNET!!
async function main() {


    const VerifierFactory = await ethers.getContractFactory("contracts/WithdrawVerifier.sol:Verifier");
    const VerifierDeploy = await VerifierFactory.deploy()
    const verifier = await VerifierDeploy.deployed();

    console.log('Verifier is deployed to :', verifier.address);
    // Verifier is deployed to : 0xAca78197856E90985949DaBFA2B687f42D9d0Aa2 on Donau testnet
    // Verifier is deployed to : 0xD98F9B6AB4fbA9b7173Cfe92Ae1Eb9A3F3F91751 on BSC Testnet!!
    // Verifier is deployed to : 0x5586938a2fC4489661E868c5800769Fb10847fC5 on BTT MAINNET!!
}


// main().catch(err => {
//     console.error(err);
//     process.exitCode = 1;
// })