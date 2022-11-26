//@ts-ignore
import { BigNumber } from "ethers";
//@ts-ignore
import { utils } from "ffjavascript";
import { createDeposit, toNoteHex } from "./BunnyNote";
import { generateNullifierWithSalt } from "./generateCommitmentHash";
import { generateIsOwnerProof } from "./generateProof";
import packToSolidityProof from "./packToSolidityProof";
import { transferERC721ParamsHash, transferParamsHash } from "./ParamsHasher";
import { rbigint } from "./random";
import { Deposit } from "./types";

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

export async function createBunnyWalletNote({ smartContract, netId, deposit }: { smartContract: string, netId: number, deposit?: Deposit }): Promise<string> {
    if (!deposit) {
        deposit = await createDeposit({ nullifier: rbigint(), secret: rbigint() });
    }
    const note = toNoteHex(deposit.preimage, 62);
    const noteString = `bunnywallet-${smartContract}-${netId}-${note}`;
    return noteString;
}


export async function relayedNoteNullifierHash(nullifier: bigint) {
    const salt = rbigint();
    const newNullifierHash = generateNullifierWithSalt(nullifier, salt);
    return { salt, newNullifierHash };
}

export type TransferParamsArgs = {
    token: string,
    transferTo: string,
    transferAmount: BigNumber
}

export type TransferERC721ParamsArgs = {
    token: string,
    transferFrom: string,
    transferTo: string,
    tokenId: BigNumber
}

export enum ArgType {
    TransferParamsArgs, TransferERC721ParamsArgs
}

export async function prepareRelayProof(note: string,
    bunnyAddress: string,
    relayerAddress: string,
    argType: ArgType,
    args: any
) {
    const parsedNote = await parseOwnerNote(note)
    // A new nullifier hash is created, with random salt that makes this transaction non-replayable!!
    const { newNullifierHash, salt } = await relayedNoteNullifierHash(parsedNote.deposit.nullifier);
    let paramsHash = "";

    if (argType === ArgType.TransferParamsArgs) {
        const typedargs = args as TransferParamsArgs;
        paramsHash = await transferParamsHash(
            toNoteHex(parsedNote.deposit.commitment),
            toNoteHex(newNullifierHash),
            typedargs.token,
            typedargs.transferTo,
            typedargs.transferAmount);
    } else if (argType === ArgType.TransferERC721ParamsArgs) {
        const typedargs = args as TransferERC721ParamsArgs;
        paramsHash = await transferERC721ParamsHash(
            toNoteHex(parsedNote.deposit.commitment),
            toNoteHex(newNullifierHash),
            typedargs.token,
            typedargs.transferFrom,
            typedargs.transferTo,
            typedargs.tokenId
        )
    }

    const ownerProof = await generateIsOwnerProof({
        details: {
            secret: parsedNote.deposit.secret,
            nullifier: parsedNote.deposit.nullifier,
            nullifierHash: newNullifierHash,
            salt: salt,
            commitmentHash: parsedNote.deposit.commitment,
            smartContract: bunnyAddress,
            relayer: relayerAddress,
        }
    });
    // ownerProof public signals:     
    // [0] = commitmentHash, [1] = smartcontractwallet, [2] = relayer, [3] = nullifierHash
    const proof = packToSolidityProof(ownerProof.proof);

    return {
        proof,
        commitment: toNoteHex(ownerProof.publicSignals[0]),
        smartContract: bunnyAddress,
        relayer: relayerAddress,
        paramsHash,
        nullifierHash: toNoteHex(newNullifierHash),
    }
}