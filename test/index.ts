import { expect } from "chai";
import { ethers } from "hardhat";
import { generateProof } from "../lib/generateProof";
import { deposit, parseNote, toNoteHex } from "../lib/note";
import packToSolidityProof from "../lib/packToSolidityProof";
import { setUp } from "./setup";

describe("BunnyNotes", function () {
  it("It should deploy and I can create a bunny note and test deposit!", async function () {
    const { owner, alice, bob, attacker, USDTM, Verifier, ERC20Notes } = await setUp();

    // owner creates a Note and gives it to alice later
    const noteString = await deposit({ currency: "USDTM", amount: 10, netId: 1337 });
    const parsedNote = await parseNote(noteString);
    // The owner makes a deposit
    expect(parsedNote.deposit.commitment).is.not.undefined;

    // The owner grants allowance to the ERC20Notes contract to transfer USDTM on his behalf

    await USDTM.approve(ERC20Notes.address, ethers.utils.parseEther("10"));

    // The owner has 100 dollars
    expect(await USDTM.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("100"))

    await ERC20Notes.deposit(toNoteHex(parsedNote.deposit.commitment), false);

    // now I expect the note deposit exists, I can check with the commitment and the nullifier

    const depositedNote = await ERC20Notes.commitments(toNoteHex(parsedNote.deposit.commitment));
    // The commitment is used, yes
    expect(depositedNote.used).to.be.true;
    // the creator is the owner
    expect(depositedNote.creator).to.equal(owner.address);
    // there is no recipeint yet
    expect(depositedNote.recipient).to.equal("0x0000000000000000000000000000000000000000");
    // This is not a cash note
    expect(depositedNote.cashNote).to.be.false;


    // test double deposit with teh same commitment!
    let threwError = false;
    try {
      await ERC20Notes.deposit(toNoteHex(parsedNote.deposit.commitment), false);
    } catch (err) {
      threwError = true;
    }

    expect(threwError).to.be.true;

    // The balance of the owner is 90 dollars now

    expect(await USDTM.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("90"))

  });

  it("It should create a gift card deposit and another address  will withdraw it!", async function () {

    const { owner, alice, bob, attaker, USDTM, Verifier, ERC20Notes } = await setUp();
    const noteString = await deposit({ currency: "USDTM", amount: 10, netId: 1337 });
    const parsedNote = await parseNote(noteString);

    await USDTM.approve(ERC20Notes.address, ethers.utils.parseEther("10"))

    // Deposit a gift card!
    await ERC20Notes.deposit(toNoteHex(parsedNote.deposit.commitment), false);

    // Now Alice will withdraw it!

    const fee = await ERC20Notes.fee();

    //Alice generates a proof that she owns the note!
    // Fee is passed in as WEI always!
    const { proof, publicSignals } = await generateProof({ deposit: parsedNote.deposit, recipient: alice.address, fee: fee.toString(), change: ethers.utils.parseEther("0").toString() });

    // Now Alice withdraws the USDTM

    expect(await USDTM.balanceOf(alice.address)).to.equal(ethers.utils.parseEther("0"));


    const solidityProof = packToSolidityProof(proof);
    await ERC20Notes.connect(alice).withdrawGiftCard(solidityProof, toNoteHex(publicSignals[0]), toNoteHex(publicSignals[1]), alice.address, fee);

    // 1% fee was taken from the withdrawing!
    expect(await USDTM.balanceOf(alice.address)).to.equal(ethers.utils.parseEther("9.9"));

    // The owner is the deployer, he received the fee!
    expect(await USDTM.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("90.1"));

    expect(await ERC20Notes.isSpent(toNoteHex(parsedNote.deposit.nullifierHash))).to.be.true;

    const depositedNote = await ERC20Notes.commitments(toNoteHex(parsedNote.deposit.commitment));

    // the commitment is used , yes!
    expect(depositedNote.used).to.be.true;

    // the creator is the owner
    expect(depositedNote.creator).to.be.equal(owner.address);

    // the recipient is Alice
    expect(depositedNote.recipient).to.equal(alice.address);

    // this was not a cash note

    expect(depositedNote.cashNote).to.be.false


    // Try to withdraw it again

    let erroOccured = false;

    try {
      await ERC20Notes.connect(alice).withdrawGiftCard(solidityProof, toNoteHex(publicSignals[0]), toNoteHex(publicSignals[1]), alice.address, fee);
    } catch (err) {
      erroOccured = true;
    }
    // The giftcard has already been spent!
    expect(erroOccured).to.be.true;

    erroOccured = false;

    try {

      await ERC20Notes.connect(alice).withdrawGiftCard(solidityProof, toNoteHex(publicSignals[0]), toNoteHex(publicSignals[1]), alice.address, ethers.utils.parseEther("10000000"));
    } catch (
    err
    ) {
      // Invalid Fee error

      erroOccured = true;
    }
    expect(erroOccured).to.be.true;

  })
});
