import { expect } from "chai";
import { setUpBunnyNotes } from "./setup";

import { ethers } from "hardhat";

describe("Crowdsale", async function () {
    it("tokensale", async function () {
        const { owner, alice, bob, attacker, USDTM, Verifier, bunnyNotes, relayer, provider, tokensale } = await setUpBunnyNotes();

        // The sold eth will be sent to alice

        // so first alice needs to approve spending the tokens
        await USDTM.mint(relayer.address, ethers.utils.parseEther("100000000"));
        await USDTM.connect(relayer).approve(tokensale.address, ethers.utils.parseEther("50000000"));

        let relayerTokenBalance = await USDTM.balanceOf(relayer.address);

        expect(relayerTokenBalance).to.equal(ethers.utils.parseEther("100000000"));


        const tokenAddress = await tokensale.token();
        expect(tokenAddress).to.equal(USDTM.address);

        let tokensSold = await tokensale.getTokensSold();
        expect(tokensSold).to.equal(ethers.utils.parseEther("0"));

        let bobBalance = await USDTM.balanceOf(bob.address);
        expect(bobBalance).to.equal(ethers.utils.parseEther("0"));

        let relayerEthBalance = await relayer.getBalance();

        const buyResTx = await tokensale.connect(bob).buyTokens({ value: ethers.utils.parseEther("1") });

        await buyResTx.wait().then((receipt) => {
            let events = receipt.events as any;
            let thirdEvent = events[2];
            expect(thirdEvent.event).to.equal("TokensPurchased")
        })

        bobBalance = await USDTM.balanceOf(bob.address);

        expect(bobBalance).to.equal(ethers.utils.parseEther("10000"));
        relayerTokenBalance = await USDTM.balanceOf(relayer.address);

        const relayerEthBalanceAgain = await relayer.getBalance();
        expect(relayerEthBalance.add(ethers.utils.parseEther("1"))).to.equal(relayerEthBalanceAgain)

        tokensSold = await tokensale.getTokensSold();

        expect(tokensSold).to.equal(ethers.utils.parseEther("10000"));

        let tokensLeft = await tokensale.getTokensLeft();

        expect(tokensLeft).to.equal(ethers.utils.parseEther("49990000"))

        // Now I buy all the tokens
        // 50 000 000 - 10 000

        //I try to buy more than available,
        let errorOccured = false;
        let errorMessage = "";
        try {
            await tokensale.buyTokens({ value: ethers.utils.parseEther("6000") });

        } catch (err: any) {
            errorOccured = true;
            errorMessage = err.message;
        }

        expect(errorOccured).to.be.true;
        expect(errorMessage.includes("Exceeds allowed limit")).to.be.true;

        await tokensale.connect(bob).buyTokens({ value: ethers.utils.parseEther("4999") });

        tokensSold = await tokensale.getTokensSold();
        expect(tokensSold).to.equal(ethers.utils.parseEther("50000000"))
        tokensLeft = await tokensale.getTokensLeft();
        errorOccured = false;

        try {
            await tokensale.buyTokens({ value: ethers.utils.parseEther("1") });
        } catch (err: any) {
            errorOccured = true;
            errorMessage = err.message;
        }

        expect(errorOccured).to.be.true;
        expect(errorMessage.includes("Exceeds allowed limit")).to.be.true;

    })
})