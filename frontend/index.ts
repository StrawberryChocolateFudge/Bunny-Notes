import { createRoot } from 'react-dom/client';
import { toNoteHex } from '../lib/BunnyNote';
import { App } from "./App";
import { downloadPDF } from './pdf';
import { commitmentQR, createQR } from './qrcode/create';
import { createNote } from './zkp/generateProof';

const container = document.getElementById("app");
const root = createRoot(container!);

root.render(App());

// const testBtn = document.getElementById("testNoteButton") as HTMLButtonElement;

// testBtn.onclick = async function () {
//     const currency = "BTT";
//     const denomination = "1000000000";
//     const netId = "0x405";
//     const noteDetails = await createNote(currency, parseInt(denomination), netId);
//     const commitment = toNoteHex(noteDetails[1].deposit.commitment);
//     const nullifierHash = toNoteHex(noteDetails[1].deposit.nullifierHash);
//     const amount = noteDetails[1].amount;

//     const qrCodeDataUrl = await createQR(noteDetails[0]);

//     const commitmentQRDataUrl = await commitmentQR({ amount, currency, commitment, nullifierHash });

//     const bearerText = `The smart contract will pay the bearer on demand the sum of ${denomination} ${currency}`

//     downloadPDF(bearerText, denomination + " " + currency, toNoteHex(noteDetails[1].deposit.commitment), "Bunny Note", qrCodeDataUrl, noteDetails[0], commitmentQRDataUrl);
// }