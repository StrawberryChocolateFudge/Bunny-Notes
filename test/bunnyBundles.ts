import { expect } from "chai";
import { createBundle, parseBundleNote } from "../lib/BunnyBundle";
import { generateBundleWithdrawProof, verifyFourPublicSignals } from "../lib/generateProof";
import { encodeForCircuit, generateMerkleProof, getMerkleRootFromMerkleProof, MerkleProof } from "../lib/merkleTree";
import fs from "fs";
import { setUpBunnyBundles } from "./setup";

describe("Bunny bundles", function () {

    it("Deploy a bunny bundle contract and deposit for a bundle", async function () {
        const {
            owner,
            alice,
            bob,
            attacker,
            bunnyBundles,
            USDTM,
            feelesstoken } = await setUpBunnyBundles();
        console.log(owner.address);
        console.log(bunnyBundles.address);
        const { bunnyBundle, leaves, root, tree } = await createBundle({ currency: "ETH", amount: "100", netId: 1337, size: 100 });

        // I will chose a random bunnyBundle and 

        // Alice will deposit ETH to create a bunnyBundle!


    })
})