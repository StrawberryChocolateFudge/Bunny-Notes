import MetaMaskOnboarding from "@metamask/onboarding";
import { BigNumber, ethers } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";

enum NetworkNames {
    BTT_TESTNET = "BTT Donau Testnet",
    BSC_TESTNET = "Binance Smart Chain Testnet",

    // Mainnets
    BTT_MAINNET = "BitTorrent Chain",
    ETH_MAINNET = "Ethereum"
}

enum NetworkTickers {
    BTT_TESTNET = "BTT",
    BSC_TESTNET = "BNB",

    // Mainnets
    ETH_MAINNET = "ETH",
    BTT_MAINNET = "BTT"
}

export enum ChainIds {
    BTT_TESTNET_ID = "0x405",
    BSC_TESTNET_ID = "0x61",

    // MAINNETS
    BTT_MAINNET_ID = "0xc7",
    ETH_MAINNET = "0x1"
}

enum BunnyNotesContractAddress {
    BTT_DONAU_TESTNET = "0x859576e721404004dab525EB2Da0865E949eA717",
    BSC_TESTNET = "0x29EbE72886d007cC4F2c3F43c9f899ab242Cc917",

    //MAINNETS:
    BTT_MAINNET = "0x3Cad43A3038F0E657753C0129ce7Ea4a5801EC90",
    ETH_MAINNET = ""
}

enum RPCURLS {
    BTT_TESTNET = "https://pre-rpc.bt.io/",
    BSC_TESTNET = "https://data-seed-prebsc-1-s3.binance.org:8545",

    // MAINNETS:
    BTT_MAINNET = "https://rpc.bittorrentchain.io",
    ETH_MAINNET = "https://eth.llamarpc.com"
}

enum EXPORERURLS {
    BTT_TESTNET = "https://testscan.bt.io/",
    BSC_TESTNET = "https://testnet.bscscan.com/",

    // Mainnets
    BTT_MAINNET = "https://bttcscan.com",
    ETH_MAINNET = "https://etherscan.io/tx/"
}

// TODO: UPDATE THIS TO START TOKENSALE ON MAINNET!

export const getCurrentTokenSold = () => FeelessTokens.BSC_TESTNET;

export const ZKBTokenSaleURL_BSC_TESTNET = "0x6d54302F99BEe568a903AcA3A58B51c91809bB78";

export const getCurrentTokenSaleAddress = () => ZKBTokenSaleURL_BSC_TESTNET;

export const getCurrentTokenSaleNetwork = () => ChainIds.BSC_TESTNET_ID;

export enum FeelessTokens {
    BTT_TESTNET = "",
    BSC_TESTNET = "0xeDc320436A3d390B65Dfc0dc868909c914F431cA", //ZKB deployed on testnet

    BTT_MAINNET = "",
    ETH_MAINNET = ""
}

const noteContractAddresses: { [key in ChainIds]: BunnyNotesContractAddress } = {
    [ChainIds.BTT_TESTNET_ID]: BunnyNotesContractAddress.BTT_DONAU_TESTNET,
    [ChainIds.BSC_TESTNET_ID]: BunnyNotesContractAddress.BSC_TESTNET,
    // Mainnets
    [ChainIds.BTT_MAINNET_ID]: BunnyNotesContractAddress.BTT_MAINNET,
    [ChainIds.ETH_MAINNET]: BunnyNotesContractAddress.ETH_MAINNET
}

const networkNameFromId: { [key in ChainIds]: NetworkNames } = {
    [ChainIds.BTT_TESTNET_ID]: NetworkNames.BTT_TESTNET,
    [ChainIds.BSC_TESTNET_ID]: NetworkNames.BSC_TESTNET,
    // Mainnets
    [ChainIds.BTT_MAINNET_ID]: NetworkNames.BTT_MAINNET,
    [ChainIds.ETH_MAINNET]: NetworkNames.ETH_MAINNET
}

