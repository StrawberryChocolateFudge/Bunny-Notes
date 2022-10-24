import { ethers } from "hardhat";

const ERC20ADDRESS = "0xeE55e7A619343B2f045bfD9A720BF912e1FCfEC7";
const VERIFIERADDRESS = "0xD98F9B6AB4fbA9b7173Cfe92Ae1Eb9A3F3F91751";
const DENOMINATION = ethers.utils.parseEther("10");
const FEEDIVIDER = 10;
const RELAYERADDRESS = "0x71A713135d57911631Bb54259026Eaa030F7B881";


async function main() {

  const ERC20NotesFActory = await ethers.getContractFactory("ERC20Notes");
  const ERC20NOTESDeploy = await ERC20NotesFActory.deploy(VERIFIERADDRESS, DENOMINATION, FEEDIVIDER, ERC20ADDRESS, RELAYERADDRESS);
  const ERC20Notes = await ERC20NOTESDeploy.deployed();


  console.log("Bunny Notes ERC20 has been deployed to", ERC20Notes.address);
  // Bunny Notes ERC20 has been deployed to 0xF273919f7e9239D5C8C70f49368fF80c0a91064A

}

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
