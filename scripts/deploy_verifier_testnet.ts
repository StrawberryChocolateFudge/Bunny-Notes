import { ethers } from "hardhat";


async function main() {


    const VerifierFactory = await ethers.getContractFactory("Verifier");

    const VerifierDeploy = await VerifierFactory.deploy()

    const verifier = await VerifierDeploy.deployed();

    console.log('Verifier is deployed to :', verifier.address);

}


main().catch(err => {
    console.error(err);
    process.exitCode = 1;
})