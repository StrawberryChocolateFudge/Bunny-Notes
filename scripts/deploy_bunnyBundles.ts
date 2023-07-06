import { ethers } from "hardhat";
import { ZEROADDRESS } from "../frontend/web3/web3";

async function deploy(network: string) {
  const verifierFactory = await ethers.getContractFactory(
    "contracts/WithdrawBundledNotes.sol:Verifier",
  );
  const bunnyBundlesFactory = await ethers.getContractFactory("BunnyBundles");

  const verifierContract = await verifierFactory.deploy();
  await verifierContract.deployed().then(async () => {
    console.log(`${network} Verifier Deployed to `, verifierContract.address);
    const bunnyBundlesContract = await bunnyBundlesFactory.deploy(
      verifierContract.address,
      ZEROADDRESS,
    );
    const bunnyBundles = await bunnyBundlesContract.deployed();
    console.log(
      `${network} Bunny Bundles was deployed to, `,
      bunnyBundles.address,
    );
  });
}

async function deployOnDonauTestnet() {
  await deploy("DONAU TESTNET");
}

async function main() {
  await deployOnDonauTestnet();
}

// main().catch((err) => {
//   console.error(err);
//   process.exitCode = 1;
// });

// DONAU TESTNET Verifier Deployed to  0x06950a050529D956f79638A2708FD7fA072EE489
// DONAU TESTNET Bunny Bundles was deployed to,  0xA4e589a0A02EEaE9876c1B776E9c8D0bA9EFdfd8
