import { deposit, parseNote } from "../lib/note";
import { generateProof, verifyProof } from "../lib/generateProof";
import fs from "fs";

async function main(): Promise<number> {
    const noteString = await deposit({ currency: "USDT", amount: 10, netId: 0x2b6653dc });

    console.log(noteString);
    const parsedNote = await parseNote(noteString);
    const { proof, publicSignals } = await generateProof({ deposit: parsedNote.deposit, recipient: "0x0000000000000000000000000000000000000000", fee: "0", change: "0" })

    const verificationKeyFile = fs.readFileSync("circuits/verification_key.json", "utf-8");
    const verificationKey = JSON.parse(verificationKeyFile);

    const res = await verifyProof(verificationKey, { proof, publicSignals })

    if (res) {
        console.log("Proof is valid");
    } else {
        console.log("Proof is invalid!")
    }

    return 0;
}

main().catch(err => {
    console.error(err);
    process.exitCode = 1;
})

