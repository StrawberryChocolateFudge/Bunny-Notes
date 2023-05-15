// This transaction was created to craete the beacon transaction that will be used for the random beacon applied to the zkp circuits!

import { ethers } from "hardhat";


// This should be ran on mainnet, all it does is send a transaction
// the hash of the tx is used as the final beacon for the zkp phase 2 ceremony

async function main() {
    const [signer] = await ethers.getSigners();

    console.log(signer.address);
    const txMessage = "Bunny Notes Mainnet Beacon Transaction";
    const data = ethers.utils.defaultAbiCoder.encode(["string"], [txMessage])

    const tx = await signer.sendTransaction({
        from: signer.address,
        to: signer.address,
        data
    });

    const res = await tx.wait();

    console.log(`Transaction hash is: ${res.transactionHash}`);

}

// main().catch((err) => {
//     console.error(err);
//     process.exitCode = 1;
// })