import { Deposit } from "./types"
//@ts-ignore
import { utils } from "ffjavascript";
import { generateCommitmentHash, generateNullifierHash } from "./generateCommitmentHash";
import bigInt from "big-integer";
import { rbigint } from "./random";
/**
 * Create deposit object from secret and nullifier
 */
export async function createDeposit({ nullifier, secret }: { nullifier: bigint, secret: bigint }) {
    const deposit: Deposit = {
        nullifier,
        secret,
        preimage: Buffer.concat([utils.leInt2Buff(nullifier, 31), utils.leInt2Buff(secret, 31)]),
        commitment: await generateCommitmentHash(nullifier, secret),
        nullifierHash: await generateNullifierHash(nullifier)
    }
    return deposit
}

/** BigNumber to hex string of specified length */
export function toNoteHex(number: Buffer | any, length = 32) {
    const str = number instanceof Buffer ? number.toString('hex') : bigInt(number).toString(16)
    return '0x' + str.padStart(length * 2, '0')
}

export async function deposit({ currency, amount, netId }: { currency: string, amount: number, netId: number }): Promise<string> {
    const deposit = await createDeposit({ nullifier: rbigint(), secret: rbigint() });
    const note = toNoteHex(deposit.preimage, 62);
    const noteString = `bunnynote-${currency}-${amount}-${netId}-${note}`
    return noteString;
}

export async function parseNote(noteString: string) {
    const noteRegex = /bunnynote-(?<currency>\w+)-(?<amount>[\d.]+)-(?<netId>\d+)-0x(?<note>[0-9a-fA-F]{124})/g
    const match = noteRegex.exec(noteString);
    if (!match) {
        throw new Error("Invalid Note!")
    }
    //@ts-ignore
    const buf = Buffer.from(match.groups.note, 'hex');
    const nullifier = utils.leBuff2int(buf.slice(0, 31));
    const secret = utils.leBuff2int(buf.slice(31, 62));
    const deposit = await createDeposit({ nullifier, secret });
    //@ts-ignore
    const netId = Number(match.groups.netId);
    //@ts-ignore
    return { currency: match.groups.currency, amount: match.groups.amount, netId, deposit }
}