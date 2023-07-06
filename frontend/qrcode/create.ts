import { AwesomeQR } from "awesome-qr";
import { parseBundleNote } from "../../lib/BunnyBundle";
import { parseNote } from "../../lib/BunnyNote";

export async function createQR(noteString: string): Promise<any> {
  const buffer = await new AwesomeQR({
    text: noteString,
    size: 500,
  }).draw();

  return buffer;
}

export function getCommitmentQRString(
  amount: string,
  currency: string,
  netId: string,
  commitment: string,
  nullifierHash: string,
) {
  return `commitment-${currency}-${amount}-${
    parseInt(netId)
  }-${commitment}-${nullifierHash}`;
}

export function getBundleRootNullifierQRString(
  amount: string,
  currency: string,
  netId: string,
  root: string,
  nullifierHash: string,
) {
  return `bundlecommitment-${currency}-${amount}-${
    parseInt(netId)
  }-${root}-${nullifierHash}`;
}

export async function commitmentQR(
  {
    amount,
    currency,
    netId,
    commitment,
    nullifierHash,
  }: {
    amount: string;
    currency: string;
    netId: string;
    commitment: string;
    nullifierHash: string;
  },
): Promise<any> {
  const QRString = getCommitmentQRString(
    amount,
    currency,
    netId,
    commitment,
    nullifierHash,
  );
  const buffer = await new AwesomeQR({
    text: QRString,
    size: 500,
  }).draw();

  return { buffer, QRString };
}

export function commitmentQRStringParser(commitmentString: string) {
  const commitmentQRCodeRegex =
    /commitment-(?<currency>\w+)-(?<amount>[\d.]+)-(?<netId>\d+)-0x(?<commitment>[0-9a-fA-F]{64})-0x(?<nullifierHash>[0-9a-fA-F]{64})/g;
  const match = commitmentQRCodeRegex.exec(commitmentString);
  if (!match) {
    throw new Error("Invalid Note");
  }

  return {
    //@ts-ignore
    currency: match.groups.currency,
    //@ts-ignore
    amount: match.groups.amount,
    //@ts-ignore
    netId: Number(match.groups.netId),
    //@ts-ignore
    commitment: "0x" + match.groups.commitment,
    //@ts-ignore
    nullifierHash: "0x" + match.groups.nullifierHash,
  };
}

export function bundleRootNullifierQRStringParser(rootNullifier: string) {
  const regex =
    /bundlecommitment-(?<currency>\w+)-(?<amount>[\d.]+)-(?<netId>\d+)-0x(?<root>[0-9a-fA-F]{64})-0x(?<nullifierHash>[0-9a-fA-F]{64})/g;
  const match = regex.exec(rootNullifier);
  if (!match) {
    throw new Error("Invalid bundle");
  }

  return {
    //@ts-ignore
    currency: match.groups.currency,
    //@ts-ignore
    amount: match.groups.amount,
    //@ts-ignore
    netId: match.groups.netId,
    //@ts-ignore
    root: match.groups.root,
    //@ts-ignore
    nullifierHash: match.groups.nullifierHash,
  };
}

export async function rootEncodingForVerification(
  root: string,
  network: string,
  currency: string,
  totalValue: string,
  size: number,
) {
  return `bundleroot-${root}-${
    Number(network)
  }-${currency}-${totalValue}-${size}`;
}

export async function verifyEncodedRoot(encodedRoot: string) {
  const rootRegex =
    /bundleroot-0x(?<root>[0-9a-fA-F]{64})-(?<netId>\d+)-(?<currency>\w+)-(?<totalValue>[\d.]+)-(?<size>[\d.]+)/g;
  const match = rootRegex.exec(encodedRoot);
  if (!match) {
    throw new Error("Invalid Root format");
  }
  //@ts-ignore
  const root = match?.groups.root;
  //@ts-ignore
  const netId = Number(match?.groups.netId);

  return {
    root: "0x" + root,
    netId,
    //@ts-ignore
    currency: match.groups.currency,
    //@ts-ignore
    totalValue: match.groups.totalValue,
    //@ts-ignore
    size: Number(match.groups.size),
  };
}

// I need to evaluate the kind of qrcode before I parse it
// 1. bunnynote
// 2. commitment
// 3. bundleroot
// 4. bunnybundle
// 5. bundlecommitment

function checkIfStringStartsWith(toCheck: string, str: string): boolean {
  return toCheck.startsWith(str);
}

export function getQrType(qrString: string) {
  const isBunnyNote = checkIfStringStartsWith(qrString, "bunnynote");

  if (isBunnyNote) {
    return "bunnynote";
  }

  const isCommitment = checkIfStringStartsWith(qrString, "commitment");
  if (isCommitment) {
    return "commitment";
  }

  const isBundleRoot = checkIfStringStartsWith(qrString, "bundleroot");
  if (isBundleRoot) {
    return "bundleroot";
  }

  const isBunnyBundle = checkIfStringStartsWith(qrString, "bunnybundle");

  if (isBunnyBundle) {
    return "bunnybundle";
  }

  const isBundleCommitment = checkIfStringStartsWith(
    qrString,
    "bundlecommitment",
  );

  if (isBundleCommitment) {
    return "bundlecommitment";
  }

  return "invalid";
}

export const evalQRCodeType = async (qrString: string) => {
  try {
    switch (getQrType(qrString)) {
      case "bunnynote":
        return { type: "cryptoNote", code: await parseNote(qrString), err: "" };
      case "commitment":
        return {
          type: "commitmentQR",
          code: commitmentQRStringParser(qrString),
          err: "",
        };
      case "bundleroot":
        return {
          type: "bundleroot",
          code: await verifyEncodedRoot(qrString),
          err: "",
        };
      case "bunnybundle":
        return {
          type: "bundlenote",
          code: await parseBundleNote(qrString),
          err: "",
        };
      case "bundlecommitment":
        return {
          type: "bundlenoteNullifier",
          code: bundleRootNullifierQRStringParser(qrString),
          err: "",
        };
      case "invalid":
        return { type: "invalid", code: "", err: "Invalid code" };
      default:
        return { type: "invalid", code: "", err: "Invalid code" };
    }
  } catch (err: any) {
    return { type: "invalid", code: "", err: err.message };
  }
};

export const checkIsBundle = (type: string) => {
  if (
    type === "bundleroot" || type === "bundlenote" ||
    type === "bundlenoteNullifier"
  ) {
    return true;
  } else {
    return false;
  }
};
