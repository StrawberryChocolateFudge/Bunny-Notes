import { ethers } from "hardhat";

export async function setUp(): Promise<any> {

    const DENOMINATION = ethers.utils.parseEther("10"); // 10 Dollars!

    const FEEDIVIDER = 10 // The fee is calculated like DENOMINATION / FEEDIVIDEr

    const [owner, alice, bob, attacker, relayer] = await ethers.getSigners();

    const MockERC20Factory = await ethers.getContractFactory("MOCKERC20");
    const MockERC20 = await MockERC20Factory.deploy();
    const USDTM = await MockERC20.deployed();

    // Mint some USDTOM to the owner

    await USDTM.mint(owner.address, ethers.utils.parseEther("100"));


    const VerifierFactory = await ethers.getContractFactory("Verifier");
    const VerifierDeploy = await VerifierFactory.deploy();
    const Verifier = await VerifierDeploy.deployed();

    const ERC20NotesFactory = await ethers.getContractFactory("ERC20Notes");

    const ERC20Notes = await ERC20NotesFactory.deploy(VerifierDeploy.address, DENOMINATION, FEEDIVIDER, MockERC20.address, relayer.address);


    return { owner, alice, bob, attacker, USDTM, Verifier, ERC20Notes, relayer }
}