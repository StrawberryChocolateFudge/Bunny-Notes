import { createRoot } from 'react-dom/client';
// import { toNoteHex } from '../lib/BunnyNote';
import { App } from "./App";
// import { downloadPDF } from './pdf';
// import { commitmentQR, commitmentQRStringParser, createQR, getCommitmentQRString } from './qrcode/create';
// import { createNote } from './zkp/generateProof';

const container = document.getElementById("app");
const root = createRoot(container!);

root.render(App());

// I used this to iterate on the PDF, I commit it in once before deleting to save it.

// const notePDFTests = document.getElementById("pdfTests") as HTMLButtonElement;

// notePDFTests.onclick = async function () {
//     const denomination = "1000 ETH";

//     const bearerText = `The smart contract will pay the bearer on demand the sum of ${denomination}`

//     const noteDetails = await createNote("ETH", "1", "1");

//     const noteString = noteDetails[0];

//     const noteStringQrCodeUrl = await createQR(noteString);

//     const parsedNote = noteDetails[1];

//     const commitment = toNoteHex(parsedNote.deposit.commitment);

//     const nullifierHash = toNoteHex(parsedNote.deposit.nullifierHash);

//     console.log(nullifierHash);
//     const commitmentQRCode = await commitmentQR({ commitment, currency: "ETH", amount: "1000", nullifierHash });

//     const commitmentQRCodeString = getCommitmentQRString("1000", "ETH", commitment, nullifierHash);

//     console.log(commitmentQRCodeString);

//     const parsedCommitmentQRCode = commitmentQRStringParser(commitmentQRCodeString);

//     console.log(parsedCommitmentQRCode);


//     await downloadPDF(bearerText, denomination, commitment, "Cash Note", noteStringQrCodeUrl, noteString, commitmentQRCode)

// }