//@ts-ignore
import { utils } from "ffjavascript";
import { createDeposit, toNoteHex } from "./BunnyNote";
import { rbigint } from "./random";

export async function parseOwnerNote(noteString: string) {
    const noteRegex = /bunnywallet-0x(?<smartcontract>[0-9a-fA-F]{40})-(?<netId>\d+)-0x(?<deposit>[0-9a-fA-F]{124})/g
    const match = noteRegex.exec(noteString);
    if (!match) {
        throw new Error("Invalid Note!");
    }

    //@ts-ignore
    const buf = Buffer.from(match.groups.deposit, 'hex');
    const nullifier = utils.leBuff2int(buf.slice(0, 31));
    const secret = utils.leBuff2int(buf.slice(31, 62));
    const deposit = await createDeposit({ nullifier, secret });
    //@ts-ignore
    const netId = Number(match.groups.netId);
    //@ts-ignore
    return { smartcontract: match.groups.smartcontract, netId, deposit }
}

export async function createBunnyWalletNote({ smartContract, netId }: { smartContract: string, netId: number }): Promise<string> {
    const deposit = await createDeposit({ nullifier: rbigint(), secret: rbigint() });
    const note = toNoteHex(deposit.preimage, 62);
    const noteString = `bunnywallet-${smartContract}-${netId}-${note}`;
    return noteString;

}