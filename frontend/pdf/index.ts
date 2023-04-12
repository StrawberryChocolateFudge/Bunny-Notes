import { jsPDF } from "jspdf";
import { CardType } from "../components/CardGrid";

export async function downloadPDF(bearerText: string, denomination: string, commitment: string, cardType: CardType, dataUrl, noteString: string, commitmentQRCodeDataUrl) {
    var doc = new jsPDF("l", "px", "credit-card");
    doc.setFontSize(7)
    doc.text(bearerText, 3, 6);
    doc.addImage(dataUrl, "JPEG", 1, 10, 90, 90);
    doc.setFontSize(12)
    doc.text(cardType, 101, 21);
    doc.setFontSize(20)
    doc.text(denomination, 100, 40);
    doc.setFontSize(10);
    doc.text("bunnynotes.finance", 102, 60)
    doc.setFontSize(2)
    doc.text(noteString, 3, 110);
    doc.addPage();
    doc.addImage(commitmentQRCodeDataUrl, "JPEG", 1, 20, 60, 60);
    doc.setFontSize(12);
    doc.text("Scan this QR code to verify", 60, 40);
    doc.text("validity without revealing", 60, 50);
    doc.text("the secret", 60, 60)
    doc.save(`BunnyNote-${denomination}-${commitment}.pdf`)
    // For testing I opened it in another window!
    // var string = doc.output('datauristring');
    // var embed = "<embed width='100%' height='100%' src='" + string + "'/>"
    // var x = window.open() as Window;
    // x.document.open();
    // x.document.write(embed);
    // x.document.close();
}


