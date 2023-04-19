import { createRoot } from 'react-dom/client';
import { App } from "./App";
// import { downloadA4PDF } from './pdf';
// import { commitmentQR, createQR } from './qrcode/create';
// import { createNote } from './zkp/generateProof';
// import { toNoteHex } from '../lib/BunnyNote';
// import { getNetworkNameFromId } from './web3/web3';

const container = document.getElementById("app");
const root = createRoot(container!);

root.render(App());


// const testBtn = document.getElementById("pdfTests") as HTMLButtonElement;

// testBtn.onclick = async function () {
//     const currency = "ETH";
//     const denomination = "111111111110.00001";
//     const netId = "0x405";
//     const noteDetails = await createNote(currency, denomination, netId);
//     const commitment = toNoteHex(noteDetails[1].deposit.commitment);
//     const nullifierHash = toNoteHex(noteDetails[1].deposit.nullifierHash);
//     const amount = noteDetails[1].amount;

//     const qrCodeDataUrl = await createQR(noteDetails[0]);

//     const commitmentQRDataUrl = await commitmentQR({ amount, currency, commitment, nullifierHash });
//     const networkName = getNetworkNameFromId(netId);

//     const bearerText = `The smart contract on ${networkName} will pay the bearer on demand the sum of ${denomination} ${currency}`

//     downloadA4PDF(
//         {
//             bearerText,
//             denomination: denomination + " " + currency,
//             commitment: toNoteHex(noteDetails[1].deposit.commitment),
//             cardType: "Bunny Note",
//             dataUrl: qrCodeDataUrl,
//             noteString: noteDetails[0],
//             commitmentQRCodeString: commitmentQRDataUrl.QRString,
//             commitmentQRCodeDataUrl: commitmentQRDataUrl.buffer,
//             network: netId,
//             tokenAddress: "Native Token"
//         });
// }