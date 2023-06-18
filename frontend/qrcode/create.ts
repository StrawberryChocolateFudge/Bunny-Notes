import { AwesomeQR } from "awesome-qr";

export async function createQR(noteString: string): Promise<any> {
    const buffer = await new AwesomeQR({
        text: noteString,
        size: 500
    }).draw();

    return buffer;
}

export function getCommitmentQRString(amount: string, currency: string, netId: string, commitment: string, nullifierHash: string) {
    return `commitment-${currency}-${amount}-${parseInt(netId)}-${commitment}-${nullifierHash}`;
}

export function getBundleRootNullifierQRString(amount: string, currency: string, netId: string, root: string, nullifierHash: string) {
    return `bundlecommitment-${currency}-${amount}-${parseInt(netId)}-${root}-${nullifierHash}`;
}

export async function commitmentQR(
    {
        amount,
        currency,
        netId,
        commitment,
        nullifierHash }: {
            amount: string,
            currency: string,
            netId: string,
            commitment: string,
            nullifierHash: string
        })
    : Promise<any> {

    const QRString = getCommitmentQRString(amount, currency, netId, commitment, nullifierHash);
    const buffer = await new AwesomeQR({
        text: QRString,
        size: 500
    }).draw();

    return { buffer, QRString };
}

export function commitmentQRStringParser(commitmentString: string) {
    const commitmentQRCodeRegex = /commitment-(?<currency>\w+)-(?<amount>[\d.]+)-(?<netId>\d+)-0x(?<commitment>[0-9a-fA-F]{64})-0x(?<nullifierHash>[0-9a-fA-F]{64})/g;
    const match = commitmentQRCodeRegex.exec(commitmentString);
    if (!match) {
        throw new Error("Invalid Note");
    }

    //@ts-ignore
    return { currency: match.groups.currency, amount: match.groups.amount, netId: Number(match.groups.netId), commitment: "0x" + match.groups.commitment, nullifierHash: "0x" + match.groups.nullifierHash }
}