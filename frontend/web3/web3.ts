import MetaMaskOnboarding from "@metamask/onboarding";
import { BigNumber, ethers } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { setCurrentNToSS } from "../storage/session";

export const BTTCTESTNETID = "0x405";

export const FANTOMTESTNETID = "0xfa2";

export const BSCTESTNETID = "0x61";

export const BTT_BUNNYNOTES_DONAU = "0x3bc314B9448E1E33921a9E146bFdA16639a11e4F";

export const BUNNYNOTES_BSC_TESTNET = "0xF273919f7e9239D5C8C70f49368fF80c0a91064A";

export const BUNNYNOTES_TOKENSALE_TESTNET = "0x57ca49c07328da62335Fc450176C274157C01eB6";

export const ZKBTokenAddress_BSC = "0xeE55e7A619343B2f045bfD9A720BF912e1FCfEC7"


export const tokensalePriceCalculator = (bnbAmount: string) => {
    return parseEther(bnbAmount).mul(15000);
}

export const ZEROADDRESS = "0x0000000000000000000000000000000000000000"

export function getNoteContractAddress(netId: any) {
    switch (netId) {
        case BTTCTESTNETID:
            return BTT_BUNNYNOTES_DONAU;
        case BSCTESTNETID:
            return BUNNYNOTES_BSC_TESTNET;
        default:
            return BTT_BUNNYNOTES_DONAU;
    }
}

let RELAYERURL = "https://relayer.bunnynotes.finance"

if (process.env.NODE_ENV === "development") {
    RELAYERURL = "http://localhost:3000"
}

export const BTTCTESTNETNETWORKURL = "https://pre-rpc.bt.io/";

export const FANTOMTESTNETNETWORKURL = "https://xapi.testnet.fantom.network/lachesis";

export const BSCTESTNETNETWORKURL = "https://data-seed-prebsc-1-s3.binance.org:8545";

export function getExplorer(txId: string, network: string | undefined): string {
    if (!network) {
        return "";
    }
    switch (network) {
        case BTTCTESTNETID:
            return `http://testscan.bt.io/#/transaction/${txId}`
        case FANTOMTESTNETID:
            return `https://testnet.ftmscan.com/tx/${txId}`
        case BSCTESTNETID:
            return `https://testnet.bscscan.com/address/${txId}`
        default:
            return "";
    }
}

export function getNetworkNameFromId(netId: any): string {
    switch (netId) {
        case BTTCTESTNETID:
            return "BTTC Donau Testnet"
        case FANTOMTESTNETID:
            return "Fantom Testnet"
        case BSCTESTNETID:
            return "Binance Smart Chain Testnet"
        default:
            return "INVALID"
    }
}


export function getJsonRpcProvider(network: string): any {
    switch (network) {
        case BTTCTESTNETID:
            return new ethers.providers.JsonRpcProvider(BTTCTESTNETNETWORKURL)
        case FANTOMTESTNETID:
            return new ethers.providers.JsonRpcProvider(FANTOMTESTNETNETWORKURL)
        case BSCTESTNETID:
            return new ethers.providers.JsonRpcProvider(BSCTESTNETNETWORKURL)
        default:
            return undefined;
    }
}

export function getWalletCurrencyFromFetchedChainId(chainId: number): string {
    switch (chainId) {
        case 1:
            return "ETH"
        case 0x405:
            return "BTT"
        case 0xfa2:
            return "FTM"
        case 0x61:
            return "BNB"
        default:
            return "ETH"
    }
}

export function web3Injected(): boolean {
    //@ts-ignore
    if (window.ethereum !== undefined) {
        return true;
    } else {
        return false;
    }
}

export async function getChainId(provider: any): Promise<number> {
    const { chainId } = await provider.getNetwork();
    return chainId
}

export async function getIsContract(provider: any, address: string, displayError: CallableFunction): Promise<boolean> {
    try {
        const code = await provider.getCode(address);
        if (code !== "0x") return true;
    } catch (err) {
        return false;
    }
    return false;
}

export function doOnBoarding() {
    const onboarding = new MetaMaskOnboarding();
    onboarding.startOnboarding();
}


export async function handleNetworkSelect(networkId: any, handleError: any) {
    const onboardSuccess = await onboardOrSwitchNetwork(networkId, handleError);
    if (!onboardSuccess) {
        return false;
    } else {
        const provider = getWeb3Provider();

        return provider;
    }
}



function getWeb3Provider() {
    //@ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    //@ts-ignore
    window.ethereum.on('chainChanged', (chainId) => {
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.
        setCurrentNToSS(chainId);
        window.location.reload();
    });
    return provider;
}

