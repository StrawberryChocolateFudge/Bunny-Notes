import { ethers } from "hardhat";


async function main() {


    const VerifierFactory = await ethers.getContractFactory("contracts/WithdrawVerifier.sol:Verifier");
    const VerifierDeploy = await VerifierFactory.deploy()
    const verifier = await VerifierDeploy.deployed();

    console.log('Verifier is deployed to :', verifier.address);
    // Verifier is deployed to : 0xAca78197856E90985949DaBFA2B687f42D9d0Aa2 on Donau testnet
}


// main().catch(err => {
//     console.error(err);
//     process.exitCode = 1;
// })