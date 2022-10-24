import { ethers } from "hardhat";


async function main() {


    const VerifierFactory = await ethers.getContractFactory("Verifier");
    const VerifierDeploy = await VerifierFactory.deploy()
    const verifier = await VerifierDeploy.deployed();

    console.log('Verifier is deployed to :', verifier.address);
    //Verifier is deployed to : 0xD98F9B6AB4fbA9b7173Cfe92Ae1Eb9A3F3F91751
}


// main().catch(err => {
//     console.error(err);
//     process.exitCode = 1;
// })