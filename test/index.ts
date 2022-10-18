import { expect } from "chai";
import { ethers } from "hardhat";
import { generateProof } from "../lib/generateProof";
import { deposit, parseNote, toNoteHex } from "../lib/note";
import packToSolidityProof from "../lib/packToSolidityProof";
import { setUp } from "./setup";

describe("BunnyNotes", function () {
  it("It should deploy and Alice can create a bunny note and make a deposit!", async function () {
    const { owner, alice, bob, attacker, USDTM, Verifier, ERC20Notes } = await setUp();

    // the fee to deposit is 1 dollar
    expect(await ERC20Notes.fee()).to.equal(ethers.utils.parseEther("1"));

    // // owner creates a Note and gives it to alice later
    const noteString = await deposit({ currency: "USDTM", amount: 10, netId: 1337 });
    const parsedNote = await parseNote(noteString);
    // The owner makes a deposit
    expect(parsedNote.deposit.commitment).is.not.undefined;

    // // Alice has 11 dollars

    await USDTM.mint(alice.address, ethers.utils.parseEther("11"));

    expect(await USDTM.balanceOf(alice.address)).to.equal(ethers.utils.parseEther("11"));

    // The balance of the owner is 100 USDTM
    expect(await USDTM.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("100"));

    // // The alice grants allowance to the ERC20Notes contract to transfer USDTM on his behalf

    await USDTM.connect(alice).approve(ERC20Notes.address, ethers.utils.parseEther("11"));

    // Alice must deposit for herself!
    await ERC20Notes.connect(alice).deposit(toNoteHex(parsedNote.deposit.commitment), false, alice.address);

    // now alice has 0 balance and the owner has 101 balance 

    expect(await USDTM.balanceOf(alice.address)).to.equal(ethers.utils.parseEther("0"));

    //The owner received the fee!
    expect(await USDTM.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("101"));

    // now I expect the note deposit exists, I can check with the commitment and the nullifier

    const depositedNote = await ERC20Notes.commitments(toNoteHex(parsedNote.deposit.commitment));
    // The commitment is used, yes
    expect(depositedNote.used).to.be.true;
    // the creator is the Alice
    expect(depositedNote.creator).to.equal(alice.address);
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

  });

  it("Alice can create a bunny note and a relayer makes the deposit on her behalf", async function () {
    const { owner, alice, bob, attacker, USDTM, Verifier, ERC20Notes, relayer } = await setUp();
    const noteString = await deposit({ currency: "USDTM", amount: 10, netId: 1337 });
    const parsedNote = await parseNote(noteString);

    // This time around, alice will have no dollars at all
    // The relayer will have it!

    await USDTM.mint(relayer.address, ethers.utils.parseEther("100"));
    expect(await USDTM.balanceOf(alice.address)).to.equal(ethers.utils.parseEther("0"));
    expect(await USDTM.balanceOf(relayer.address)).to.equal(ethers.utils.parseEther("100"));
    // The relayer grants allowance to the contract
    await USDTM.connect(relayer).approve(ERC20Notes.address, ethers.utils.parseEther("100"));

    // Now the Relayer after taking an off chain credit card payment, creates the deposit on behalf of alice!

    await ERC20Notes.connect(relayer).deposit(toNoteHex(parsedNote.deposit.commitment), false, alice.address);

    // now the relayer has less balance and alice has a deposited note on her name. no fee was withdrawn
    expect(await USDTM.balanceOf(relayer.address)).to.equal(ethers.utils.parseEther("90"));
    expect(await USDTM.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("100"));
    expect(await USDTM.balanceOf(alice.address)).to.equal(ethers.utils.parseEther("0"));

    const depositedNote = await ERC20Notes.commitments(toNoteHex(parsedNote.deposit.commitment));
    // The commitment is used, yes
    expect(depositedNote.used).to.be.true;
    // the creator is the ALICE
    expect(depositedNote.creator).to.equal(alice.address);
    // there is no recipeint yet
    expect(depositedNote.recipient).to.equal("0x0000000000000000000000000000000000000000");
    // This is not a cash note
    expect(depositedNote.cashNote).to.be.false;
  });

  it("It should create a gift card deposit and another address will withdraw it!", async function () {

    const { owner, alice, bob, attacker, USDTM, Verifier, ERC20Notes } = await setUp();
    const noteString = await deposit({ currency: "USDTM", amount: 10, netId: 1337 });
    const parsedNote = await parseNote(noteString);

    // // Alice has 11 dollars

    await USDTM.mint(alice.address, ethers.utils.parseEther("11"));

    await USDTM.connect(alice).approve(ERC20Notes.address, ethers.utils.parseEther("11"))

    // Deposit a gift card!
    await ERC20Notes.connect(alice).deposit(toNoteHex(parsedNote.deposit.commitment), false, alice.address);

    // Now Alice will withdraw it!

    const fee = await ERC20Notes.fee();

    //Alice generates a proof that she owns the note!
    // Fee is passed in as WEI always!
    const { proof, publicSignals } = await generateProof({ deposit: parsedNote.deposit, recipient: bob.address, change: ethers.utils.parseEther("0").toString() });

    // // Now Alice withdraws the USDTM

    expect(await USDTM.balanceOf(alice.address)).to.equal(ethers.utils.parseEther("0"));


    const solidityProof = packToSolidityProof(proof);

    // I try to withdraw the gift card as a cash note and it throws!

    let cantWithdraw = false;
    try {
      await ERC20Notes.connect(attacker).withdrawCashNote(solidityProof, toNoteHex(publicSignals[0]), toNoteHex(publicSignals[1]), attacker.address, publicSignals[3])

    } catch (err) {
      cantWithdraw = true;
    }

    expect(cantWithdraw).to.be.true;


    await ERC20Notes.connect(bob).withdrawGiftCard(solidityProof, toNoteHex(publicSignals[0]), toNoteHex(publicSignals[1]), bob.address, publicSignals[3]);

    // // NO fee was taken from the withdrawing!
    expect(await USDTM.balanceOf(bob.address)).to.equal(ethers.utils.parseEther("10"));

    expect(await ERC20Notes.isSpent(toNoteHex(parsedNote.deposit.nullifierHash))).to.be.true;

    const depositedNote = await ERC20Notes.commitments(toNoteHex(parsedNote.deposit.commitment));

    // the commitment is used , yes!
    expect(depositedNote.used).to.be.true;

    // the creator is the Alice
    expect(depositedNote.creator).to.be.equal(alice.address);

    // // the recipient is Bob
    expect(depositedNote.recipient).to.equal(bob.address);

    // this was not a cash note

    expect(depositedNote.cashNote).to.be.false


    // Try to withdraw it again

    let erroOccured = false;

    try {
      await ERC20Notes.connect(bob).withdrawGiftCard(solidityProof, toNoteHex(publicSignals[0]), toNoteHex(publicSignals[1]), bob.address, publicSignals[3]);
    } catch (err) {
      erroOccured = true;
    }
    // The giftcard has already been spent!
    expect(erroOccured).to.be.true;

    erroOccured = false;
  })


  it("Alice Should create a cash note and then Bob requests payment", async function () {
    const { owner, alice, bob, attacker, USDTM, Verifier, ERC20Notes } = await setUp();

    // Alice createa a Note 

    const noteString = await deposit({ currency: "USDTM", amount: 10, netId: 1337 });
    const parsedNote = await parseNote(noteString);
    // The owner makes a deposit
    expect(parsedNote.deposit.commitment).is.not.undefined;

    expect(await ERC20Notes.isSpent(toNoteHex(parsedNote.deposit.nullifierHash))).to.be.false;

    // Alice mints some USDTM so she has balance

    await USDTM.connect(alice).mint(alice.address, ethers.utils.parseEther("100"));

    expect(await USDTM.balanceOf(alice.address)).to.equal(ethers.utils.parseEther("100"));

    await USDTM.connect(alice).approve(ERC20Notes.address, ethers.utils.parseEther("11"));

    // Now Alice deposits to create a Cash Note

    await ERC20Notes.connect(alice).deposit(toNoteHex(parsedNote.deposit.commitment), true, alice.address);

    expect(await USDTM.balanceOf(alice.address)).to.equal(ethers.utils.parseEther("89"));

    // // I expect that there is not a note saved
    const depositedNote = await ERC20Notes.commitments(toNoteHex(parsedNote.deposit.commitment));

    expect(depositedNote.used).to.be.true;

    expect(depositedNote.creator).to.equal(alice.address);

    expect(depositedNote.recipient).to.equal("0x0000000000000000000000000000000000000000");

    expect(depositedNote.cashNote).to.be.true;

    //Bob is now requesting payment. This will be actually a front end feature...

    const price = ethers.utils.parseEther("9");

    // Alice decides what note she will pay with and what is the change. Since we have 10 dollar notes, the change is 1.

    const change = ethers.utils.parseEther("1"); // This means BOB is requesting 9 dollars, the change is 1

    const { proof, publicSignals } = await generateProof({ deposit: parsedNote.deposit, recipient: bob.address, change: change.toString() });

    // // Now alice can give the proof and public signals to BOB or she can do the withdrawing herself

    const solidityProof = packToSolidityProof(proof);


    //The attacker will try to withraw a balance to his address with the stolen proof

    let attackerFails = false;

    try {
      await ERC20Notes.connect(attacker).withdrawCashNote(solidityProof, toNoteHex(publicSignals[0]), toNoteHex(publicSignals[1]), attacker.address, publicSignals[3])
    } catch (err) {
      attackerFails = true;
    }

    expect(attackerFails).to.be.true;


    await ERC20Notes.connect(bob).withdrawCashNote(solidityProof, toNoteHex(publicSignals[0]), toNoteHex(publicSignals[1]), bob.address, publicSignals[3])

    // And bob withdrew the note

    expect(await USDTM.balanceOf(bob.address)).to.equal(price);

    // Expect Alice to have recieved the change back!
    expect(await USDTM.balanceOf(alice.address)).to.equal(ethers.utils.parseEther("90"));


    // Now  try to cash out the note again
    let errorOccured;
    try {
      await ERC20Notes.connect(bob).withdrawCashNote(solidityProof, toNoteHex(publicSignals[0]), toNoteHex(publicSignals[1]), bob.address, publicSignals[3])

    } catch (err) {
      errorOccured = true;
    }

    expect(errorOccured).to.be.true;

    expect(await ERC20Notes.isSpent(toNoteHex(parsedNote.deposit.nullifierHash))).to.be.true;

    expect(await ERC20Notes.isSpentArray([toNoteHex(parsedNote.deposit.nullifierHash)])).to.contain(true)
  })


  it("Testing some error conditions that can happen with the price!", async function () {
    const { owner, alice, bob, attacker, USDTM, Verifier, ERC20Notes } = await setUp();

    // Alice createa a Note 

    const noteString = await deposit({ currency: "USDTM", amount: 10, netId: 1337 });
    const parsedNote = await parseNote(noteString);
    // The owner makes a deposit
    expect(parsedNote.deposit.commitment).is.not.undefined;

    // Alice mints some USDTM so she has balance

    await USDTM.connect(alice).mint(alice.address, ethers.utils.parseEther("100"));

    expect(await USDTM.balanceOf(alice.address)).to.equal(ethers.utils.parseEther("100"));

    await USDTM.connect(alice).approve(ERC20Notes.address, ethers.utils.parseEther("11"));

    // Now Alice deposits to create a Cash Note

    await ERC20Notes.connect(alice).deposit(toNoteHex(parsedNote.deposit.commitment), true, alice.address);

    // // I expect that there is a note saved
    await ERC20Notes.commitments(toNoteHex(parsedNote.deposit.commitment));

    // Alice decides what note she will pay with and what is the change. Since we have 10 dollar notes, the change is 1.

    const change = ethers.utils.parseEther("100000"); // The change is extremely high

    //   // Create a proof with too high fee
    let { proof, publicSignals } = await generateProof({ deposit: parsedNote.deposit, recipient: bob.address, change: change.toString() });

    // Now alice can give the proof and public signals to BOB or she can do the withdrawing herself

    let solidityProof = packToSolidityProof(proof);

    let failed = false;
    try {
      await ERC20Notes.connect(bob).withdrawCashNote(solidityProof, toNoteHex(publicSignals[0]), toNoteHex(publicSignals[1]), bob.address, publicSignals[3])
    } catch (err) {
      failed = true;
    }

    // Failed cuz the fee was too high!

    expect(failed).to.be.true;

    // now lets test zero price payments
    const change2 = ethers.utils.parseEther("10") // I ask for all the value back as change!

    let { proof: proof2, publicSignals: pubSig2 } = await generateProof({ deposit: parsedNote.deposit, recipient: bob.address, change: change2.toString() })

    let solidityProof2 = packToSolidityProof(proof2);

    failed = false;
    try {
      await ERC20Notes.connect(bob).withdrawCashNote(solidityProof2, toNoteHex(pubSig2[0]), toNoteHex(pubSig2[1]), bob.address, pubSig2[3])
    } catch (err) {
      failed = true;
    }

    expect(failed).to.be.true

  })


});
