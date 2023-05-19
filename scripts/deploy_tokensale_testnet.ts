import { ethers } from "hardhat";


async function deployTokensale_BSCTESTNET() {
    const tokenOwnerWallet = "0x71A713135d57911631Bb54259026Eaa030F7B881";
    const tokenAddress = "0xeDc320436A3d390B65Dfc0dc868909c914F431cA" // BSC address
    const ZKBFactory = await ethers.getContractFactory("ZKBToken");
    const approveAmount = ethers.utils.parseEther("50000000");

    const TokenSaleFactory = await ethers.getContractFactory("TokenSale");
    const tokenSaleDeploy = await TokenSaleFactory.deploy(tokenOwnerWallet, tokenAddress);
    await tokenSaleDeploy.deployed().then(async (tokensale) => {
        console.log("TokenSale is deployed to :", tokensale.address);

        const zkb = await ZKBFactory.attach(tokenAddress);
        const tx = await zkb.approve(tokensale.address, approveAmount);
        await tx.wait().then((receipt) => {
            console.log("Approved token spending!")
        })
    });
    // TokenSale is deployed to : 0x6d54302F99BEe568a903AcA3A58B51c91809bB78

}


async function main() {
    await deployTokensale_BSCTESTNET();
}


main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
})