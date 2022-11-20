import { expect } from "chai";
import { BigNumber, providers } from "ethers";
import { ethers } from "hardhat";
import { generateNoteWithdrawProof } from "../lib/generateProof";
import { deposit, parseNote, toNoteHex } from "../lib/BunnyNote";
import packToSolidityProof from "../lib/packToSolidityProof";
import { ERC20Notes } from "../typechain";
import { setUp } from "./setup";

const getBalance = async (provider: any, addr: string) => {
    const bal = await provider.getBalance(addr)
    return ethers.utils.formatEther(bal)
};

const getBalanceNoFMT = async (provider: any, addr: string) => await provider.getBalance(addr);

describe("Bunny Notes with ETH notes", function () {
    it("It should deploy and Alice can create a bunny note and make a deposit", async function () {
        const { owner, alice, bob, attacker, Verifier, ETHNotes, provider } = await setUp();
        // the fee to deposit is 1.
        expect(await ETHNotes.fee()).to.equal(ethers.utils.parseEther("1"));

        // Onwer createasa  Noe and five it to alice later
        const noteString = await deposit({ currency: "ETH", amount: 10, netId: 1337 });
        const parsedNote = await parseNote(noteString);
        // The owner makes a deposit
        expect(parsedNote.deposit.commitment).is.not.undefined;

        const aliceBalance = await getBalance(provider, alice.address);
        const bobBalance = await getBalance(provider, bob.address);


        const fee: BigNumber = await ETHNotes.fee();
        const denomination: BigNumber = await ETHNotes.denomination();

        const value = fee.add(denomination);
        expect(ethers.utils.formatEther(value)).to.equal("11.0")

        // Alice will deposit for herself
        const depositTx = await ETHNotes.connect(alice).deposit(toNoteHex(parsedNote.deposit.commitment), false, alice.address, { value: fee.add(denomination) });
        // Let's check the gas fees to make sure Alice spends the correct amount!
        const gasFeeForTx = depositTx.gasLimit.mul(depositTx.gasPrice as BigNumber);
        const alicePrevBalance = ethers.utils.parseEther(aliceBalance);
        const totalFee = value.add(gasFeeForTx);
        const newBalance = ethers.utils.formatEther(alicePrevBalance.sub(totalFee));

        expect(parseInt(await getBalance(provider, alice.address))).to.equal(parseInt(newBalance));

        const depositedNote = await ETHNotes.commitments(toNoteHex(parsedNote.deposit.commitment));
        // The commitment is used
        expect(depositedNote.used).to.be.true;
        // the creator is alice
        expect(depositedNote.creator).to.equal(alice.address);
        // there is no recipient yet
        expect(depositedNote.recipient).to.equal("0x0000000000000000000000000000000000000000");
        // this is not a cash note
        expect(depositedNote.cashNote).to.be.false;

        // test double deposit with the same commitment
        let threwError = false;
        try {
            await ETHNotes.deposit(toNoteHex(parsedNote.deposit.commitment), false, alice.address);
        } catch (err) {
            threwError = true;
        }

        expect(threwError).to.be.true;
    })

    it("Alice can create a bunny note and a relayer makes the deposit on her behalf", async function () {
        const { owner, alice, bob, attacker, USDTM, Verifier, ETHNotes, relayer, provider } = await setUp();
        const noteString = await deposit({ currency: "ETH", amount: 10, netId: 1337 });
        const parsedNote = await parseNote(noteString);

        // This time around, alice will spend no ETH at all on GAS
        // The relayer will do it for her!
        const aliceBalance = await getBalance(provider, alice.address);
        const relayerBalance = await getBalance(provider, relayer.address);

        const denomination: BigNumber = await ETHNotes.denomination();
        expect(ethers.utils.formatEther(denomination)).to.equal("10.0");

        // Relayer will deposit for alice for off-chain payment!

        const depositTx = await ETHNotes.connect(relayer).deposit(toNoteHex(parsedNote.deposit.commitment), false, alice.address, { value: denomination });

        // so Alice balance didn't change but there is a deposit on her behalf

        const depositedNote = await ETHNotes.commitments(toNoteHex(parsedNote.deposit.commitment));

        // The commitment is used
        expect(depositedNote.used).to.be.true;
        // the creator is alice
        expect(depositedNote.creator).to.equal(alice.address);
        // there is no recipient yet
        expect(depositedNote.recipient).to.equal("0x0000000000000000000000000000000000000000");
        // this is not a cash note
        expect(depositedNote.cashNote).to.be.false;

    });

    it("alice should createa gift card deposit and another address will withdraw it!", async function () {
        const { owner, alice, bob, attacker, USDTM, Verifier, ETHNotes, provider } = await setUp();
        const noteString = await deposit({ currency: "ETH", amount: 10, netId: 1337 });
        const parsedNote = await parseNote(noteString);


        const fee: BigNumber = await ETHNotes.fee();
        const denomination: BigNumber = await ETHNotes.denomination();

        const value = fee.add(denomination);

        // Alice will deposit to create a gift card
        await ETHNotes.connect(alice).deposit(toNoteHex(parsedNote.deposit.commitment), false, alice.address, { value });

        // Now Bob will withdraw it!
        const { proof, publicSignals } = await generateNoteWithdrawProof({ deposit: parsedNote.deposit, recipient: bob.address, change: ethers.utils.parseEther("0").toString() })

        // Bob withdraws the ETH
        const solidityProof = packToSolidityProof(proof);

        await ETHNotes.connect(bob).withdrawGiftCard(solidityProof, toNoteHex(publicSignals[0]), toNoteHex(publicSignals[1]), bob.address, publicSignals[3]);

        expect(await ETHNotes.isSpent(toNoteHex(parsedNote.deposit.nullifierHash))).to.be.true;

        const depositedNote = await ETHNotes.commitments(toNoteHex(parsedNote.deposit.commitment));

        // the commitment is used, yes!
        expect(depositedNote.used).to.be.true;

        // the creator is Alice
        expect(depositedNote.creator).to.be.equal(alice.address);

        // the recipient is Bob
        expect(depositedNote.recipient).to.equal(bob.address);

        // this was not a cash note
        expect(depositedNote.cashNote).to.be.false;

        console.log(await getBalance(provider, alice.address));

        console.log(await getBalance(provider, bob.address));

    })

    it("Alice should create a a cash note and then bob requests payment", async function () {
        const { owner, alice, bob, relayer, attacker, Verifier, ETHNotes, provider } = await setUp();

        // Alice creates the note
        const noteString = await deposit({ currency: "ETH", amount: 10, netId: 1337 });
        const parsedNote = await parseNote(noteString);

        // Alice makes the deposit
        const fee: BigNumber = await ETHNotes.fee();
        const denomination: BigNumber = await ETHNotes.denomination();

        const value = fee.add(denomination);
        await ETHNotes.connect(alice).deposit(toNoteHex(parsedNote.deposit.commitment), true, alice.address, { value });

        // I expect that there is not a note saved
        const depositedNote = await ETHNotes.commitments(toNoteHex(parsedNote.deposit.commitment));

        expect(depositedNote.used).to.be.true;

        expect(depositedNote.creator).to.equal(alice.address);

        expect(depositedNote.recipient).to.equal("0x0000000000000000000000000000000000000000");

        expect(depositedNote.cashNote).to.be.true;

        // Bob is now requresting payment This will be actually a front end feature

        const price = ethers.utils.parseEther("9");

        // alice decides what note she will pay with and what is the change

        const change = ethers.utils.parseEther("1"); // This means bob is getting 9 eth, the change is 1

        const { proof, publicSignals } = await generateNoteWithdrawProof({ deposit: parsedNote.deposit, recipient: bob.address, change: change.toString() });

        //Now alice can give the proof and public signals to BOB or the relayer or she can do the withdrawing herself

        const solidityProof = packToSolidityProof(proof);

        // and bob the relayer withdraws the note for bob

        const bobBalanceBefore = await getBalanceNoFMT(provider, bob.address);
        const aliceBalanceBefore = await getBalanceNoFMT(provider, alice.address);
        await ETHNotes.connect(relayer).withdrawCashNote(solidityProof, toNoteHex(publicSignals[0]), toNoteHex(publicSignals[1]), bob.address, publicSignals[3]);

        // and Bob withdrew the note
        const bobBalanceAfter = await getBalanceNoFMT(provider, bob.address);
        const aliceBalanceAfter = await getBalanceNoFMT(provider, alice.address);

        // I expect bob got 9 ETH and alice got 1

        expect(bobBalanceBefore.add(price)).to.equal(bobBalanceAfter);
        expect(aliceBalanceBefore.add(change)).to.equal(aliceBalanceAfter);

    })

});