const rpcUrl: { [key in ChainIds]: RPCURLS } = {
    [ChainIds.BTT_TESTNET_ID]: RPCURLS.BTT_TESTNET,
    [ChainIds.BSC_TESTNET_ID]: RPCURLS.BSC_TESTNET,

    // Mainnets
    [ChainIds.BTT_MAINNET_ID]: RPCURLS.BTT_MAINNET,
    [ChainIds.ETH_MAINNET]: RPCURLS.ETH_MAINNET
}

const explorerUrl: { [key in ChainIds]: EXPORERURLS } = {
    [ChainIds.BTT_TESTNET_ID]: EXPORERURLS.BTT_TESTNET,
    [ChainIds.BSC_TESTNET_ID]: EXPORERURLS.BSC_TESTNET,

    // Mainnets
    [ChainIds.BTT_MAINNET_ID]: EXPORERURLS.BTT_MAINNET,
    [ChainIds.ETH_MAINNET]: EXPORERURLS.ETH_MAINNET
}


const walletCurrency: { [key in ChainIds]: NetworkTickers } = {
    [ChainIds.BTT_TESTNET_ID]: NetworkTickers.BTT_TESTNET,
    [ChainIds.BSC_TESTNET_ID]: NetworkTickers.BSC_TESTNET,

    // Mainnets
    [ChainIds.BTT_MAINNET_ID]: NetworkTickers.BTT_MAINNET,
    [ChainIds.ETH_MAINNET]: NetworkTickers.ETH_MAINNET
}

export const feelessTokens: { [key in ChainIds]: FeelessTokens } = {
    [ChainIds.BTT_TESTNET_ID]: FeelessTokens.BTT_TESTNET,
    [ChainIds.BSC_TESTNET_ID]: FeelessTokens.BSC_TESTNET,

    // Mainnets
    [ChainIds.BTT_MAINNET_ID]: FeelessTokens.BTT_MAINNET,
    [ChainIds.ETH_MAINNET]: FeelessTokens.ETH_MAINNET
}


export const tokensalePriceCalculator = (bnbAmount: string) => {
    return parseEther(bnbAmount).mul(15000);
}

export const ZEROADDRESS = "0x0000000000000000000000000000000000000000"

export function getNoteContractAddress(netId: any) {
    const addr = noteContractAddresses[netId as ChainIds];
    if (!addr) {
        // falling back to testnet if the netId is not found included!
        return BunnyNotesContractAddress.BTT_DONAU_TESTNET;
    }
    return addr;
}

export function getNetworkNameFromId(netId: any): string {
    const name = networkNameFromId[netId as ChainIds];
    if (!name) {
        return "INVALID";
    }
    return name;
}


export function getJsonRpcProvider(chainId: string): any {
    const getProvider = (url: RPCURLS) => new ethers.providers.JsonRpcProvider(url);
    const url = rpcUrl[chainId as ChainIds];
    if (!url) {
        return undefined;
    }
    return getProvider(url);
}

export function getWalletCurrencyFromFetchedChainId(chainId: number): string {
    const hexchainId = "0x" + chainId.toString(16) as ChainIds;

    const currency = walletCurrency[hexchainId];

    if (!currency) {
        return NetworkTickers.ETH_MAINNET;
    }
    return currency;
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
    return switchNetworkByChainId(networkId);
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

export async function switchNetworkByChainId(netId: ChainIds) {
    const name = networkNameFromId[netId];
    if (!name) {
        // If I can't find the name, the rest will fail too
        return false;
    }
    const curr = walletCurrency[netId];
    const rpcs = [rpcUrl[netId]];
    const blockExplorerUrls = [explorerUrl[netId]]
    const switched = await switch_to_Chain(netId);

    if (!switched) {
        // If I can't switch to it, I try to add it!
        await ethereumRequestAddChain(netId, name, curr, curr, 18, rpcs, blockExplorerUrls);
    }

    return true;
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

