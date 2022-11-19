import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { ERC20Notes, ETHNotes, MOCKERC20 } from "../typechain";

export async function setUp(): Promise<{ owner: SignerWithAddress, alice: SignerWithAddress, bob: SignerWithAddress, USDTM: MOCKERC20, Verifier: Contract, ERC20Notes: ERC20Notes, relayer: SignerWithAddress, ETHNotes: ETHNotes, provider: any, attacker: SignerWithAddress }> {

    const DENOMINATION = ethers.utils.parseEther("10"); // 10 Dollars!

    const FEEDIVIDER = 10 // The fee is calculated like DENOMINATION / FEEDIVIDEr

    const [owner, alice, bob, attacker, relayer] = await ethers.getSigners();

    const MockERC20Factory = await ethers.getContractFactory("MOCKERC20");
    const MockERC20 = await MockERC20Factory.deploy();
    const USDTM = await MockERC20.deployed();

    // Mint some USDTOM to the owner

    await USDTM.mint(owner.address, ethers.utils.parseEther("100"));


    const VerifierFactory = await ethers.getContractFactory("contracts/WithdrawVerifier.sol:Verifier");
    const VerifierDeploy = await VerifierFactory.deploy();
    const Verifier = await VerifierDeploy.deployed();

    const ERC20NotesFactory = await ethers.getContractFactory("ERC20Notes");
    const ETHNotesFactory = await ethers.getContractFactory("ETHNotes");


    const ERC20Notes: ERC20Notes = await ERC20NotesFactory.deploy(VerifierDeploy.address, DENOMINATION, FEEDIVIDER, MockERC20.address, relayer.address);
    const ETHNotes: ETHNotes = await ETHNotesFactory.deploy(VerifierDeploy.address, DENOMINATION, FEEDIVIDER, relayer.address);

    const provider = ethers.provider;

    return { owner, alice, bob, attacker, USDTM, Verifier, ERC20Notes, relayer, ETHNotes, provider }
}