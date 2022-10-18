import { expect } from "chai";
import { generateProof, verifyProof } from "../lib/generateProof";
import { deposit, parseNote } from "../lib/note";
import fs from "fs";

describe("BunnyNotes ZKP", function () {
    it("Should create a proof and verify it", async function () {
        const noteString = await deposit({ currency: "USDT", amount: 10, netId: 0x2b6653dc });

        console.log(noteString);
        const parsedNote = await parseNote(noteString);
        const { proof, publicSignals } = await generateProof({ deposit: parsedNote.deposit, recepient: "0x0000000000000000000000000000000000000000", change: "0" })

        const verificationKeyFile = fs.readFileSync("circuits/verification_key.json", "utf-8");
        const verificationKey = JSON.parse(verificationKeyFile);

        const res = await verifyProof(verificationKey, { proof, publicSignals })

        expect(res).to.be.true;

    })
})