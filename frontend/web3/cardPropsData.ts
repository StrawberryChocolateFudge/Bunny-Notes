import { BSCTESTNETID, BTTCTESTNETID, BTTMAINNETID, ZEROADDRESS } from "./web3";
import { SelectableCardsParams } from "../components/SelectableCards";


const BSC_N = "/imgs/bsc-networkLogo.png";
const BSC_A = "BSC";
const TRON_N = "/imgs/tron-NetworkLogo.svg";
const TRON_A = "Tron";
const ETH_N = "/imgs/eth_netwrokLogo.png";
const ETH_A = "ETH";

const BTTZKBTESTNET = "0x72b5bD690A3253e4B6cCB7A4bAe53EC34b1e8Df2"
const BSCZKBTESTNET = "0xeE55e7A619343B2f045bfD9A720BF912e1FCfEC7";


export function getCardPropsData(cardType: "Bunny Note", netId: string): Array<SelectableCardsParams> {
    switch (netId) {
        case BTTCTESTNETID:
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
        case BTTMAINNETID:
            return [
                { isFeeless: false, isCustom: true, networkAlt: "", networkLogo: "", imageLink: "/imgs/questionMark.png", imageAlt: "Custom Token", currency: "Custom Token", cardType, erc20Address: "", },
                { isFeeless: false, isCustom: false, networkAlt: "", networkLogo: "", imageLink: "/imgs/bttLogo.svg", imageAlt: "BTT", currency: "BTT", cardType, erc20Address: ZEROADDRESS },

                { isFeeless: false, isCustom: false, networkAlt: ETH_A, networkLogo: ETH_N, imageLink: "/imgs/ethLogo.svg", imageAlt: "ETH", currency: "ETH", cardType, erc20Address: "0x1249C65AfB11D179FFB3CE7D4eEDd1D9b98AD006" },
                { isFeeless: false, isCustom: false, networkAlt: BSC_A, networkLogo: BSC_N, imageLink: "/imgs/btcLogo.svg", imageAlt: "BTC_b", currency: "BTC_b", cardType, erc20Address: "0x1A7019909B10cdD2D8B0034293AD729f1C1F604e" },
                { isFeeless: false, isCustom: false, networkAlt: TRON_A, networkLogo: TRON_N, imageLink: "/imgs/usddLogo.svg", imageAlt: "USDD_t", currency: "USDD_t", cardType, erc20Address: "0x17F235FD5974318E4E2a5e37919a209f7c37A6d1" },
                { isFeeless: false, isCustom: false, networkAlt: ETH_A, networkLogo: ETH_N, imageLink: "/imgs/tetherLogo.svg", imageAlt: "USDT_e", currency: "USDT_e", cardType, erc20Address: "0xE887512ab8BC60BcC9224e1c3b5Be68E26048B8B" }

            ]

        case BSCTESTNETID:
            return [
                { isFeeless: false, isCustom: true, networkAlt: "", networkLogo: "", imageLink: "/imgs/questionMark.png", imageAlt: "Custom Token", currency: "Custom Token", cardType, erc20Address: "", },
                { isFeeless: false, isCustom: false, networkAlt: "", networkLogo: "", imageLink: "/imgs/bnb-chain-binance-smart-chain-logo.svg", imageAlt: "BNB", currency: "BNB", cardType, erc20Address: ZEROADDRESS },
                { isFeeless: true, isCustom: false, networkAlt: "", networkLogo: "", imageLink: "/imgs/zkbLogo.png", imageAlt: "ZKB", currency: "ZKB", cardType, erc20Address: BSCZKBTESTNET, },
            ]
        // case FANTOMTESTNETID:
        //     return [
        //         { isCustom: false, networkAlt: "", networkLogo: "", imageLink: "/imgs/FantomLogo.svg", imageAlt: "1 FTM", denomination: "1", currency: "FTM", cardType, erc20Address: ZEROADDRESS, noteContractAddress: FANTOM_NATIVE_TESTNET }
        //     ];
        // /?TODO:ADD BTT MAINNET
        default:
            return []
    }
}

// NETWORK DATA:
export type NetworkSelectProps = {
    tooltipTitle: string,
    chainId: string,
    imageAlt: string,
    imageSrc: string,
    cardTypography: string,
}

export const networkButtons: NetworkSelectProps[] = [
    {
        tooltipTitle: "Select BitTorrent Chain",
        chainId: BTTMAINNETID,
        imageAlt: "Bittorrent Chain",
        imageSrc: "/imgs/bttLogo.svg",
        cardTypography: "BitTorrent Chain"
    }


    // {
    //     tooltipTitle: "Select Binance Smart Chain Testnet",
    //     chainId: BSCTESTNETID,
    //     imageAlt: "Binance Smart Chain",
    //     imageSrc: "/imgs/bnb-chain-binance-smart-chain-logo.svg",
    //     cardTypography: "Binance Smart Chain"
    // }
    // , {
    //     tooltipTitle: "Select Bittorrent Chain",
    //     chainId: BTTCTESTNETID,
    //     imageAlt: "Bittorrent Chain",
    //     imageSrc: "/imgs/bttLogo.svg",
    //     cardTypography: "BitTorrent Chain"
    // }

    // {
    //     tooltipTitle: " Select Fantom",
    //     chainId: "0xfa2",
    //     imageAlt: "Fantom",
    //     imageSrc: "/imgs/FantomLogo.svg",
    //     cardTypography: "Fantom Testnet"
    // }
]
