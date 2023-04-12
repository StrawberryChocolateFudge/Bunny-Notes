import { expect } from "chai";
import { generateNoteWithdrawProof, verifyFourPublicSignals } from "../lib/generateProof";
import { deposit, parseNote } from "../lib/BunnyNote";
import fs from "fs";

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
})
