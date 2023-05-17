import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { BunnyBundles, BunnyNotes, ERC20, MOCKERC20, TokenSale } from "../typechain";

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

export async function setUpBunnyNotes(): Promise<{ owner: SignerWithAddress, alice: SignerWithAddress, bob: SignerWithAddress, USDTM: MOCKERC20, Verifier: Contract, relayer: SignerWithAddress, bunnyNotes: BunnyNotes, provider: any, attacker: SignerWithAddress, feelesstoken: MOCKERC20, tokensale: TokenSale }> {
    const [owner, alice, bob, attacker, relayer] = await ethers.getSigners();

    const MockERC20Factory = await ethers.getContractFactory("MOCKERC20");
    const MockERC20 = await MockERC20Factory.deploy();
    const USDTM = await MockERC20.deployed();


    const FeeLessTokenFactory = await ethers.getContractFactory("MOCKERC20");
    const feelessTokenDeploy = await FeeLessTokenFactory.deploy();
    const feelesstoken = await feelessTokenDeploy.deployed();
    // Mint some USDTOM to the owner

    await USDTM.mint(owner.address, ethers.utils.parseEther("100"));

    const VerifierFactory = await ethers.getContractFactory("contracts/WithdrawVerifier.sol:Verifier");
    const VerifierDeploy = await VerifierFactory.deploy();
    const Verifier = await VerifierDeploy.deployed();

    const BunnyNotesFactory = await ethers.getContractFactory("BunnyNotes");
    const bunnyNotesDeploy = await BunnyNotesFactory.deploy(Verifier.address, feelesstoken.address);
    const bunnyNotes = await bunnyNotesDeploy.deployed();

    const TokenSaleFactory = await ethers.getContractFactory("TokenSale");
    const tokensaleDeploy = await TokenSaleFactory.deploy(relayer.address, USDTM.address);
    const tokensale = await tokensaleDeploy.deployed();


    const provider = ethers.provider;

    return { owner, alice, bob, attacker, USDTM, Verifier, bunnyNotes, relayer, provider, feelesstoken, tokensale }
}

export async function setUpBunnyBundles(): Promise<SetUpBundlesType> {
    const [owner, alice, bob, attacker] = await ethers.getSigners();

    const MockERC20Factory = await ethers.getContractFactory("MOCKERC20");
    const MockERC20 = await MockERC20Factory.deploy();
    const USDTM = await MockERC20.deployed();


    const FeeLessTokenFactory = await ethers.getContractFactory("MOCKERC20");
    const feelessTokenDeploy = await FeeLessTokenFactory.deploy();
    const feelesstoken = await feelessTokenDeploy.deployed();

    const VerifierFactory = await ethers.getContractFactory("contracts/WithdrawBundledNotes.sol:Verifier");
    const VerifierDeploy = await VerifierFactory.deploy();
    const Verifier = await VerifierDeploy.deployed();

    const BunnyBundlesFactory = await ethers.getContractFactory("BunnyBundles");
    const bunnyBundlesDeploy = await BunnyBundlesFactory.deploy(Verifier.address, feelesstoken.address);
    const bunnyBundles = await bunnyBundlesDeploy.deployed();

    return { owner, alice, bob, attacker, bunnyBundles, USDTM, feelesstoken };
}
type SetUpBundlesType = {
    owner: SignerWithAddress,
    alice: SignerWithAddress,
    bob: SignerWithAddress,
    attacker: SignerWithAddress,
    bunnyBundles: BunnyBundles,
    USDTM: MOCKERC20,
    feelesstoken: MOCKERC20
}