import { jsPDF } from "jspdf";
import { CardType } from "../components/CardGrid";
export function downloadPDF(bearerText: string, denomination: string, commitment: string, cardType: CardType, dataUrl, noteString: string) {
    var doc = new jsPDF("l", "px", "credit-card");
    doc.setFontSize(6)
    doc.text(bearerText, 16, 25);
    doc.addImage(dataUrl, "JPEG", 15, 32, 40, 40);
    doc.setFontSize(10)
    doc.text("Bunny Note", 70, 40)
    doc.text(`${denomination} ${cardType}`, 70, 55)
    doc.setFontSize(6)
    doc.text("bunnynotes.finance", 70, 70)
    doc.setFontSize(2)
    doc.text(noteString, 16, 85)
    doc.save(`BunnyNote-${denomination}-${cardType}-${commitment}.pdf`)

}