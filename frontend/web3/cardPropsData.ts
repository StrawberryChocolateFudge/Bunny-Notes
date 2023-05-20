import { ChainIds, FeelessTokens, ZEROADDRESS } from "./web3";
import { SelectableCardsParams } from "../components/SelectableCards";


const BSC_N = "/imgs/bsc-networkLogo.png";
const BSC_A = "BSC";
const TRON_N = "/imgs/tron-NetworkLogo.svg";
const TRON_A = "Tron";
const ETH_N = "/imgs/eth_netwrokLogo.png";
const ETH_A = "ETH";

type SimplifiedTokenDataInput = {
    networkLogo?: string;
    networkAlt?: string;
    imageLink: string;
    currency: string;
    erc20Address: string,
    isCustom?: boolean,
    isFeeless?: boolean,


}

function getTokenData(input: SimplifiedTokenDataInput): SelectableCardsParams {
    const tokenData = {
        networkLogo: input.networkLogo ? input.networkLogo : "",
        networkAlt: input.networkAlt ? input.networkAlt : "",
        imageLink: input.imageLink,
        currency: input.currency,
        imageAlt: input.currency,
        erc20Address: input.erc20Address,
        isCustom: input.isCustom ? input.isCustom : false,
        isFeeless: input.isFeeless ? input.isFeeless : false,
        cardType: "Bunny Note" as "Bunny Note"
    }
    return tokenData;
}

export function getCardPropsData(cardType: "Bunny Note", netId: string): Array<SelectableCardsParams> {
    switch (netId as ChainIds) {

        // The first 2 are testnets!
        //##############################################
        case ChainIds.BTT_TESTNET_ID:
            return [
                getTokenData({ isCustom: true, imageLink: "/imgs/questionMark.png", currency: "Custom Token", erc20Address: "" }),
                getTokenData({ imageLink: "/imgs/bttLogo.svg", currency: "BTT", erc20Address: ZEROADDRESS }),
                // These are example tokens without any address so approving them will just not work:
                getTokenData({ networkAlt: ETH_A, networkLogo: ETH_N, imageLink: "/imgs/ethLogo.svg", currency: "ETH", erc20Address: "" }),
                getTokenData({ networkAlt: BSC_A, networkLogo: BSC_N, imageLink: "/imgs/btcLogo.svg", currency: "BTC_b", erc20Address: "" }),
                getTokenData({ networkAlt: TRON_A, networkLogo: TRON_N, imageLink: "/imgs/usddLogo.svg", currency: "USDD_t", erc20Address: "" }),
                getTokenData({ networkAlt: ETH_A, networkLogo: ETH_N, imageLink: "/imgs/tetherLogo.svg", currency: "USDT_t", erc20Address: "" }),
            ]
        case ChainIds.BSC_TESTNET_ID:
            return [
                getTokenData({ isCustom: true, imageLink: "/imgs/questionMark.png", currency: "Custom Token", erc20Address: "" }),
                getTokenData({ imageLink: "/imgs/bnb-chain-binance-smart-chain-logo.svg", currency: "BNB", erc20Address: ZEROADDRESS }),
                getTokenData({ isFeeless: true, imageLink: "/imgs/BunnyNotesCircle.png", currency: "ZKB", erc20Address: FeelessTokens.BSC_TESTNET }),
            ]
        //##############################################
        // MAINNETS!!

        case ChainIds.BTT_MAINNET_ID:
            return [
                getTokenData({ isCustom: true, imageLink: "/imgs/questionMark.png", currency: "Custom Token", erc20Address: "" }),
                getTokenData({ imageLink: "/imgs/bttLogo.svg", currency: "BTT", erc20Address: ZEROADDRESS }),
                getTokenData({ networkAlt: ETH_A, networkLogo: ETH_N, imageLink: "/imgs/ethLogo.svg", currency: "ETH", erc20Address: "0x1249C65AfB11D179FFB3CE7D4eEDd1D9b98AD006" }),
                getTokenData({ networkAlt: BSC_A, networkLogo: BSC_N, imageLink: "/imgs/btcLogo.svg", currency: "BTC_b", erc20Address: "0x1A7019909B10cdD2D8B0034293AD729f1C1F604e" }),
                getTokenData({ networkAlt: TRON_A, networkLogo: TRON_N, imageLink: "/imgs/usddLogo.svg", currency: "USDD_t", erc20Address: "0x17F235FD5974318E4E2a5e37919a209f7c37A6d1" }),
                getTokenData({ networkAlt: ETH_A, networkLogo: ETH_N, imageLink: "/imgs/tetherLogo.svg", currency: "USDT_e", erc20Address: "0xE887512ab8BC60BcC9224e1c3b5Be68E26048B8B" }),

            ]
        case ChainIds.BSC_MAINNET:
            return [
                getTokenData({ isCustom: true, imageLink: "/imgs/questionMark.png", currency: "Custom Token", erc20Address: "" }),
                getTokenData({ imageLink: "/imgs/bnb-chain-binance-smart-chain-logo.svg", currency: "BNB", erc20Address: ZEROADDRESS }),
                getTokenData({ isFeeless: true, imageLink: "/imgs/BunnyNotesCircle.png", currency: "ZKB", erc20Address: FeelessTokens.BSC_MAINNET }),
                getTokenData({ imageLink: "/imgs/binance-usd-busd-logo.svg", currency: "BUSD", erc20Address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56" }),
                getTokenData({ imageLink: "/imgs/btcLogo.svg", currency: "BTCB", erc20Address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c" }),
                getTokenData({ imageLink: "/imgs/multi-collateral-dai-dai-logo.svg", currency: "DAI", erc20Address: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3" })
            ]
        // Add more chains here!
        default:
            return []
    }
}


export type NetworkSelectProps = {
    tooltipTitle: string,
    chainId: string,
    imageAlt: string,
    imageSrc: string,
    cardTypography: string,
}

export function networkbuttonWhere(chainId) {
    return networkButtons.filter(btn => btn.chainId === chainId)[0]
}

export const networkButtons: NetworkSelectProps[] = [
    {
        tooltipTitle: "Select BSC",
        chainId: ChainIds.BSC_MAINNET,
        imageAlt: "Binance Smart Chain",
        imageSrc: "/imgs/bnb-chain-binance-smart-chain-logo.svg",
        cardTypography: "Binance Smart Chain"
    },
    {
        tooltipTitle: "Select BitTorrent Chain",
        chainId: ChainIds.BTT_MAINNET_ID,
        imageAlt: "Bittorrent Chain",
        imageSrc: "/imgs/bttLogo.svg",
        cardTypography: "BitTorrent Chain"
    },
    // {
    //     tooltipTitle: "Select Binance Smart Chain Testnet",
    //     chainId: ChainIds.BSC_TESTNET_ID,
    //     imageAlt: "Binance Smart Chain",
    //     imageSrc: "/imgs/bnb-chain-binance-smart-chain-logo.svg",
    //     cardTypography: "Binance Smart Chain Testnet"
    // }
    // ,
    // {
    //     tooltipTitle: "Select Bittorrent Chain Testnet",
    //     chainId: ChainIds.BTT_TESTNET_ID,
    //     imageAlt: "Bittorrent Testnet",
    //     imageSrc: "/imgs/bttLogo.svg",
    //     cardTypography: "BitTorrent Testnet"
    // }
]   
