import { jsPDF } from "jspdf";
import { CardType } from "../components/CardGrid";

export async function downloadPDF(bearerText: string, denomination: string, commitment: string, cardType: CardType, dataUrl, noteString: string, commitmentQRCodeString, commitmentQRCodeDataUrl, network) {
    var doc = new jsPDF("l", "px", "credit-card");
    doc.setFontSize(6)
    doc.text(bearerText, 3, 6);
    doc.addImage(dataUrl, "JPEG", 1, 10, 90, 90);
    doc.setFontSize(15)
    doc.text(cardType, 101, 21);
    doc.setFontSize(10)
    doc.text(denomination, 101, 40);
    doc.setFontSize(8);
    const prevTextColor = doc.getTextColor();
    doc.setTextColor("#808080");
    doc.text("https://bunnynotes.finance", 101, 60)
    doc.setTextColor(prevTextColor);
    doc.setFontSize(2)
    doc.text(noteString, 3, 110);
    doc.addPage();
    doc.addImage(commitmentQRCodeDataUrl, "JPEG", 1, 20, 60, 60);
    doc.setFontSize(12);
    doc.text("Scan this QR code to verify", 60, 40);
    doc.text("validity without revealing", 60, 50);
    doc.text("the secret", 60, 60);
    doc.text(`Network: ${network}`,3,90);
    doc.setFontSize(2);
    doc.text(commitmentQRCodeString,3,110);
    doc.save(`BunnyNote-${denomination}-${commitment}.pdf`)
    // For testing I opened it in another window!
    // var string = doc.output('datauristring');
    // console.log(string);
    // var embed = "<embed width='100%' height='100%' src='" + string + "'/>"
    // var x = window.open() as Window;
    // x.document.open();
    // x.document.write(embed);
    // x.document.close();
}


