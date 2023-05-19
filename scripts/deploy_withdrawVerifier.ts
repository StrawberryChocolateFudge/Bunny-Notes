import { ethers } from "hardhat";

async function main() {


    const VerifierFactory = await ethers.getContractFactory("contracts/WithdrawVerifier.sol:Verifier");
    const VerifierDeploy = await VerifierFactory.deploy()
    const verifier = await VerifierDeploy.deployed();

    console.log('Verifier is deployed to :', verifier.address);
    // Verifier is deployed to : 0x02B721A1dB666CE9E6dF903BE2664872D9F98345 on Donau testnet // Latest
    // Verifier is deployed to : 0x18a8C98DBfe92d739f4134493F39cE8b692f323B on BSC Testnet!! // Latest yeah
    // Verifier is deployed to : 0x5586938a2fC4489661E868c5800769Fb10847fC5 on BTT MAINNET!!// latest
}


// main().catch(err => {
//     console.error(err);
//     process.exitCode = 1;
// })