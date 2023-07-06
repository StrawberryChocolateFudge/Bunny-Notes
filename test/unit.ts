import { expect } from "chai";
import {
  evalQRCodeType,
  getBundleRootNullifierQRString,
  getCommitmentQRString,
  getQrType,
  rootEncodingForVerification,
  verifyEncodedRoot,
} from "../frontend/qrcode/create";
import { createBundle, parseBundleNote } from "../lib/BunnyBundle";
import { deposit, parseNote, toNoteHex } from "../lib/BunnyNote";

describe("Unit tests for UI functions", function () {
  it("Should test for the qr code string parsing with the bunny bundles and notes for the verify page", async function () {
    // generate a bunny note string
    const bunnyNote = await deposit({
      currency: "USDT",
      amount: "10",
      netId: 0x2b6653dc,
    });

    let qrType = getQrType(bunnyNote);
    expect(qrType).to.equal("bunnynote");

    const parsedBunnyNote = await parseNote(bunnyNote);
    // generate a bunny note commitment
    const bunnyNoteCommitmentQR = await getCommitmentQRString(
      parsedBunnyNote.amount,
      parsedBunnyNote.currency,
      parsedBunnyNote.netId.toString(),
      toNoteHex(parsedBunnyNote.deposit.commitment),
      toNoteHex(parsedBunnyNote.deposit.nullifierHash),
    );

    qrType = getQrType(bunnyNoteCommitmentQR);
    expect(qrType).to.equal("commitment");

    // generate an encoded root string
    const { bunnyBundle, leaves, root, tree } = await createBundle({
      currency: "ETH",
      totalValue: "100",
      netId: 1337,
      size: 5,
    });
    const valuePerNote = "20";

    const encodedRoot = await rootEncodingForVerification(
      toNoteHex(root),
      "1337",
      "ETH",
      "100",
      5,
    );
    console.log("encoded root:", encodedRoot);
    const verifiedEncodedRoot = await verifyEncodedRoot(encodedRoot);
    expect(verifiedEncodedRoot.root).to.equal(toNoteHex(root));
    qrType = getQrType(encodedRoot);
    expect(qrType).to.equal("bundleroot");

    // generate a bundle note string
    const bundleNote = bunnyBundle[0];
    qrType = getQrType(bundleNote);
    expect(qrType).to.equal("bunnybundle");

    const parsedBundledNote = await parseBundleNote(bundleNote);
    // generate a bundle note root nullifier qr string
    const bundleNoteRootNullifierQRString =
      await getBundleRootNullifierQRString(
        valuePerNote,
        "ETH",
        "1337",
        toNoteHex(root),
        toNoteHex(parsedBundledNote.deposit.nullifierHash),
      );

    qrType = getQrType(bundleNoteRootNullifierQRString);
    expect(qrType).to.equal("bundlecommitment");

    // an invalid string
    const shouldBeInvalid = "12131xa";

    qrType = getQrType(shouldBeInvalid);
    expect(qrType).to.equal("invalid");

    const bunnyNoteEval = await evalQRCodeType(bunnyNote);

    expect(bunnyNoteEval.type).to.equal("cryptoNote");

    const bunnyNoteCommitmentEval = await evalQRCodeType(bunnyNoteCommitmentQR);

    expect(bunnyNoteCommitmentEval.type).to.equal("commitmentQR");

    const bundleRootEval = await evalQRCodeType(encodedRoot);

    expect(bundleRootEval.type).to.equal("bundleroot");
    //TODO: Move the verification out of evalQRCodeType and test more thoroughly, bundleroot throws!!
    const bundleNoteEval = await evalQRCodeType(bundleNote);

    expect(bundleNoteEval.type).to.equal("bundlenote");

    // This is for checking the individial bunny bundles validity
    const bundleNoteRootNullifierEval = await evalQRCodeType(
      bundleNoteRootNullifierQRString,
    );
    expect(bundleNoteRootNullifierEval.type).to.equal("bundlenoteNullifier");

    const shouldbeInvalidEval = await evalQRCodeType(shouldBeInvalid);
    expect(shouldbeInvalidEval.type).to.equal("invalid");
  });
});
