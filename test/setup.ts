import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract, ContractFactory } from "ethers";
import { ethers, upgrades } from "hardhat";
import { ERC20Notes, ETHNotes, MOCKERC20, Verifier } from "../typechain";
//@ts-ignore
import swapRouter from '@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json'
//@ts-ignore
import factory from "@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json";
//@ts-ignore
import WETH9 from "@uniswap/hardhat-v3-deploy/src/util/WETH9.json";
//@ts-ignore
import UniswapV3Pool from '@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json';
//@ts-ignore
import NFTDescriptorArtifact from "@uniswap/v3-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json";
//@ts-ignore
import NonfungibleTokenPositionDescriptorArtifact from "@uniswap/v3-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json"
import { createBunnyWalletNote, parseOwnerNote } from "../lib/OwnerNote";
import { createDeposit, toNoteHex } from "../lib/BunnyNote";
import { rbigint } from "../lib/random";
import { BunnyWallet } from "../typechain";
import { expect } from "chai";
import { Network } from "hardhat/types";
import { MOCKERC721 } from "../typechain/MOCKERC721";
import { parseEther } from "ethers/lib/utils";

//ERC20 Notes denomiantion and FeeDivider, file scoped so I can use it in other tests!
const DENOMINATION = ethers.utils.parseEther("10"); // 10 Dollars!
const FEEDIVIDER = 10 // The fee is calculated like DENOMINATION / FEEDIVIDEr

// deploy the bytecode

// TODO: I need to deploy the unsiwap swap Router for testing!
// I need to deploy a proxy admin and proxies
// I need to deploy the bunny wallet logic contract!
// I need to deploy bunny notes for testing
// I need to deploy the erc20 for testing
// I need to deploy an erc721 for testing!

export const linkLibraries = (
    {
        bytecode,
        linkReferences,
    }: {
        bytecode: string
        linkReferences: {
            [fileName: string]: {
                [contractName: string]: { length: number; start: number }[]
            }
        }
    },
    libraries: { [libraryName: string]: string }
): string => {
    Object.keys(linkReferences).forEach((fileName) => {
        Object.keys(linkReferences[fileName]).forEach((contractName) => {
            if (!libraries.hasOwnProperty(contractName)) {
                throw new Error(`Missing link library name ${contractName}`)
            }
            const address = ethers.utils
                .getAddress(libraries[contractName])
                .toLowerCase()
                .slice(2)
            linkReferences[fileName][contractName].forEach(
                ({ start: byteStart, length: byteLength }) => {
                    const start2 = 2 + byteStart * 2
                    const length2 = byteLength * 2
                    bytecode = bytecode
                        .slice(0, start2)
                        .concat(address)
                        .concat(bytecode.slice(start2 + length2, bytecode.length))
                }
            )
        })
    })
    return bytecode
}

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


async function uniswapSetup(actor: SignerWithAddress, provider: any) {
    const wethFactory = new ContractFactory(WETH9.abi, WETH9.bytecode, actor);
    const weth = await wethFactory.deploy();
    // console.log("WETH: ", weth.address)

    const USDTMFactory = await ethers.getContractFactory("MOCKERC20");
    const USDTM = await USDTMFactory.deploy();
    // console.log("USDTM: ", USDTM.address);

    const UniswapV3FactoryFactory = new ContractFactory(factory.abi, factory.bytecode, actor);
    const UniswapV3Factory = await UniswapV3FactoryFactory.deploy();
    // console.log("UniswapV3Factory: ", UniswapV3Factory.address);

    const swapRouterFactory = new ContractFactory(swapRouter.abi, swapRouter.bytecode, actor);
    const swapRouterContract = await swapRouterFactory.deploy(UniswapV3Factory.address, weth.address);
    // console.log("SwapRouter: ", swapRouterContract.address);

    const NFTDescriptorFactory = new ContractFactory(NFTDescriptorArtifact.abi, NFTDescriptorArtifact.bytecode, actor);
    const NFTDescriptor = await NFTDescriptorFactory.deploy();
    // console.log("NFTDescriptor: ", NFTDescriptor.address);

    // const linkedBytecode = linkLibraries({
    //     bytecode: NonfungibleTokenPositionDescriptorArtifact.bytecode,
    //     linkReferences: {
    //         "NFTDescriptor.sol": {
    //             NFTDescriptor: [{ length: 20, start: 1261 }]
    //         },
    //     }
    // },
    //     { NFTDescriptor: NFTDescriptor.address })

    // ///TODO: Invalid bytecode argument!
    // const NonfungibleTokenPositionDescriptorFactory = new ContractFactory(NonfungibleTokenPositionDescriptorArtifact.abi, linkedBytecode, actor)
    // const NonfungibleTokenPositionDescriptor = await NonfungibleTokenPositionDescriptorFactory.deploy(weth.address);
    // console.log("NonfungibleTokenPositionDescriptor: ", NonfungibleTokenPositionDescriptor.address);



    //TODO: watching this: https://www.youtube.com/watch?v=0rQo4tODpxI

    return { swapRouterContract }
}


