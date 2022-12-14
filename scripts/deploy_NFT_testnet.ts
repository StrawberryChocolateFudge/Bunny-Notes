import { BigNumber } from "ethers";
import { ethers } from "hardhat";

const DEPLOYEDNFT = "0xaAFD9728671E717Bc65Ee326229D0f4225565D39";

const BUNNYWALLET = "0x9Fe4E43ED13ae2f0D49a4C53907D12201106fbDa"

const d = { gasLimit: 100000 }

async function main() {
    // await deploy();
    // await mint();
    await safeTransferFrom();
}

async function deploy() {
    const NFTFactory = await ethers.getContractFactory("MOCKERC721");
    const NFT = await NFTFactory.deploy();

    console.log("NFT address", NFT.address);

}

async function mint() {
    const factory = await ethers.getContractFactory("MOCKERC721");
    const nftContract = await factory.attach(DEPLOYEDNFT);
    const res1 = await nftContract.mintUniqueTokenTo("0x71A713135d57911631Bb54259026Eaa030F7B881", BigNumber.from(0), { ...d });
    await res1.wait()
        .then(async () => {
            const res2 = await nftContract.mintUniqueTokenTo("0x71A713135d57911631Bb54259026Eaa030F7B881", BigNumber.from(1), { ...d });
            await res2.wait().then(async () => {
                const res3 = await nftContract.mintUniqueTokenTo("0x71A713135d57911631Bb54259026Eaa030F7B881", BigNumber.from(2), { ...d });
                await res3.wait().then(async () => {
                    const res4 = await nftContract.mintUniqueTokenTo("0x71A713135d57911631Bb54259026Eaa030F7B881", BigNumber.from(3), { ...d });
                    await res4.wait();
                })
            })
        })


}

async function safeTransferFrom() {
    const factory = await ethers.getContractFactory("MOCKERC721");
    const nftContract = await factory.attach(DEPLOYEDNFT);

    const res1 = await nftContract["safeTransferFrom(address,address,uint256)"]("0x71A713135d57911631Bb54259026Eaa030F7B881", BUNNYWALLET, BigNumber.from(0), { ...d });
    await res1.wait()

    // .then(async () => {
    //     const res2 = await nftContract["safeTransferFrom(address,address,uint256)"]("0x71A713135d57911631Bb54259026Eaa030F7B881", BUNNYWALLET, BigNumber.from(1), { ...d });
    //     await res2.wait().then(async () => {
    //         const res3 = await nftContract["safeTransferFrom(address,address,uint256)"]("0x71A713135d57911631Bb54259026Eaa030F7B881", BUNNYWALLET, BigNumber.from(2), { ...d });
    //         await res3.wait().then(async () => {
    //             const res4 = await nftContract["safeTransferFrom(address,address,uint256)"]("0x71A713135d57911631Bb54259026Eaa030F7B881", BUNNYWALLET, BigNumber.from(3), { ...d });
    //             await res4.wait();
    //         })
    //     })
    // })

}



// main().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// })