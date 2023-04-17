import { AwesomeQR } from "awesome-qr";

export async function createQR(noteString: string): Promise<any> {
    const buffer = await new AwesomeQR({
        text: noteString,
        size: 500
    }).draw();

    return buffer;
}

export function getCommitmentQRString(amount: string, currency: string, commitment: string, nullifierHash: string) {
    return `commitment-${currency}-${amount}-${commitment}-${nullifierHash}`;
}

export async function commitmentQR({ amount, currency, commitment, nullifierHash }: { amount: string, currency: string, commitment: string, nullifierHash: string }): Promise<any> {

    const QRString = getCommitmentQRString(amount, currency, commitment, nullifierHash);
    const buffer = await new AwesomeQR({
        text: QRString,
        size: 500
    }).draw();

    return { buffer,QRString };
}

export function commitmentQRStringParser(commitmentString: string) {
    const commitmentQRCodeRegex = /commitment-(?<currency>\w+)-(?<amount>[\d.]+)-0x(?<commitment>[0-9a-fA-F]{64})-0x(?<nullifierHash>[0-9a-fA-F]{64})/g;
    const match = commitmentQRCodeRegex.exec(commitmentString);
    if (!match) {
        throw new Error("Invalid Commitment QR Code");
    }

    //@ts-ignore
    return { currency: match.groups.currency, amount: match.groups.amount, commitment: "0x" + match.groups.commitment, nullifierHash: "0x" + match.groups.nullifierHash }
}