export function onBoardOrGetProvider(handleError: any): any {
    if (!web3Injected()) {
        handleError("You need to install metamask!");
        doOnBoarding();
        return false;
    } else {
        return getWeb3Provider()
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
        .then((success: any) => {
            if (success) {
            } else {
                onError();
            }
        })
        .catch(console.error);
}

export async function onboardOrSwitchNetwork(networkId: any, handleError: any) {
    if (!web3Injected()) {
        handleError("You need to install metamask!");
        await doOnBoarding();
        return false;
    }
    switch (networkId) {
        case BTTCTESTNETID:
            await switchToDonauTestnet();
            return true;
        case FANTOMTESTNETID:
            await switchToFantomTestnet();
            return true;
        case BSCTESTNETID:
            await switchToBSCTestnet();
            return true;
        default:
            return false;
    }
}

async function ethereumRequestAddChain(
    hexchainId: string,
    chainName: string,
    name: string,
    symbol: string,
    decimals: number,
    rpcUrls: string[],
    blockExplorerUrls: string[]) {
    //@ts-ignore
    await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
            {
                chainId: hexchainId,
                chainName,
                nativeCurrency: {
                    name,
                    symbol,
                    decimals,
                },
                rpcUrls,
                blockExplorerUrls,
            },
        ],
    });
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
        await ethereumRequestAddChain(hexchainId, chainName, "BTT", "BTT", 18, rpcUrls, blockExplorerUrls);
    }
}

export async function switchToBSCTestnet() {
    const hexChainId = BSCTESTNETID;
    const chainName = "Binance Chain Testnet";
    const rpcUrls = ["https://data-seed-prebsc-1-s3.binance.org:8545/"];
    const blockExplorerUrls = ["https://testnet.bscscan.com/"];
    const switched = await switch_to_Chain(hexChainId);
    if (!switched) {
        await ethereumRequestAddChain(hexChainId, chainName, "BNB", "BNB", 18, rpcUrls, blockExplorerUrls);
    }
}

export async function switchToFantomTestnet() {
    const hexChainId = FANTOMTESTNETID;
    const chainName = "Fantom testnet";
    const rpcUrls = ["https://xapi.testnet.fantom.network/lachesis"]
    const blockExplorerUrls = ["https://testnet.ftmscan.com/"]
    const switched = await switch_to_Chain(hexChainId);
    if (!switched) {
        await ethereumRequestAddChain(hexChainId, chainName, "FTM", "FTM", 18, rpcUrls, blockExplorerUrls)
    }
}

async function switch_to_Chain(chainId: string) {
    try {
        let errorOccured = false;
        //@ts-ignore
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId }],
        }).catch((err: any) => {
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

export async function getRpcContract(provider: any, at: string, abiPath: string): Promise<any> {
    const artifact = await fetchAbi(abiPath);
    return new ethers.Contract(at, artifact.abi, provider);
}

export async function TESTNETMINTERC20(ERC20Contract: any, mintTo: string, amount: any) {
    return await ERC20Contract.mint(mintTo, amount);
}

export async function depositETH(contract: any, commitment: string, denomination: BigNumber) {
    const fee = await calculateFee(contract, denomination);
    return await contract.depositEth(commitment, denomination, { value: denomination.add(fee) });
}

export async function depositToken(contract: any, commitment: string, denomination: BigNumber, token: string) {
    return await contract.depositToken(commitment, denomination, token);
}


export async function withdraw(contract: any, solidityProof: any, nullifierHash: string, commitment: string, recipient: string,) {
    return await contract.withdraw(solidityProof, nullifierHash, commitment, recipient);
}


export async function ERC20Approve(ERC20Contract: any, spenderContract: string, amount: any) {
    return await ERC20Contract.approve(spenderContract, amount);
}

export async function ERC20Balance(ERC20Contract: any, address: string) {
    return await ERC20Contract.balanceOf(address);
}

export async function buyTokens(contract: any, amount: string) {
    return await contract.buyTokens({ value: parseEther(amount) });
}

// View Functions

export async function bunnyNotesCommitments(contract: any, commitment: any) {
    return await contract.commitments(commitment);
}

export async function bunnyNoteIsSpent(contract: any, nullifierHash: any) {
    return await contract.isSpent(nullifierHash);
}

export async function getFeelessToken(contract: any) {
    return await contract.feelessToken();
}

export function isFeelessToken(requestedToken: string, fetchedToken: string) {
    return requestedToken.toLowerCase() === fetchedToken.toLowerCase();
}

export async function calculateFee(contract: any, denomination: BigNumber) {
    return await contract.calculateFee(denomination);
}

export async function getAllowance(contract: any, owner: string, spender: string) {
    return await contract.allowance(owner, spender).call();
}

export function calculateFeeLocally(denomination: string): string {
    // The fee is hardcoded 1% in the current smart contract so I can calculate it locally with 100
    const parsedD = parseEther(denomination);
    const fee = formatEther(parsedD.div(100));
    return fee
}

export async function tokensLeft(crowdsalecontract: any) {
    return await crowdsalecontract.getTokensLeft();
}

export interface AvailableERC20Token {
    address: string;
    name: string;
    logo: string;
}

