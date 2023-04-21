import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { deposit, parseNote, toNoteHex } from "../lib/BunnyNote";
import { generateNoteWithdrawProof } from "../lib/generateProof";
import { setUpBunnyNotes } from "./setup";
import packToSolidityProof from "../lib/packToSolidityProof";

const parseEther = (val: string) => ethers.utils.parseEther(val);
const formatEther = (val: BigNumber) => ethers.utils.formatEther(val);


describe("Bunny Notes", async function () {
    it("Should deploy a bunny notes and create an ETH note", async function () {
        const { owner, alice, bob, attacker, USDTM, Verifier, bunnyNotes, relayer, provider } = await setUpBunnyNotes();

        const ownerAddress = await bunnyNotes._owner();
        expect(ownerAddress).to.equal(owner.address);

        const denomination = parseEther("100");
        const fee = await bunnyNotes.calculateFee(denomination);
        // fee should be 1% of the denomination
        expect(fee).to.equal(parseEther("1"));

        const feeWithDenomination = denomination.add(fee);


        const noteString1 = await deposit({ currency: "ETH", amount: '100', netId: 1337 });
        const parsedNote = await parseNote(noteString1);
        expect(parsedNote.deposit.commitment).is.not.undefined;
        // Now I can deposit eth to create a note
        // I can check for invalid denomination error!
        let errorOccured = false;
        let errorMessage = "";
        try {
            const depositTx = await bunnyNotes.connect(alice).depositEth(
                toNoteHex(parsedNote.deposit.commitment),
                denomination,
                { value: denomination }
            )
        } catch (err: any) {
            errorOccured = true;
            errorMessage = err.message;
        }
        expect(errorOccured).to.be.true;
        expect(errorMessage.includes("Invalid Value")).to.be.true;

        errorOccured = false;
        try {
            const depositTx = await bunnyNotes.connect(alice).depositEth(
                toNoteHex(parsedNote.deposit.commitment),
                parseEther("0"),
                { value: parseEther("0") }
            )
        } catch (err: any) {
            errorOccured = true;
            errorMessage = err.message;
        }
        expect(errorOccured).to.be.true;
        expect(errorMessage.includes("Invalid denomination")).to.be.true;
        const ownerBalance = await owner.getBalance();
        // Now I create the eth and will see the balance of the owner that it recieves the fee
        const depositTx = await bunnyNotes.connect(alice).depositEth(
            toNoteHex(parsedNote.deposit.commitment),
            denomination,
            { value: feeWithDenomination }
        );
        await depositTx.wait().then((receipt) => {
            const events = receipt.events as any;
            expect(events[0].event).to.equal("DepositETH");
        })



        // And query for the commitment to make sure it exists
        const cs = await bunnyNotes.commitments(toNoteHex(parsedNote.deposit.commitment));
        expect(cs.used).to.be.true;
        expect(cs.creator).to.equal(alice.address);
        expect(cs.usesToken).to.be.false;
        expect(cs.denomination).to.equal(denomination);
        const newOwnerBalance = await owner.getBalance();
        expect(newOwnerBalance).to.equal(ownerBalance.add(fee));

        // Try to create another note with the same commitment

        errorOccured = false;
        try {
            const depositTx = await bunnyNotes.connect(alice).depositEth(
                toNoteHex(parsedNote.deposit.commitment),
                denomination,
                { value: feeWithDenomination }
            );
        } catch (err: any) {
            errorOccured = true;
            errorMessage = err.message;
        }
        expect(errorMessage.includes("Used commitment")).to.be.true;
    })

    it("Should create a ERC-20 Note", async function () {
        const { owner, alice, bob, attacker, USDTM, Verifier, bunnyNotes, relayer, provider } = await setUpBunnyNotes();

        const ownerAddress = await bunnyNotes._owner();
        expect(ownerAddress).to.equal(owner.address);

        const denomination = parseEther("100");
        const fee = await bunnyNotes.calculateFee(denomination);
        // fee should be 1% of the denomination
        expect(fee).to.equal(parseEther("1"));

        const feeWithDenomination = denomination.add(fee);

        const noteString1 = await deposit({ currency: "USDTM", amount: '100', netId: 1337 });
        const parsedNote = await parseNote(noteString1);
        let errorOccured = false;
        let errorMessage = "";
        try {
            const depositTx = await bunnyNotes.connect(alice).depositToken(
                toNoteHex(parsedNote.deposit.commitment),
                parseEther("0"),
                USDTM.address
            );
        } catch (err: any) {
            errorOccured = true;
            errorMessage = err.message;
        }
        expect(errorOccured).to.be.true;
        expect(errorMessage.includes("Invalid denomination")).to.be.true;

        errorOccured = false;
        try {
            const depositTx = await bunnyNotes.connect(alice).depositToken(
                toNoteHex(parsedNote.deposit.commitment),
                parseEther("100"),
                USDTM.address
            );
        } catch (err: any) {
            errorOccured = true;
            errorMessage = err.message;
        }
        expect(errorOccured).to.be.true;
        expect(errorMessage.includes("ERC20: insufficient allowance")).to.be.true;
        // I add allowance
        await USDTM.connect(alice).approve(bunnyNotes.address, feeWithDenomination);
        errorOccured = false;
        try {
            const depositTx = await bunnyNotes.connect(alice).depositToken(
                toNoteHex(parsedNote.deposit.commitment),
                parseEther("100"),
                USDTM.address
            );
        } catch (err: any) {
            errorOccured = true;
            errorMessage = err.message;
        }
        expect(errorOccured).to.be.true;
        expect(errorMessage.includes("ERC20: transfer amount exceeds balance")).to.be.true;

        // I add the balance
        await USDTM.mint(alice.address, feeWithDenomination);
        let aliceBalance = await USDTM.balanceOf(alice.address);
        expect(aliceBalance).to.equal(feeWithDenomination);
        let ownerBalance = await USDTM.balanceOf(owner.address);
        expect(ownerBalance).to.equal(parseEther("100"));

        const depositTx = await bunnyNotes.connect(alice).depositToken(
            toNoteHex(parsedNote.deposit.commitment),
            parseEther("100"),
            USDTM.address
        );

        depositTx.wait().then(receipt => {
            const events = receipt.events as any;
            expect(events[0].event).to.equal("DepositToken");
        })

        //checking the balances again
        aliceBalance = await USDTM.balanceOf(alice.address);
        ownerBalance = await USDTM.balanceOf(owner.address);
        expect(aliceBalance).to.equal(parseEther("0"));
        expect(ownerBalance).to.equal(parseEther("101"));

        //Checking the commitment
        const cs = await bunnyNotes.commitments(toNoteHex(parsedNote.deposit.commitment));
        expect(cs.used).to.be.true;
        expect(cs.creator).to.equal(alice.address);
        expect(cs.usesToken).to.be.true;
        expect(cs.token).to.equal(USDTM.address);
        expect(cs.denomination).to.equal(denomination);

        // Checking with a used commitment
        errorOccured = false;
        try {
            await bunnyNotes.connect(alice).depositToken(
                toNoteHex(parsedNote.deposit.commitment),
                parseEther("100"),
                USDTM.address
            );
        } catch (err: any) {
            errorOccured = true;
            errorMessage = err.message;
        }
        expect(errorOccured).to.be.true;
        expect(errorMessage.includes("Used commitment")).to.be.true;

    })

    it("alice creates a ETH note and bob address withdraws it", async function () {
        const { owner, alice, bob, attacker, USDTM, Verifier, bunnyNotes, relayer, provider } = await setUpBunnyNotes();
        const denomination = parseEther("100");
        const fee = await bunnyNotes.calculateFee(denomination);
        const feeWithDenomination = denomination.add(fee);
        const noteString1 = await deposit({ currency: "ETH", amount: '100', netId: 1337 });
        const parsedNote = await parseNote(noteString1);
        const depositTx = await bunnyNotes.connect(alice).depositEth(
            toNoteHex(parsedNote.deposit.commitment),
            denomination,
            { value: feeWithDenomination }
        );
        // Now alice has a note and she can give it to bob

        const proofRes = await generateNoteWithdrawProof(
            {
                deposit: parsedNote.deposit,
                recipient: bob.address
            }
        )
        const bobBalance = await bob.getBalance();

        await bunnyNotes.withdraw(
            packToSolidityProof(proofRes.proof),
            toNoteHex(parsedNote.deposit.nullifierHash),
            toNoteHex(parsedNote.deposit.commitment),
            bob.address
        );

        const newBoBBalance = await bob.getBalance();

        expect(bobBalance.add(denomination)).to.equal(newBoBBalance);

        // Expect that bob got the eth and the note is spent
        const cs = await bunnyNotes.commitments(toNoteHex(parsedNote.deposit.commitment));
        expect(cs.used).to.be.true;
        expect(cs.recipient).to.equal(bob.address);

        const nullified = await bunnyNotes.nullifierHashes(toNoteHex(parsedNote.deposit.nullifierHash));
        expect(nullified).to.be.true;

        //tries to withdraw again and it should fail
        let errorOccured = false;
        let errorMessage = "";
        try {
            await bunnyNotes.withdraw(
                packToSolidityProof(proofRes.proof),
                toNoteHex(parsedNote.deposit.nullifierHash),
                toNoteHex(parsedNote.deposit.commitment),
                bob.address
            );
        } catch (err: any) {
            errorOccured = true;
            errorMessage = err.message;
        }

        expect(errorOccured).to.be.true;
        expect(errorMessage.includes("The note has already been spent")).to.be.true;

    })

    it("alice creates an erc20 note and bob address withdraws it", async function () {
        const { owner, alice, bob, attacker, USDTM, Verifier, bunnyNotes, relayer, provider } = await setUpBunnyNotes();
        const denomination = parseEther("100");
        const fee = await bunnyNotes.calculateFee(denomination);
        const feeWithDenomination = denomination.add(fee);

        // Now alice has a note and she gives it to bob who can withdraw it
        const noteString1 = await deposit({ currency: "USDTM", amount: '100', netId: 1337 });
        const parsedNote = await parseNote(noteString1);

        await USDTM.mint(alice.address, feeWithDenomination);
        await USDTM.connect(alice).approve(bunnyNotes.address, feeWithDenomination);

        const depositTx = await bunnyNotes.connect(alice).depositToken(
            toNoteHex(parsedNote.deposit.commitment),
            parseEther("100"),
            USDTM.address
        );

        // now bob will withdraw this note
        const bobTokenbalance = await USDTM.balanceOf(bob.address);
        expect(bobTokenbalance).to.equal(parseEther("0"))

        const proofRes = await generateNoteWithdrawProof(
            {
                deposit: parsedNote.deposit,
                recipient: bob.address
            }
        )
        const withdrawRes = await bunnyNotes.withdraw(
            packToSolidityProof(proofRes.proof),
            toNoteHex(parsedNote.deposit.nullifierHash),
            toNoteHex(parsedNote.deposit.commitment),
            bob.address
        );

        await withdrawRes.wait().then((receipt) => {
            const events = receipt.events as any;
            expect(events[1].event).to.equal("WithdrawBunnyNote");
        })
        const bobNewTokenBalance = await USDTM.balanceOf(bob.address);
        expect(bobNewTokenBalance).to.equal(bobTokenbalance.add(denomination));
    })

    it("Tests withdrawing an unbacked note", async function () {
        const { owner, alice, bob, attacker, USDTM, Verifier, bunnyNotes, relayer, provider } = await setUpBunnyNotes();
        const noteString1 = await deposit({ currency: "USDTM", amount: '100', netId: 1337 });
        const parsedNote = await parseNote(noteString1);
        const proofRes = await generateNoteWithdrawProof(
            {
                deposit: parsedNote.deposit,
                recipient: bob.address
            }
        )
        let errorOccured = false;
        let errorMessage = "";
        try {
            const withdrawRes = await bunnyNotes.withdraw(
                packToSolidityProof(proofRes.proof),
                toNoteHex(parsedNote.deposit.nullifierHash),
                toNoteHex(parsedNote.deposit.commitment),
                bob.address
            );
        } catch (err: any) {
            errorOccured = true;
            errorMessage = err.message;
        }

        expect(errorOccured).to.be.true;
        expect(errorMessage.includes("Unused Note!")).to.be.true;
    })
})