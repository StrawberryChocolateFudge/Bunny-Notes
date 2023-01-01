import { ethers } from "hardhat";

const VERIFIERADDRESS = "0xe5f45dAA32B40742E625a3Ebd1cDf6f343614AdE";
const DENOMINATION = ethers.utils.parseEther("1");
const FEEDIVIDER = 100;
const RELAYERADDRESS = "0xaaCb9bf503Dfb3A8a77BB5c459f45f495B7ad392"; //New external relayer address


async function main() {

  const ETHNotesFActory = await ethers.getContractFactory("ETHNotes");
  const ETHNOTESDeploy = await ETHNotesFActory.deploy(VERIFIERADDRESS, DENOMINATION, FEEDIVIDER, RELAYERADDRESS);
  const ETHNotes = await ETHNOTESDeploy.deployed();


  console.log("Bunny Notes ETH Note has been deployed to", ETHNotes.address);
  // Bunny Notes ETH Note has been deployed to 0x2D524Ee2669b7F521B9d903A56002ba565cc50ba
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
