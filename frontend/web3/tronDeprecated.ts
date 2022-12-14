//@ts-nocheck

// I am currently not checking this file with typescript because tronWeb from tronLink is JS

const TRONLINKURL = "https://www.tronlink.org/"
export const USDTMCONTRACTADDRESS = "TEfemFon6U3xS8twSVNqbhJxVVzZ7jwVs2";
export const USDTM100ADDRESS = "TWpr6tsT6zCBFKiq18CzKGmPzfSpP1ijyw";
const feeLimit = 100_000_000;
const callValue = 0;
const shouldPollResponse = true;

const fullNode = 'https://api.shasta.trongrid.io';
const solidityNode = 'https://api.shasta.trongrid.io';
const eventServer = 'https://api.shasta.trongrid.io';

export function tronLinkExists(): boolean {
    return window.tronLink !== undefined;
}

export function getWindowTronWeb(): any {
    const HttpProvider = window.TronWeb.providers.HttpProvider;
    const tronWeb = new window.TronWeb({ fullNode: new HttpProvider(fullNode), solidityNode: new HttpProvider(solidityNode), eventServer: new HttpProvider(eventServer) });
    return tronWeb;
}

export function onboardTronLink(): void {
    window.open(TRONLINKURL, '_blank');
}

export async function getTronWeb() {
    let tronWeb = null;
    if (window.tronLink.ready) {
        tronWeb = tronLink.tronWeb;
    } else {
        const res = await tronLink.request({ method: 'tron_requestAccounts' });
        if (res.code === 200) {
            tronWeb = tronLink.tronWeb;
        }
    }
    return tronWeb;
}

export async function addAssetToWallet(tronWeb: any, address: string) {
    var tx = await tronWeb.request({
        method: 'wallet_watchAsset',
        params: {
            type: 'erc20',
            options: { address },
        },
    })
}

export async function onBoardOrGetTronWeb(handleError): any {
    if (!tronLinkExists()) {
        onboardTronLink();
    } else {
        let tronWeb = await getTronWeb();
        if (!tronWeb) {
            handleError("Unable to connect! Make sure to login to the extension!");
            return tronWeb
        } else {
            return tronWeb;
        }
    }
}

export function verifyAddress(addr): boolean {
    return window.TronWeb.isAddress(addr);
}

// State change

export async function getContract(tronWeb: any, at: string): any {
    return await tronWeb.contract().at(at);
}

export async function ERC20Approve(ERC20Contract: any, spenderContract: string, amount: any) {
    return await ERC20Contract.approve(spenderContract, amount).send({
        feeLimit,
        callValue,
        shouldPollResponse
    })
}

export async function TESTNETMINTERC20(ERC20Contract: any, mintTo: string, amount: any) {
    return await ERC20Contract.mint(mintTo, amount).send({ feeLimit, callValue, shouldPollResponse })
}

export async function bunnyNotesDeposit(contract: any, commitment: string, isCashNote: boolean, depositFor: string) {
    return await contract.deposit(commitment, isCashNote, depositFor).send({ feeLimit, callValue, shouldPollResponse })
}

export async function bunnyNotesWithdrawGiftCard(contract: any, solidityProof: any, nullifierHash: string, commitment: string, recepient: string, change: string) {
    return await contract.withdrawGiftCard(solidityProof, nullifierHash, commitment, recepient, change).send({ feeLimit, callValue, shouldPollResponse });
}

export async function bunnyNotesWithdrawCashNote(contract: any, solidityProof: any, nullifierHash: string, commitment: string, recepient: string, change: string) {
    return await contract.withdrawCashNote(solidityProof, nullifierHash, commitment, recepient, change).send({ feeLimit, callValue, shouldPollResponse })
}

// View functions

export async function bunnyNotesCommitments(contract: any, commitment) {
    return await contract.commitments(commitment).call();
}

export async function bunnyNoteIsSpent(contract: any, nullifierHash: any) {
    return await contract.isSpent(nullifierHash).call();
}

export async function bunnyNoteIsSpentArray(contract: any, nullifierHashesArray: Array<string>) {
    return await contract.isSpent(nullifierHashesArray).call();
}

export async function getFee(contract: any) {
    return await contract.fee().call();
}

export function getContractAddressFromCurrencyDenomination(denomination: string, currency: string): string {
    if (denomination === "100" && currency === "USDTM") {
        return USDTM100ADDRESS;
    }
}


export async function getAllowance(contract: any, owner: string, spender: string) {
    return await contract.allowance(owner, spender).call();
}