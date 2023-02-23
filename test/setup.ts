import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { ERC20Notes, ETHNotes, MOCKERC20 } from "../typechain";

import { expect } from "chai";


const DENOMINATION = ethers.utils.parseEther("10");
const FEEDIVIDER = 10 // The fee is calculated like DENOMINATION / FEEDIVIDER




export async function expectRevert(callback: CallableFunction, errorMessage: string) {
    let throws = false;
    try {
        await callback();
    } catch (err: any) {
        const message = err.stackTrace[1].message;
        const value: string = message.value.toString();
        console.log("Expect Revert: ", value);
        expect(value.includes(errorMessage)).to.be.true;
        throws = true;
    } finally {
        if (!throws) {
            throw new Error("Function failed to revert!");
        }
    }

}

export async function setUpNotes(): Promise<{ owner: SignerWithAddress, alice: SignerWithAddress, bob: SignerWithAddress, USDTM: MOCKERC20, Verifier: Contract, ERC20Notes: ERC20Notes, relayer: SignerWithAddress, ETHNotes: ETHNotes, provider: any, attacker: SignerWithAddress }> {


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