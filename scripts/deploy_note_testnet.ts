import { ethers } from "hardhat";

const ERC20ADDRESS = "0xeE55e7A619343B2f045bfD9A720BF912e1FCfEC7";
const VERIFIERADDRESS = "0xD98F9B6AB4fbA9b7173Cfe92Ae1Eb9A3F3F91751";
const DENOMINATION = ethers.utils.parseEther("100");
const FEEDIVIDER = 10;
const RELAYERADDRESS = "0xaaCb9bf503Dfb3A8a77BB5c459f45f495B7ad392"; //New external relayer address


async function main() {

  const ERC20NotesFActory = await ethers.getContractFactory("ERC20Notes");
  const ERC20NOTESDeploy = await ERC20NotesFActory.deploy(VERIFIERADDRESS, DENOMINATION, FEEDIVIDER, ERC20ADDRESS, RELAYERADDRESS);
  const ERC20Notes = await ERC20NOTESDeploy.deployed();


  console.log("Bunny Notes ERC20 has been deployed to", ERC20Notes.address);
  // Bunny Notes ERC20 has been deployed to 0xa756b2b52Ba893a6109561bC86138Cbb897Fb2e0
  
}

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
