import { ethers } from "hardhat";


async function main() {

    const IsOwnerVerifierFactory = await ethers.getContractFactory("contracts/IsOwnerVerifier.sol:Verifier");
    const IsOwnerVerifierDeploy = await IsOwnerVerifierFactory.deploy();
    const isOwnerVerifier = await IsOwnerVerifierDeploy.deployed();

    console.log("IsOwnerVerifier address: ", isOwnerVerifier.address);
}


// main().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// })