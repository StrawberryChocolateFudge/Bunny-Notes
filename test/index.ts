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

  it("It should create a gift card deposit and another address will withdraw it!", async function () {

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

    // I try to withdraw the gift card as a cash note

    let cantWithdraw = false;
    try {
      await ERC20Notes.connect(bob).withdrawCashNote(solidityProof, toNoteHex(publicSignals[0]), toNoteHex(publicSignals[1]), bob.address, publicSignals[3], publicSignals[4])

    } catch (err) {
      cantWithdraw = true;
    }

    expect(cantWithdraw).to.be.true;


    await ERC20Notes.connect(alice).withdrawGiftCard(solidityProof, toNoteHex(publicSignals[0]), toNoteHex(publicSignals[1]), alice.address, publicSignals[3], publicSignals[4]);

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
      await ERC20Notes.connect(alice).withdrawGiftCard(solidityProof, toNoteHex(publicSignals[0]), toNoteHex(publicSignals[1]), toNoteHex(publicSignals[2]), publicSignals[3], publicSignals[4]);
    } catch (err) {
      erroOccured = true;
    }
    // The giftcard has already been spent!
    expect(erroOccured).to.be.true;

    erroOccured = false;

    try {

      await ERC20Notes.connect(alice).withdrawGiftCard(solidityProof, toNoteHex(publicSignals[0]), toNoteHex(publicSignals[1]), toNoteHex(publicSignals[2]), publicSignals[3], publicSignals[4]);
    } catch (
    err
    ) {
      // Invalid Fee error

      erroOccured = true;
    }
    expect(erroOccured).to.be.true;

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

    await USDTM.connect(alice).approve(ERC20Notes.address, ethers.utils.parseEther("10"));

    // Now Alice deposits to create a Cash Note

    await ERC20Notes.connect(alice).deposit(toNoteHex(parsedNote.deposit.commitment), true);

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

    // So now alice creates the ZKP after fetching the contract Fee (1%)

    const fee = await ERC20Notes.fee();

    const { proof, publicSignals } = await generateProof({ deposit: parsedNote.deposit, recipient: bob.address, fee: fee.toString(), change: change.toString() });

    // Now alice can give the proof and public signals to BOB or she can do the withdrawing herself

    const solidityProof = packToSolidityProof(proof);


    //The attacker will try to withraw a balance to his address with the stolen proof

    let attackerFails = false;

    try {
      await ERC20Notes.connect(attacker).withdrawCashNote(solidityProof, toNoteHex(publicSignals[0]), toNoteHex(publicSignals[1]), attacker.address, publicSignals[3], publicSignals[4])
    } catch (err) {
      attackerFails = true;
    }

    expect(attackerFails).to.be.true;


    await ERC20Notes.connect(bob).withdrawCashNote(solidityProof, toNoteHex(publicSignals[0]), toNoteHex(publicSignals[1]), bob.address, publicSignals[3], publicSignals[4])

    // And bob withdrew the note, with the fee substracted he received the price!

    expect(await USDTM.balanceOf(bob.address)).to.equal(price.sub(ethers.utils.parseEther("0.1")));
    // Expect the owner to have collected the fee!
    expect(await USDTM.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("100.1"));

    // Expect Alice to have recieved the change back!
    expect(await USDTM.balanceOf(alice.address)).to.equal(ethers.utils.parseEther("91"));


    // Now  try to cash out the note again
    let errorOccured;
    try {
      await ERC20Notes.connect(bob).withdrawCashNote(solidityProof, toNoteHex(publicSignals[0]), toNoteHex(publicSignals[1]), bob.address, publicSignals[3], publicSignals[4])

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

    await USDTM.connect(alice).approve(ERC20Notes.address, ethers.utils.parseEther("10"));

    // Now Alice deposits to create a Cash Note

    await ERC20Notes.connect(alice).deposit(toNoteHex(parsedNote.deposit.commitment), true);

    // // I expect that there is not a note saved
    await ERC20Notes.commitments(toNoteHex(parsedNote.deposit.commitment));

    // Alice decides what note she will pay with and what is the change. Since we have 10 dollar notes, the change is 1.

    const change = ethers.utils.parseEther("1"); // This means BOB is requesting 9 dollars, the change is 1

    // So now alice creates the ZKP after fetching the contract Fee (1%)

    const fee = await ERC20Notes.fee();

    // Create a proof with too high fee
    let { proof, publicSignals } = await generateProof({ deposit: parsedNote.deposit, recipient: bob.address, fee: ethers.utils.parseEther("100").toString(), change: change.toString() });

    // Now alice can give the proof and public signals to BOB or she can do the withdrawing herself

    let solidityProof = packToSolidityProof(proof);

    let failed = false;
    try {
      await ERC20Notes.connect(bob).withdrawCashNote(solidityProof, toNoteHex(publicSignals[0]), toNoteHex(publicSignals[1]), bob.address, publicSignals[3], publicSignals[4])
    } catch (err) {
      failed = true;
    }

    // Failed cuz the fee was too high!

    expect(failed).to.be.true;

    let { proof: proof2, publicSignals: publicSignals2 } = await generateProof({ deposit: parsedNote.deposit, recipient: bob.address, fee: fee.toString(), change: ethers.utils.parseEther("100").toString() });

    solidityProof = packToSolidityProof(proof2);

    failed = false;

    try {
      await ERC20Notes.connect(bob).withdrawCashNote(solidityProof, toNoteHex(publicSignals2[0]), toNoteHex(publicSignals2[1]), bob.address, publicSignals2[3], publicSignals2[4])
    } catch (err) {
      failed = true;
    }

    expect(failed).to.be.true

  })
});
