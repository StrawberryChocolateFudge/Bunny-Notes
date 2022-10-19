import { ethers } from "hardhat";

const ERC20ADDRESS = "";
const VERIFIERADDRESS = "";
const DENOMINATION = ethers.utils.parseEther("10");
const FEEDIVIDER = 10;
const RELAYERADDRESS = "";


async function main() {

  const ERC20NotesFActory = await ethers.getContractFactory("ERC20Notes");
  const ERC20NOTESDeploy = await ERC20NotesFActory.deploy(VERIFIERADDRESS, DENOMINATION, FEEDIVIDER, ERC20ADDRESS, RELAYERADDRESS);
  const ERC20Notes = await ERC20NOTESDeploy.deployed();


  console.log("Bunny Notes ERC20 has been deployed to", ERC20Notes.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