export async function setUpBunnyWallet(): Promise<
    {
        ERC20Notes: ERC20Notes,
        ETHNotes: ETHNotes,
        NFT: MOCKERC721,
        USDTM: MOCKERC20,
        netId: number,
        owner: SignerWithAddress,
        alice: SignerWithAddress,
        bob: SignerWithAddress,
        attacker: SignerWithAddress,
        relayer: SignerWithAddress,
        bunnyWallet: BunnyWallet,
        provider: any,
        note: string,
        isOwnerVerifier: Verifier,
        swapRouterContract: Contract,
        network: any
    }> {
    const MockERC20Factory = await ethers.getContractFactory("MOCKERC20");
    const MockERC20 = await MockERC20Factory.deploy();
    const USDTM: MOCKERC20 = await MockERC20.deployed();

    const MOCKERC721Factory = await ethers.getContractFactory("MOCKERC721");
    const MockERC721 = await MOCKERC721Factory.deploy();
    const NFT = await MockERC721.deployed() as MOCKERC721;

    const [owner, alice, bob, attacker, relayer] = await ethers.getSigners();
    const provider = ethers.provider;

    const network = await provider.getNetwork();
    const netId = network.chainId

    // Now I need to set up construtor args.. Uniswap swap Router deploy!!
    const { swapRouterContract } = await uniswapSetup(owner, ethers.provider);

    const IsOwnerVerifierFactory = await ethers.getContractFactory("contracts/IsOwnerVerifier.sol:Verifier");
    const IsOwnerVerifierDeploy = await IsOwnerVerifierFactory.deploy();
    const isOwnerVerifier = await IsOwnerVerifierDeploy.deployed() as Verifier;

    const proxyAdminFactory = await ethers.getContractFactory("ProxyAdmin");
    const proxyAdmin = await proxyAdminFactory.deploy();

    const BunnyWalletFactory = await ethers.getContractFactory("BunnyWallet");
    const firstNoteWithZeroAddress = await createBunnyWalletNote({ smartContract: "0x0000000000000000000000000000000000000000", netId, });
    const bunnyWallet: BunnyWallet = await BunnyWalletFactory.deploy();
    //Initialize without a proxy for now

    // I do not know the address of the contract beforehand 
    // console.log("Original commitment: ", toNoteHex(deposit.commitment));
    const parseFirstNote = await parseOwnerNote(firstNoteWithZeroAddress);
    await bunnyWallet.initialize(isOwnerVerifier.address, swapRouterContract.address, toNoteHex(parseFirstNote.deposit.commitment), alice.address)

    const note = await createBunnyWalletNote({ smartContract: bunnyWallet.address, netId, deposit: parseFirstNote.deposit })
    const parsedNote = await parseOwnerNote(note);
    expect(toNoteHex(parsedNote.deposit.commitment)).to.equal(toNoteHex(parseFirstNote.deposit.commitment))
    expect(toNoteHex(parsedNote.deposit.preimage)).to.equal(toNoteHex(parseFirstNote.deposit.preimage));


    //Bunny Notes Verifier
    const WithdrawVerifierFactory = await ethers.getContractFactory("contracts/WithdrawVerifier.sol:Verifier");
    const WithdrawVerifierDeploy = await WithdrawVerifierFactory.deploy();
    const withdrwVerifier = await WithdrawVerifierDeploy.deployed() as Verifier;
    const ERC20NotesFactory = await ethers.getContractFactory("ERC20Notes");
    const ERC20NotesDeploy = await ERC20NotesFactory.deploy(withdrwVerifier.address, DENOMINATION, FEEDIVIDER, USDTM.address, relayer.address);
    const ERC20Notes: ERC20Notes = await ERC20NotesDeploy.deployed();

    const ETHNotesFactory = await ethers.getContractFactory("ETHNotes");
    const ETHNotesDeploy = await ETHNotesFactory.deploy(withdrwVerifier.address, DENOMINATION, FEEDIVIDER, relayer.address);
    const ETHNotes: ETHNotes = await ETHNotesDeploy.deployed();



    //const ProxyFactory = await ethers.getContractFactory("TransparentUpgradeableProxy");
    //TODO:
    // const proxy = await ProxyFactory.deploy(bunnyWallet.address, proxyAdmin.address,);

    //TODO: LATER Manually create this deploy to recreate without hre
    //TODO: Deploy TransparentUpgradeableProxy and the Proxy Admin Manually. Create .sol files for them!
    //const bunnyWalletInstance = await upgrades.deployProxy(BunnyWalletFactory, [verifier.address, swapRouterContract.address, toNoteHex(deposit.commitment), alice.address]);

    //    console.log("Bunny Wallet Proxy: ", bunnyWalletInstance.address);


    return { ERC20Notes, ETHNotes, NFT, USDTM, netId, owner, alice, bob, attacker, relayer, bunnyWallet, provider, note, isOwnerVerifier, swapRouterContract, network };
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