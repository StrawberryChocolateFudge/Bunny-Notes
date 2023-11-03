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
    description?: string


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
        cardType: "Bunny Note" as "Bunny Note",
        description: input.description ? input.description : ""
    }
    return tokenData;
}

// TODO: I want to add a description field to the card props data
// and also store the tokens in arrays and .map over them when I return them!

const tokenData: { [key in ChainIds]: SimplifiedTokenDataInput[] } = {
    [ChainIds.BTT_TESTNET_ID]: [
        { isCustom: true, imageLink: "/imgs/questionMark.png", currency: "Custom Token", erc20Address: "" },
        { imageLink: "/imgs/bttLogo.svg", currency: "BTT", erc20Address: ZEROADDRESS, description: "BTT is the native coin of BitTorrent Chain" },
        // These are example tokens without any address so approving them will just not work:

        { networkAlt: ETH_A, networkLogo: ETH_N, imageLink: "/imgs/ethLogo.svg", currency: "ETH", erc20Address: "", description: "This token is bridged from Ethereum via the BitTorrent Bridge" },
        { networkAlt: BSC_A, networkLogo: BSC_N, imageLink: "/imgs/btcLogo.svg", currency: "BTC_b", erc20Address: "", description: "The Bitcoins are bridged from Binance Smart Chain via the BitTorrent Bridge!" },
        { networkAlt: TRON_A, networkLogo: TRON_N, imageLink: "/imgs/usddLogo.svg", currency: "USDD_t", erc20Address: "", description: "USDD is bridged from Tron via the BitTorrent Bridge" },
        { networkAlt: ETH_A, networkLogo: ETH_N, imageLink: "/imgs/tetherLogo.svg", currency: "USDT_t", erc20Address: "", description: "USD Tether bridged from Ethereum via the BitTorrent Bridge" }
    ],
    [ChainIds.BSC_TESTNET_ID]: [
        { isCustom: true, imageLink: "/imgs/questionMark.png", currency: "Custom Token", erc20Address: "" },
        { imageLink: "/imgs/bnb-chain-binance-smart-chain-logo.svg", currency: "BNB", erc20Address: ZEROADDRESS },
        { isFeeless: true, imageLink: "/imgs/BunnyNotesCircle.png", currency: "ZKB", erc20Address: FeelessTokens.BSC_TESTNET }

    ],
    [ChainIds.BTT_MAINNET_ID]: [
        { isCustom: true, imageLink: "/imgs/questionMark.png", currency: "Custom Token", erc20Address: "" },
        { imageLink: "/imgs/bttLogo.svg", currency: "BTT", erc20Address: ZEROADDRESS, description: "BTT is the native coin of BitTorrent Chain" },
        { networkAlt: ETH_A, networkLogo: ETH_N, imageLink: "/imgs/ethLogo.svg", currency: "ETH", erc20Address: "0x1249C65AfB11D179FFB3CE7D4eEDd1D9b98AD006", description: "This ETH token is bridged from Ethereum via the BitTorrent Bridge" },
        { networkAlt: BSC_A, networkLogo: BSC_N, imageLink: "/imgs/btcLogo.svg", currency: "BTC_b", erc20Address: "0x1A7019909B10cdD2D8B0034293AD729f1C1F604e", description: "The Bitcoins are bridged from Binanace Smart Chain via the BitTorrent Bridge" },
        { networkAlt: TRON_A, networkLogo: TRON_N, imageLink: "/imgs/usddLogo.svg", currency: "USDD_t", erc20Address: "0x17F235FD5974318E4E2a5e37919a209f7c37A6d1", description: "USDD is bridged from Tron via the BitTorrent Bridge" },
        { networkAlt: ETH_A, networkLogo: ETH_N, imageLink: "/imgs/tetherLogo.svg", currency: "USDT_e", erc20Address: "0xE887512ab8BC60BcC9224e1c3b5Be68E26048B8B", description: "USDT bridged from Ethereum via the BitTorrent Bridge" }

    ],
    [ChainIds.BSC_MAINNET]: [
        { isCustom: true, imageLink: "/imgs/questionMark.png", currency: "Custom Token", erc20Address: "" },
        { imageLink: "/imgs/bnb-chain-binance-smart-chain-logo.svg", currency: "BNB", erc20Address: ZEROADDRESS, description: "BNB is the native coin of Binance Smart Chain" },
        { isFeeless: true, imageLink: "/imgs/BunnyNotesCircle.png", currency: "ZKB", erc20Address: FeelessTokens.BSC_MAINNET, description: "ZKB tokens were created to transfer and store value. You can use these tokens without fees on BSC" },
        { imageLink: "/imgs/binance-usd-busd-logo.svg", currency: "BUSD", erc20Address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", description: "Binance-Peg BUSD Stablecoin" },
        { imageLink: "/imgs/btcLogo.svg", currency: "BTCB", erc20Address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c", description: "Binance-Peg Bitcoin" },
        { imageLink: "/imgs/multi-collateral-dai-dai-logo.svg", currency: "DAI", erc20Address: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3", description: "Binance Peg DAI Stablecoin" },

    ],
    [ChainIds.POLYGON_MAINNET]: [
        { isCustom: true, imageLink: "/imgs/questionMark.png", currency: "Custom Token", erc20Address: "" },
        { imageLink: "/imgs/polygon-matic-logo.svg", currency: "MATIC", erc20Address: ZEROADDRESS, description: "Matic is the native coin of the Polygon POS Chain" },
        { imageLink: "/imgs/uniswap-uni-logo.svg", currency: "UNI", erc20Address: "0xb33EaAd8d922B1083446DC23f610c2567fB5180f", description: "Uniswap on Polygon" },
        { imageLink: "/imgs/weth-62277139.png", currency: "WETH", erc20Address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", description: "Wrapped Ether" }

    ],
    [ChainIds.ETH_MAINNET]: []
}



export function getCardPropsData(cardType: "Bunny Note", netId: string): Array<SelectableCardsParams> {
    const propsData = tokenData[netId];
    if (propsData === undefined) {
        return [];
    }
    return propsData.map(t => getTokenData(t));
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
    {
        tooltipTitle: "Select Polygon network",
        chainId: ChainIds.POLYGON_MAINNET,
        imageAlt: "Polygon Mainnet",
        imageSrc: "/imgs/polygon-matic-logo.svg",
        cardTypography: "Polygon Network"
    }
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
