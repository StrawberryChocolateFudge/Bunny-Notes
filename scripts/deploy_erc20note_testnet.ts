import { ethers } from "hardhat";

const ERC20ADDRESS = "0xeE55e7A619343B2f045bfD9A720BF912e1FCfEC7";
const VERIFIERADDRESS = "0xe5f45dAA32B40742E625a3Ebd1cDf6f343614AdE";
const DENOMINATION = ethers.utils.parseEther("100");
const FEEDIVIDER = 10;
const RELAYERADDRESS = "0xaaCb9bf503Dfb3A8a77BB5c459f45f495B7ad392"; //New external relayer address


async function main() {

  const ERC20NotesFActory = await ethers.getContractFactory("ERC20Notes");
  const ERC20NOTESDeploy = await ERC20NotesFActory.deploy(VERIFIERADDRESS, DENOMINATION, FEEDIVIDER, ERC20ADDRESS, RELAYERADDRESS);
  const ERC20Notes = await ERC20NOTESDeploy.deployed();


  console.log("Bunny Notes ERC20 has been deployed to", ERC20Notes.address);
// Bunny Notes ERC20 has been deployed to 0x94D1f7e4667f2aE54494C2a99A18C8B4aED9B22A  
}

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
