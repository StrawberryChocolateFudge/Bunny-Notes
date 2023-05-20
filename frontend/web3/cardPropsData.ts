import { ChainIds, FeelessTokens, ZEROADDRESS } from "./web3";
import { SelectableCardsParams } from "../components/SelectableCards";


const BSC_N = "/imgs/bsc-networkLogo.png";
const BSC_A = "BSC";
const TRON_N = "/imgs/tron-NetworkLogo.svg";
const TRON_A = "Tron";
const ETH_N = "/imgs/eth_netwrokLogo.png";
const ETH_A = "ETH";


export function getCardPropsData(cardType: "Bunny Note", netId: string): Array<SelectableCardsParams> {
    switch (netId as ChainIds) {

        // The first 2 are testnets!
        //##############################################
        case ChainIds.BTT_TESTNET_ID:
            return [
                { isFeeless: false, isCustom: true, networkAlt: "", networkLogo: "", imageLink: "/imgs/questionMark.png", imageAlt: "Custom Token", currency: "Custom Token", cardType, erc20Address: "", },
                { isFeeless: false, isCustom: false, networkAlt: "", networkLogo: "", imageLink: "/imgs/bttLogo.svg", imageAlt: "BTT", currency: "BTT", cardType, erc20Address: ZEROADDRESS },

                // These are example tokens without any address so approving them will just not work:
                { isFeeless: false, isCustom: false, networkAlt: ETH_A, networkLogo: ETH_N, imageLink: "/imgs/ethLogo.svg", imageAlt: "ETH", currency: "ETH", cardType, erc20Address: "" },
                { isFeeless: false, isCustom: false, networkAlt: BSC_A, networkLogo: BSC_N, imageLink: "/imgs/btcLogo.svg", imageAlt: "BTC_b", currency: "BTC_b", cardType, erc20Address: "" },
                { isFeeless: false, isCustom: false, networkAlt: TRON_A, networkLogo: TRON_N, imageLink: "/imgs/usddLogo.svg", imageAlt: "USDD_t", currency: "USDD_t", cardType, erc20Address: "" },
                { isFeeless: false, isCustom: false, networkAlt: ETH_A, networkLogo: ETH_N, imageLink: "/imgs/tetherLogo.svg", imageAlt: "USDT_t", currency: "USDT_t", cardType, erc20Address: "" }
                // { isFeeless: true, isCustom: false, networkAlt: BSC_A, networkLogo: BSC_N, imageLink: "/imgs/BunnyLogo.jpg", imageAlt: "ZKB", currency: "ZKB", cardType, erc20Address: BTTZKB, },
            ]
        case ChainIds.BSC_TESTNET_ID:
            return [
                { isFeeless: false, isCustom: true, networkAlt: "", networkLogo: "", imageLink: "/imgs/questionMark.png", imageAlt: "Custom Token", currency: "Custom Token", cardType, erc20Address: "", },
                { isFeeless: false, isCustom: false, networkAlt: "", networkLogo: "", imageLink: "/imgs/bnb-chain-binance-smart-chain-logo.svg", imageAlt: "BNB", currency: "BNB", cardType, erc20Address: ZEROADDRESS },
                { isFeeless: true, isCustom: false, networkAlt: "", networkLogo: "", imageLink: "/imgs/BunnyNotesCircle.png", imageAlt: "ZKB", currency: "ZKB", cardType, erc20Address: FeelessTokens.BSC_TESTNET, },
            ]
        //##############################################
        // MAINNETS!!

        case ChainIds.BTT_MAINNET_ID:
            return [
                { isFeeless: false, isCustom: true, networkAlt: "", networkLogo: "", imageLink: "/imgs/questionMark.png", imageAlt: "Custom Token", currency: "Custom Token", cardType, erc20Address: "", },
                { isFeeless: false, isCustom: false, networkAlt: "", networkLogo: "", imageLink: "/imgs/bttLogo.svg", imageAlt: "BTT", currency: "BTT", cardType, erc20Address: ZEROADDRESS },
                { isFeeless: false, isCustom: false, networkAlt: ETH_A, networkLogo: ETH_N, imageLink: "/imgs/ethLogo.svg", imageAlt: "ETH", currency: "ETH", cardType, erc20Address: "0x1249C65AfB11D179FFB3CE7D4eEDd1D9b98AD006" },
                { isFeeless: false, isCustom: false, networkAlt: BSC_A, networkLogo: BSC_N, imageLink: "/imgs/btcLogo.svg", imageAlt: "BTC_b", currency: "BTC_b", cardType, erc20Address: "0x1A7019909B10cdD2D8B0034293AD729f1C1F604e" },
                { isFeeless: false, isCustom: false, networkAlt: TRON_A, networkLogo: TRON_N, imageLink: "/imgs/usddLogo.svg", imageAlt: "USDD_t", currency: "USDD_t", cardType, erc20Address: "0x17F235FD5974318E4E2a5e37919a209f7c37A6d1" },
                { isFeeless: false, isCustom: false, networkAlt: ETH_A, networkLogo: ETH_N, imageLink: "/imgs/tetherLogo.svg", imageAlt: "USDT_e", currency: "USDT_e", cardType, erc20Address: "0xE887512ab8BC60BcC9224e1c3b5Be68E26048B8B" }

            ]
        case ChainIds.BSC_MAINNET:
            return [{ isFeeless: false, isCustom: true, networkAlt: "", networkLogo: "", imageLink: "/imgs/questionMark.png", imageAlt: "Custom Token", currency: "Custom Token", cardType, erc20Address: "", },
            { isFeeless: false, isCustom: false, networkAlt: "", networkLogo: "", imageLink: "/imgs/bnb-chain-binance-smart-chain-logo.svg", imageAlt: "BNB", currency: "BNB", cardType, erc20Address: ZEROADDRESS },
            { isFeeless: true, isCustom: false, networkAlt: "", networkLogo: "", imageLink: "/imgs/BunnyNotesCircle.png", imageAlt: "ZKB", currency: "ZKB", cardType, erc20Address: FeelessTokens.BSC_MAINNET, },]
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
    }, {
        tooltipTitle: "Select BitTorrent Chain",
        chainId: ChainIds.BTT_MAINNET_ID,
        imageAlt: "Bittorrent Chain",
        imageSrc: "/imgs/bttLogo.svg",
        cardTypography: "BitTorrent Chain"
    }


    //,
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
