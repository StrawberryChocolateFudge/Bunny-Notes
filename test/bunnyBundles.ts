import { expect } from "chai";
import { createBundle, fromNoteHex } from "../lib/BunnyBundle";
//@ts-ignore
import { utils } from "ffjavascript";
import { createDeposit, toNoteHex } from "../lib/BunnyNote";
import { rbigint } from "../lib/random";
import bigInt from "big-integer";
import { encodeForCircuit, generateMerkleProof, getMerkleRootFromMerkleProof } from "../lib/generateCommitmentHash";

describe("Bunny bundles", function () {
    it("Create a bunny bundle", async function () {
        const { notes, leaves, root, tree } = await createBundle({ currency: "ETH", amount: "100", netId: 1337, size: 10 });
        expect(notes.length).to.equal(leaves.length);
        expect(tree.layers[tree.layers.length - 1][0]).to.equal(root);
        const proofForLeaf = leaves[0];

        const merkleProof = generateMerkleProof(proofForLeaf, leaves);
        const rootFromProof = getMerkleRootFromMerkleProof(merkleProof);
        expect(rootFromProof).to.equal(root);
        console.log(merkleProof);

        const encodedForCircuit = encodeForCircuit(merkleProof, proofForLeaf);
        console.log(encodedForCircuit);


    })




})