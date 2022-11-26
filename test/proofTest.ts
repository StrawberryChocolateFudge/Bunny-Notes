import { expect } from "chai";
import { generateIsOwnerProof, generateNoteWithdrawProof, IsOwnerProofDetails, verifySixPublicSignals, verifyFourPublicSignals } from "../lib/generateProof";
import { createDeposit, deposit, parseNote, toNoteHex } from "../lib/BunnyNote";
import { createBunnyWalletNote, parseOwnerNote, relayedNoteNullifierHash } from "../lib/OwnerNote";
import fs from "fs";
import { rbigint } from "../lib/random";

describe("Bunny ZKP", function () {
    it("Should create a note, a proof to withdraw and verify it", async function () {
        const noteString = await deposit({ currency: "USDT", amount: 10, netId: 0x2b6653dc });
        const parsedNote = await parseNote(noteString);
        const { proof, publicSignals } = await generateNoteWithdrawProof({ deposit: parsedNote.deposit, recipient: "0x0000000000000000000000000000000000000000", change: "0" })
        const verificationKeyFile = fs.readFileSync("circuits/withdraw_bunnyNote/verification_key.json", "utf-8");
        const verificationKey = JSON.parse(verificationKeyFile);
        const res = await verifyFourPublicSignals(verificationKey, { proof, publicSignals })
        expect(res).to.be.true;
    })


    it("should test the IsOwnerNote regex", async function () {
        const deposit = await createDeposit({ nullifier: rbigint(), secret: rbigint() });
        const note = toNoteHex(deposit.preimage, 62);
        const validAddr = "0xeE55e7A619343B2f045bfD9A720BF912e1FCfEC7"
        const validNote = `bunnywallet-${validAddr}-1-${note}`;
        const parsedNote = await parseOwnerNote(validNote);
        expect(parsedNote.smartcontract).to.equal(validAddr.slice(2));
        const invalidAddr = "sadasd";
        const invalidNote = `bunnywallet-${invalidAddr}-1-${note}`;
        let throws = false;
        try {
            const parsedinvalidNote = await parseOwnerNote(invalidNote);
        } catch (err) {
            throws = true;
        }
        expect(throws).to.equal(true);
    });

    it("Should create a proof of wallet ownership and verify it", async function () {
        const noteString = await createBunnyWalletNote({ smartContract: "0xeE55e7A619343B2f045bfD9A720BF912e1FCfEC7", netId: 1 });
        const parsedNote = await parseOwnerNote(noteString);

        const { newNullifierHash, salt } = await relayedNoteNullifierHash(parsedNote.deposit.nullifier);

        const relayer = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65";
        const testToken = "0xa756b2b52Ba893a6109561bC86138Cbb897Fb2e0";
        const to = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65";
       

        const smartContract = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65";

        const details: IsOwnerProofDetails = {
            secret: parsedNote.deposit.secret,
            nullifier: parsedNote.deposit.nullifier,
            salt,
            nullifierHash: newNullifierHash,
            commitmentHash: parsedNote.deposit.commitment,
            relayer,
            smartContract
        };

        const { proof, publicSignals } = await generateIsOwnerProof({ details })
        const verificationKeyFile = fs.readFileSync("circuits/wallet_owner/verification_key.json", "utf-8");
        const verificationKey = JSON.parse(verificationKeyFile);
        const res = await verifyFourPublicSignals(verificationKey, { proof, publicSignals })

        expect(res).to.be.true;
    })

})
