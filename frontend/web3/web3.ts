import MetaMaskOnboarding from "@metamask/onboarding";
import { ethers } from "ethers";

export const MAXCASHNOTESIZE = 100;

export const USDTMCONTRACTADDRESS_DOTNAU = "0xeE55e7A619343B2f045bfD9A720BF912e1FCfEC7";
export const USDTM100ADDRESS_DOTNAU = "0xF273919f7e9239D5C8C70f49368fF80c0a91064A";


export function web3Injected(): boolean {
    //@ts-ignore
    if (window.ethereum) {
        return true;
    } else {
        return false;
    }
}

export function doOnBoarding() {
    const onboarding = new MetaMaskOnboarding();
    onboarding.startOnboarding();
}


export function onBoardOrGetProvider(handleError): any {
    if (!web3Injected()) {
        handleError("You need to install metamask!");
        doOnBoarding();
        return false;
    } else {
        //@ts-ignore
        return new ethers.providers.Web3Provider(window.ethereum);
    }
}

export async function requestAccounts(provider: any) {
    const accounts = await provider.send("eth_requestAccounts", []);
    return accounts[0]
}

export async function watchAsset(erc20Params: any, onError: any) {
    //@ts-ignore
    await window.ethereum
        .request({
            method: "wallet_watchAsset",
            params: {
                type: "ERC20",
                options: {
                    address: erc20Params.address,
                    symbol: erc20Params.symbol,
                    decimals: erc20Params.decimals,
                },
            },
        })
        .then((success) => {
            if (success) {
            } else {
                onError();
            }
        })
        .catch(console.error);
}

export async function onboardOrSwitchNetwork(handleError) {
    if (!web3Injected()) {
        handleError("You need to install metamask!");
        await doOnBoarding();
    }
    await switchToDonauTestnet()
}

export async function switchToDonauTestnet() {
    const chainId = 1029;
    const hexchainId = "0x" + chainId.toString(16);
    const chainName = "BTT Donau testnet"
    const rpcUrls = ["https://pre-rpc.bt.io/"];
    const blockExplorerUrls = ["https://testscan.bt.io/"];
    const switched = await switch_to_Chain(hexchainId);
    if (!switched) {
        // If I cannot switch to it I try to add it!

        //@ts-ignore
        await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
                {
                    chainId: hexchainId,
                    chainName,
                    nativeCurrency: {
                        name: "BTT",
                        symbol: "BTT",
                        decimals: 18,
                    },
                    rpcUrls,
                    blockExplorerUrls,
                },
            ],
        });
    }
}

async function switch_to_Chain(chainId: string) {
    try {
        let errorOccured = false;
        //@ts-ignore
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId }],
        }).catch(err => {
            if (err.message !== "User rejected the request.")
                errorOccured = true;
        })
        if (errorOccured) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        return false;
    }
}

export async function fetchAbi(at: string) {
    const res = await fetch(at);
    return res.json();
}

export async function getContract(provider: any, at: string, abiPath: string): Promise<any> {
    const artifact = await fetchAbi(abiPath);
    const signer = provider.getSigner();
    return new ethers.Contract(at, artifact.abi, signer);
}

export async function TESTNETMINTERC20(ERC20Contract: any, mintTo: string, amount: any) {
    return await ERC20Contract.mint(mintTo, amount);
}

export async function bunnyNotesDeposit(contract: any, commitment: string, isCashNote: boolean, depositFor: string) {
    return await contract.deposit(commitment, isCashNote, depositFor);
}

export async function bunnyNotesWithdrawGiftCard(contract: any, solidityProof: any, nullifierHash: string, commitment: string, recepient: string, change: string) {
    return await contract.withdrawGiftCard(solidityProof, nullifierHash, commitment, recepient, change);
}

export async function bunnyNotesWithdrawCashNote(contract: any, solidityProof: any, nullifierHash: string, commitment: string, recepient: string, change: string) {
    return await contract.withdrawCashNote(solidityProof, nullifierHash, commitment, recepient, change);
}

export async function ERC20Approve(ERC20Contract: any, spenderContract: string, amount: any) {
    return await ERC20Contract.approve(spenderContract, amount);
}

// View Functions

export async function bunnyNotesCommitments(contract: any, commitment) {
    return await contract.commitments(commitment);
}

export async function bunnyNoteIsSpent(contract: any, nullifierHash: any) {
    return await contract.isSpent(nullifierHash);
}

export async function bunnyNoteIsSpentArray(contract: any, nullifierHashesArray: Array<string>) {
    return await contract.isSpent(nullifierHashesArray);
}

export async function getFee(contract: any) {
    return await contract.fee();
}

export function getContractAddressFromCurrencyDenomination(denomination: string, currency: string): string {
    if (denomination === "100" && currency === "USDTM") {
        return USDTM100ADDRESS_DOTNAU;
    } else return ""
}

export async function getAllowance(contract: any, owner: string, spender: string) {
    return await contract.allowance(owner, spender).call();
}