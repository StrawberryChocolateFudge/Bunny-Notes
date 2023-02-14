import { ethers } from "hardhat";


async function main() {


    const VerifierFactory = await ethers.getContractFactory("contracts/WithdrawVerifier.sol:Verifier");
    const VerifierDeploy = await VerifierFactory.deploy()
    const verifier = await VerifierDeploy.deployed();

    console.log('Verifier is deployed to :', verifier.address);
    // Verifier is deployed to : 0xe5f45dAA32B40742E625a3Ebd1cDf6f343614AdE
}


// main().catch(err => {
//     console.error(err);
//     process.exitCode = 1;
// })