import { expect } from "chai";
import { generateNoteWithdrawProof, verifyThreePublicSignals, generateBundleWithdrawProof, verifyFourPublicSignals } from "../lib/generateProof";
import { deposit, parseNote } from "../lib/BunnyNote";
import { createBundle, parseBundleNote } from "../lib/BunnyBundle";
import { encodeForCircuit, generateMerkleProof, getMerkleRootFromMerkleProof, MerkleProof } from "../lib/merkleTree";
import fs from "fs";

describe("Bunny ZKP", function () {
    it("Should create a note, a proof to withdraw and verify it", async function () {
        const noteString = await deposit({ currency: "USDT", amount: '10', netId: 0x2b6653dc });
        const parsedNote = await parseNote(noteString);
        const { proof, publicSignals } = await generateNoteWithdrawProof({ deposit: parsedNote.deposit, recipient: "0x0000000000000000000000000000000000000000" })
        const verificationKeyFile = fs.readFileSync("circuits/withdraw_bunnyNote/verification_key.json", "utf-8");
        const verificationKey = JSON.parse(verificationKeyFile);
        const res = await verifyThreePublicSignals(verificationKey, { proof, publicSignals })
        expect(res).to.be.true;
    })

    it("Create a bunny bundle, choose a note and verify it's in the bundle", async function () {
        const bundleSize = 10001;
        console.time(`${bundleSize} bunnybundles generated in: `);
        const { bunnyBundle, leaves, root, tree } = await createBundle({ currency: "ETH", totalValue: "100", netId: 1337, size: bundleSize });
        console.timeEnd(`${bundleSize} bunnybundles generated in: `);

        // The bundleSize is Event, then the leaves length is the same
        if (bundleSize % 2 === 0) {
            expect(bunnyBundle.length).to.equal(leaves.length);
        } else {
            // if bundleSize is odd, then the leaves are +1 because they are duplicated!
            expect(bunnyBundle.length + 1).to.equal(leaves.length);
        }

        expect(tree.layers[tree.layers.length - 1][0]).to.equal(root);
        // const root = BigInt("7134383530342203357968476074048993474625910172954766458200609505033693831543");
        // const bunnyBundle = [
        //     'bunnybundle-ETH-10.0-1337-10-0x6ae4ae87da336c39af1a01193a4531fb246c649983e81fdfcb782fb0576a6a2954a8c06f573662c0a827c52181df9e419fe6d157dea6fc93261a267d70cd-7134383530342203357968476074048993474625910172954766458200609505033693831543',
        //     'bunnybundle-ETH-10.0-1337-10-0x02c3ae21ea6464c6efcf987ccb010c642ead6e61bc83bc0ae26049fbbf225130c0bd2146683a7b53e65bc77244af6f6fcfb397471430de784ec8db8eb370-7134383530342203357968476074048993474625910172954766458200609505033693831543',
        //     'bunnybundle-ETH-10.0-1337-10-0x39fff17d7c2188a58cd7e56ebbb05ef28c92be10c83f0ac53879311d0cdeb8ea89a02c7d4b8630c34e1d7fdb0f83c5d8d346a78de1bd372917e4224ed410-7134383530342203357968476074048993474625910172954766458200609505033693831543',
        //     'bunnybundle-ETH-10.0-1337-10-0xf12a1c9a31b6997be5c272d7f8d5832477846278f11e372aedd39de65c97475909a82f47d6b010ff0be6ef45fd4e40824e85d40b613be3641b0a1b4beda3-7134383530342203357968476074048993474625910172954766458200609505033693831543',
        //     'bunnybundle-ETH-10.0-1337-10-0xf9c57ce6dcde5ff43369fc357d6e0d1d3ff3fa21535c91ccf3ed02e7595ee70cd6d3b4a6125fcc4b2867bde7abc4ce294ed28a6448f7cd165f6d8b71bc82-7134383530342203357968476074048993474625910172954766458200609505033693831543',
        //     'bunnybundle-ETH-10.0-1337-10-0x44b8dac7ddf8c7dd40491373bef7f66f796291fa734a137e9ea395778aa1c60b66f0c38bf5bbef79667989eafba6dd856f0153c19ae0331e66236b28eea3-7134383530342203357968476074048993474625910172954766458200609505033693831543',
        //     'bunnybundle-ETH-10.0-1337-10-0x5cd37ad0c842772d6acc15853e1b0f7960b7def41a21361caa0b4f2926f1cb2d8c994673e612d9c4d303e47b8df2b93cbec01a9a47b70316f458079586f7-7134383530342203357968476074048993474625910172954766458200609505033693831543',
        //     'bunnybundle-ETH-10.0-1337-10-0xd864f97050a78d3b1a673ebded9e644f40904959c220d100a577dd2b340998c5fe5564c22a8efc60c9a4bb222ba62a30fb70b84e204881be03c79b3636d6-7134383530342203357968476074048993474625910172954766458200609505033693831543',
        //     'bunnybundle-ETH-10.0-1337-10-0xa3f8c133cd4117134eafe251c8cc11f18914bf89f3c91357be0978da7cccc1d2c9d84df62781339ee3e6d9c407d9f62d4d309e1c6f469139b108344e8f16-7134383530342203357968476074048993474625910172954766458200609505033693831543',
        //     'bunnybundle-ETH-10.0-1337-10-0x0bbfa367b2bb15c694f38e877c4b2ce505c36d9043341cd6cbe8f454ccce37630d49ac99bc40f5a1a8a82bea0dccd7fed4670592fb603f7555e7f6853ef4-7134383530342203357968476074048993474625910172954766458200609505033693831543'
        // ]
        // const leaves = [
        //     '8403254311327326595402979664991381803464169510635059579295864936950123723659',
        //     '18784077491250742617237506494116755152588180348945925861865753085728654924157',
        //     '9257995588008057765766590189299635017548854775181639507033634005327344404093',
        //     '18461881131180240588861775043599134288802468048313974142289570213612570447367',
        //     '1232393613864762497566386205694004756439686356964762258469408833084184275190',
        //     '1411842238016605951413444629036169693782735949910661469641411445279760676826',
        //     '21319267406408882518733715998900412198474570116654439701562822430517024891245',
        //     '14745276222833338968939468340745769567609183243543694610666746829750297830333',
        //     '12541138543480740358411187506232465777522194817927248230563453330810699349811',
        //     '18306423483821184725905123467730820563265191461766826620994043720518603630031'
        // ].map((l) => BigInt(l));

        const leafIndex = 7348;

        const proofForLeaf = leaves[leafIndex];
        const proof = generateMerkleProof(proofForLeaf, leaves) as MerkleProof;
        // The first element in the proof is the leaf I'm looking for
        expect(proof[0].hash).to.equal(proofForLeaf);

        const finalRoot = getMerkleRootFromMerkleProof(proof)
        expect(finalRoot).to.equal(root);

        const encoded = encodeForCircuit(proof);
        expect(encoded.pathElements[0]).to.equal(proofForLeaf);

        //   Now create a proof with circom
        const noteToWithdraw = bunnyBundle[leafIndex];
        const parsedNote = await parseBundleNote(noteToWithdraw);
        expect(BigInt(parsedNote.root)).to.equal(root);
        const { proof: zkProof, publicSignals } = await generateBundleWithdrawProof({
            deposit: parsedNote.deposit,
            root,
            merkleProof: encoded,
            recipient: "0x0000000000000000000000000000000000000000"
        });
        // then verify the proof
        const verificationKeyFile = fs.readFileSync("circuits/withdraw_bunnyBundle/withdrawBundledNote_verificationKey.json", "utf-8");
        const verificationKey = JSON.parse(verificationKeyFile);
        const res = await verifyFourPublicSignals(verificationKey, { proof: zkProof, publicSignals });
        expect(res).to.be.true;
    })

})
