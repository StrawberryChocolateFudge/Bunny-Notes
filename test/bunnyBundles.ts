import { expect } from "chai";
import { createBundle, parseBundleNote } from "../lib/BunnyBundle";
import { generateBundleWithdrawProof } from "../lib/generateProof";
import {
  encodeForCircuit,
  generateMerkleProof,
  getMerkleRootFromMerkleProof,
  MerkleProof,
} from "../lib/merkleTree";
import { setUpBunnyBundles } from "./setup";
import { toNoteHex } from "../lib/BunnyNote";
import { parseEther } from "ethers/lib/utils";
import packToSolidityProof from "../lib/packToSolidityProof";
import { blob } from "stream/consumers";
import { ZEROADDRESS } from "../frontend/web3/web3";

describe("Bunny bundles", function () {
  it("Deploy a bunny bundle contract and deposit ETH for a bundle and withdraw!", async function () {
    const {
      owner,
      alice,
      bob,
      bunnyBundles,
      feelesstoken,
      Verifier,
      provider,
    } = await setUpBunnyBundles();
    const totalValue = "100";
    const bundleSize = 5;
    const { bunnyBundle, leaves, root, tree } = await createBundle({
      currency: "ETH",
      totalValue,
      netId: 1337,
      size: bundleSize,
    });
    const noteValue = await bunnyBundles.getNoteValue(
      parseEther(totalValue),
      bundleSize,
    );
    expect(noteValue).to.equal(parseEther("20"));
    // I will chose a random bunnyBundle and

    // Alice will deposit ETH to create a bunnyBundle!
    const rootHex = toNoteHex(root);
    const noteToDeposit = bunnyBundle[0]; // I use the first from the bundle
    const parsed = await parseBundleNote(noteToDeposit);
    // Double check that the bundle and leaves are ordered the same way!
    expect(parsed.deposit.commitment).to.equal(leaves[0]);
    const nullifierHash = toNoteHex(parsed.deposit.nullifierHash);
    // The _owner of the bunnyBundles contract is the {owner}
    expect(await bunnyBundles._owner()).to.equal(owner.address);
    // Checking if the feeless token address is correct and checking the feedivider
    expect(await bunnyBundles.feelessToken()).to.equal(feelesstoken.address);
    expect(await bunnyBundles.FEE_DIVIDER()).to.equal(100);
    // Checking if the verifier address is set correctly
    expect(await bunnyBundles.verifier()).to.equal(Verifier.address);

    //Check if the root hash has a bundle object already!
    expect(await (await bunnyBundles.bundles(rootHex)).creator != ZEROADDRESS)
      .to.equal(false);

    expect(await bunnyBundles.nullifierHashes(rootHex, nullifierHash)).to.equal(
      false,
    );
    const ownerBalanceBeforeFee = await owner.getBalance();
    // Now I do a deposit!
    const fee = await bunnyBundles.calculateFee(parseEther(totalValue));
    const valueWithFee = fee.add(parseEther(totalValue));
    expect(valueWithFee).to.equal(parseEther("101"));

    expect(await provider.getBalance(bunnyBundles.address)).to.equal(
      parseEther("0"),
    );

    const depositEthTx = await bunnyBundles.connect(alice).depositEth(
      rootHex,
      parseEther(totalValue),
      bundleSize,
      { value: valueWithFee },
    );
    await depositEthTx.wait().then((receipt) => {
      const events = receipt.events;
      if (!events) {
        throw "Event was not emitted";
      }
      const firstEvent = events[0];
      expect(firstEvent.event).to.equal("DepositETH");
    });

    expect(await provider.getBalance(bunnyBundles.address)).to.equal(
      parseEther(totalValue),
    );

    // Test fees
    expect(await owner.getBalance()).to.equal(ownerBalanceBeforeFee.add(fee));

    // Now I should have a bundle with the root hash
    const bundle = await bunnyBundles.bundles(rootHex);
    expect(bundle.bunnyNotesLeft).to.equal(bundleSize);
    expect(bundle.creator).to.equal(alice.address);
    expect(bundle.size).to.equal(bundleSize);
    expect(bundle.totalValue).to.equal(parseEther(totalValue));
    expect(bundle.usesToken).to.equal(false);

    // Now Bob will withdraw
    const bobBalanceBeforeWithdraw = await bob.getBalance();
    const merkleProof = generateMerkleProof(
      parsed.deposit.commitment,
      leaves,
    ) as MerkleProof;
    // verify that the merkle proof is correct for the root from the note!
    const rootFromProof = getMerkleRootFromMerkleProof(merkleProof);
    expect(rootFromProof).to.equal(BigInt(parsed.root));

    const { proof: zkProof, publicSignals } = await generateBundleWithdrawProof(
      {
        deposit: parsed.deposit,
        root: BigInt(parsed.root),
        merkleProof: encodeForCircuit(merkleProof),
        recipient: bob.address,
      },
    );

    // Owner will pay gas fees for the withdraw
    const withdrawTx = await bunnyBundles.withdraw(
      packToSolidityProof(zkProof),
      toNoteHex(parsed.deposit.nullifierHash),
      toNoteHex(parsed.deposit.commitment),
      toNoteHex(BigInt(parsed.root)),
      bob.address,
    );

    await withdrawTx.wait().then((receipt) => {
      const events = receipt.events;
      if (!events) {
        throw "Faild withdraw";
      }
      const firstEvent = events[0];
      expect(firstEvent.event).to.equal("WithdrawFromBundle");
    });

    expect(await bob.getBalance()).to.equal(
      bobBalanceBeforeWithdraw.add(noteValue),
    );

    // / now I can check that the BundleStore has different valueLeft and bunnyNotesLeft etc
    const bundleAfterWithdraw = await bunnyBundles.bundles(rootHex);
    expect(bundleAfterWithdraw.bunnyNotesLeft).to.equal(bundleSize - 1);
    expect(bundleAfterWithdraw.valueLeft).to.equal(
      parseEther(totalValue).sub(noteValue),
    );
  });

  it("Create a bunny bundle that has only 1 note, deposit ETH and withdraw", async function () {
    const {
      alice,
      bob,
      bunnyBundles,
    } = await setUpBunnyBundles();
    let errorOccured = false;
    let errorMessage = "";

    const totalValue = "1"; //1 ETH
    const bundleSize = 1;
    const { bunnyBundle, leaves, root, tree } = await createBundle({
      currency: "ETH",
      totalValue,
      netId: 1337,
      size: bundleSize,
    });
    expect(leaves.length).to.equal(2);
    expect(bunnyBundle.length).to.equal(1);
    const noteToDeposit = bunnyBundle[0];
    const parsed = await parseBundleNote(noteToDeposit);
    expect(parsed.deposit.commitment).to.equal(leaves[0]);

    const fee = await bunnyBundles.calculateFee(parseEther(totalValue));
    //Create the proof for bob to withdraw it!
    const merkleProof = generateMerkleProof(parsed.deposit.commitment, leaves);
    if (!merkleProof) {
      throw "Creating merkleproof failed!";
    }
    // Verify the merkle proof is correct for the root
    const rootFromProof = getMerkleRootFromMerkleProof(merkleProof);
    expect(rootFromProof).to.equal(BigInt(parsed.root));

    const { proof: zkProof, publicSignals } = await generateBundleWithdrawProof(
      {
        deposit: parsed.deposit,
        root: BigInt(parsed.root),
        merkleProof: encodeForCircuit(merkleProof),
        recipient: bob.address,
      },
    );

    try {
      await bunnyBundles.withdraw(
        packToSolidityProof(zkProof),
        toNoteHex(parsed.deposit.nullifierHash),
        toNoteHex(parsed.deposit.commitment),
        toNoteHex(BigInt(parsed.root)),
        bob.address,
      );
    } catch (err: any) {
      errorOccured = true;
      errorMessage = err.message;
    }

    expect(errorOccured).to.be.true;
    expect(errorMessage.includes("Unused root!")).to.be.true;

    // // I'm just gonna deposit as alice
    await bunnyBundles.connect(alice).depositEth(
      toNoteHex(root),
      parseEther(totalValue),
      bundleSize,
      { value: parseEther(totalValue).add(fee) },
    );

    const bundle = await bunnyBundles.bundles(toNoteHex(root));
    expect(bundle.creator).to.equal(alice.address);
    expect(bundle.size).to.equal(1);
    expect(bundle.totalValue).to.equal(parseEther("1"));
    expect(bundle.valueLeft).to.equal(parseEther("1"));
    expect(bundle.bunnyNotesLeft).to.equal(1);
    expect(bundle.usesToken).to.be.false;

    await bunnyBundles.withdraw(
      packToSolidityProof(zkProof),
      toNoteHex(parsed.deposit.nullifierHash),
      toNoteHex(parsed.deposit.commitment),
      toNoteHex(BigInt(parsed.root)),
      bob.address,
    );

    const bundleAfterWithdraw = await bunnyBundles.bundles(toNoteHex(root));
    expect(bundleAfterWithdraw.bunnyNotesLeft).to.equal(0);
    expect(bundleAfterWithdraw.valueLeft).to.equal(parseEther("0"));

    errorOccured = false;
    try {
      await bunnyBundles.withdraw(
        packToSolidityProof(zkProof),
        toNoteHex(parsed.deposit.nullifierHash),
        toNoteHex(parsed.deposit.commitment),
        toNoteHex(BigInt(parsed.root)),
        bob.address,
      );
    } catch (err: any) {
      errorOccured = true;
      errorMessage = err.message;
    }
    expect(errorOccured).to.equal(true);
    expect(errorMessage.includes("Invalid note")).to.be.true;

    errorOccured = false;
    try {
      await bunnyBundles.depositEth(
        toNoteHex(root),
        parseEther(totalValue),
        bundleSize,
      );
    } catch (err: any) {
      errorOccured = true;
      errorMessage = err.message;
    }
    expect(errorOccured).to.equal(true);
    expect(errorMessage.includes("Bundle exists")).to.be.true;
  });

  it("Create a bunny bundle size 10 and deposit tokens then withdraw.", async function () {
    const {
      owner,
      alice,
      bob,
      bunnyBundles,
      feelesstoken,
      Verifier,
      USDTM,
    } = await setUpBunnyBundles();
    const totalValue = "100"; // will be USDTM
    const bundleSize = 10;
    const { bunnyBundle, leaves, root, tree } = await createBundle({
      currency: "USTM",
      totalValue,
      netId: 1337,
      size: bundleSize,
    });
    const noteToDeposit = bunnyBundle[0]; // I use the first from the bundle
    const parsed = await parseBundleNote(noteToDeposit);

    // Mint some tokens to alice
    await USDTM.mint(alice.address, parseEther("1000"));
    expect(await USDTM.balanceOf(alice.address)).to.equal(parseEther("1000"));
    expect(await USDTM.balanceOf(owner.address)).to.equal(parseEther("0"));

    const fee = await bunnyBundles.calculateFee(parseEther(totalValue));
    const toApprove = fee.add(parseEther(totalValue));
    // Approve spend and deposit
    await USDTM.connect(alice).approve(bunnyBundles.address, toApprove);

    expect(await USDTM.allowance(alice.address, bunnyBundles.address)).to.equal(
      toApprove,
    );

    const depositTx = await bunnyBundles.connect(alice).depositToken(
      toNoteHex(BigInt(parsed.root)),
      parseEther(totalValue),
      bundleSize,
      USDTM.address,
    );

    await depositTx.wait().then((receipt) => {
      const events = receipt.events;
      if (!events) {
        throw "Didnt emit events";
      }
      const depositEvent = events[events.length - 1];
      expect(depositEvent.event).to.equal("DepositToken");
    });

    expect(await USDTM.balanceOf(bunnyBundles.address)).to.equal(
      parseEther(totalValue),
    );
    expect(await USDTM.balanceOf(owner.address)).to.equal(fee);

    // I get the bundle and check what token it's usin
    const bundle = await bunnyBundles.bundles(toNoteHex(root));
    expect(bundle.creator != ZEROADDRESS).to.be.true;
    expect(bundle.token).to.equal(USDTM.address);
    expect(bundle.usesToken).to.equal(true);
    expect(bundle.totalValue).to.equal(parseEther(totalValue));
    expect(bundle.valueLeft).to.equal(parseEther(totalValue));
    expect(bundle.bunnyNotesLeft).to.equal(bundleSize);

    // Now I withdraw!

    const bobBalanceBeforeWithdraw = await USDTM.balanceOf(bob.address);
    expect(bobBalanceBeforeWithdraw).to.equal(parseEther("0"));

    const merkleProof = generateMerkleProof(
      parsed.deposit.commitment,
      leaves,
    ) as MerkleProof;

    const rootFromProof = getMerkleRootFromMerkleProof(merkleProof);
    expect(rootFromProof).to.equal(BigInt(parsed.root));

    const { proof: zkProof, publicSignals } = await generateBundleWithdrawProof(
      {
        deposit: parsed.deposit,
        root: BigInt(parsed.root),
        merkleProof: encodeForCircuit(merkleProof),
        recipient: bob.address,
      },
    );
    const noteValue = await bunnyBundles.getNoteValue(
      parseEther(totalValue),
      bundleSize,
    );

    // Bob will withdraw the tokens
    const withdrawTx = await bunnyBundles.withdraw(
      packToSolidityProof(zkProof),
      toNoteHex(parsed.deposit.nullifierHash),
      toNoteHex(parsed.deposit.commitment),
      toNoteHex(BigInt(parsed.root)),
      bob.address,
    );

    await withdrawTx.wait().then((receipt) => {
      const events = receipt.events;
      if (!events) {
        throw "failed withdraw";
      }
      const lastEvent = events[events.length - 1];
      expect(lastEvent.event).to.equal("WithdrawFromBundle");
    });

    expect(await USDTM.balanceOf(bob.address)).to.equal(
      bobBalanceBeforeWithdraw.add(noteValue),
    );
    expect(await USDTM.balanceOf(bunnyBundles.address)).to.equal(
      parseEther(totalValue).sub(noteValue),
    );
  });

  it("Test feeless tokens", async function () {
    const {
      owner,
      alice,
      bunnyBundles,
      USDTM,
    } = await setUpBunnyBundles();

    //Alice Tries to change the feeless token
    let errorOccured = false;
    let errorMessage = "";
    try {
      await bunnyBundles.connect(alice).setFeelessToken(USDTM.address);
    } catch (err: any) {
      errorOccured = true;
      errorMessage = err.message;
    }
    expect(errorOccured).to.be.true;
    expect(errorMessage.includes("Only owner")).to.be.true;

    // Now as the owner I will change it
    await bunnyBundles.setFeelessToken(USDTM.address);
    expect(await bunnyBundles.feelessToken()).to.equal(USDTM.address);

    // Now I create a bundle and deposit with feeless tokens.
    // I check to make sure no fees are charged!!

    const totalValue = "1"; //1 USDTM
    const bundleSize = 10;
    const { bunnyBundle, leaves, root, tree } = await createBundle({
      currency: "USDTM",
      totalValue,
      netId: 1337,
      size: bundleSize,
    });
    const noteValue = await bunnyBundles.getNoteValue(
      parseEther(totalValue),
      bundleSize,
    );

    const noteToDeposit = bunnyBundle[0];
    const parsed = await parseBundleNote(noteToDeposit);
    await USDTM.mint(alice.address, parseEther("1"));
    // Only Approve what is the value deposited, no fees will be used!
    await USDTM.connect(alice).approve(bunnyBundles.address, parseEther("1"));
    expect(await USDTM.balanceOf(alice.address)).to.equal(parseEther("1"));
    expect(await USDTM.balanceOf(owner.address)).to.equal(parseEther("0"));
    await bunnyBundles.connect(alice).depositToken(
      toNoteHex(BigInt(parsed.root)),
      parseEther(totalValue),
      bundleSize,
      USDTM.address,
    );
    // No fees were withdraws and no errors
    expect(await USDTM.balanceOf(bunnyBundles.address)).to.equal(
      parseEther("1"),
    );
    expect(await USDTM.balanceOf(owner.address)).to.equal(parseEther("0"));
  });

  it("tests withdrawing from a nonexistent bundle", async function () {
    const {
      owner,
      alice,
      bunnyBundles,
      USDTM,
      bob,
    } = await setUpBunnyBundles();
    const totalValue = "1"; //1 USDTM
    const bundleSize = 1;
    const { bunnyBundle, leaves, root, tree } = await createBundle({
      currency: "USDTM",
      totalValue,
      netId: 1337,
      size: bundleSize,
    });
    const noteValue = await bunnyBundles.getNoteValue(
      parseEther(totalValue),
      bundleSize,
    );
    const parsed = await parseBundleNote(bunnyBundle[0]);
    const merkleProof = generateMerkleProof(
      parsed.deposit.commitment,
      leaves,
    ) as MerkleProof;
    const rootFromProof = getMerkleRootFromMerkleProof(merkleProof);
    expect(rootFromProof).to.equal(BigInt(parsed.root));
    const { proof: zkProof, publicSignals } = await generateBundleWithdrawProof(
      {
        deposit: parsed.deposit,
        root: BigInt(parsed.root),
        merkleProof: encodeForCircuit(merkleProof),
        recipient: bob.address,
      },
    );

    let errorOccured = false;
    let errorMessage = "";

    try {
      await bunnyBundles.withdraw(
        packToSolidityProof(zkProof),
        toNoteHex(parsed.deposit.nullifierHash),
        toNoteHex(parsed.deposit.commitment),
        toNoteHex(BigInt(parsed.root)),
        bob.address,
      );
    } catch (err: any) {
      errorOccured = true;
      errorMessage = err.message;
    }
    expect(errorOccured).to.be.true;
    expect(errorMessage.includes("Unused root!")).to.be.true;

    // Now I deposit to create this root and submit an invalid proof afterwards
    const fee = await bunnyBundles.calculateFee(parseEther(totalValue));
    await bunnyBundles.depositEth(
      toNoteHex(BigInt(parsed.root)),
      parseEther(totalValue),
      bundleSize,
      { value: parseEther(totalValue).add(fee) },
    );

    errorOccured = false;
    try {
      await bunnyBundles.withdraw(
        packToSolidityProof(zkProof),
        toNoteHex(parsed.deposit.nullifierHash),
        toNoteHex(parsed.deposit.commitment),
        toNoteHex(BigInt(parsed.root)),
        alice.address,
      );
    } catch (er: any) {
      errorOccured = true;
      errorMessage = er.message;
    }
    expect(errorOccured).to.be.true;
    expect(errorMessage.includes("Invalid Withdraw proof")).to.be.true;

    // Now I withdraw it and then submit the same invalid proof and no value left should throw!

    await bunnyBundles.withdraw(
      packToSolidityProof(zkProof),
      toNoteHex(parsed.deposit.nullifierHash),
      toNoteHex(parsed.deposit.commitment),
      toNoteHex(BigInt(parsed.root)),
      bob.address,
    );

    // Try again with an invalid proof to trigger no value left error
    errorOccured = false;
    try {
      await bunnyBundles.withdraw(
        packToSolidityProof(zkProof),
        toNoteHex(BigInt("34235676235623756235353")),
        toNoteHex(parsed.deposit.commitment),
        toNoteHex(BigInt(parsed.root)),
        alice.address,
      );
    } catch (er: any) {
      errorOccured = true;
      errorMessage = er.message;
    }

    expect(errorOccured).to.be.true;
    expect(errorMessage.includes("No value left")).to.be.true;

    const bundle = await bunnyBundles.bundles(toNoteHex(BigInt(root)));
    expect(bundle.valueLeft).to.equal(parseEther("0"));
    expect(bundle.bunnyNotesLeft).to.equal(0);
  });
});
