import { BSCTESTNETID, BTTCTESTNETID, ZEROADDRESS } from "./web3";
import { SelectableCardsParams } from "../components/SelectableCards";


const BSC_N = "/imgs/bsc-networkLogo.png";
const BSC_A = "BSC";
const TRON_N = "/imgs/tron-NetworkLogo.svg";
const TRON_A = "Tron";
const ETH_N = "/imgs/eth_netwrokLogo.png";
const ETH_A = "ETH";

const BTTZKB = "0x72b5bD690A3253e4B6cCB7A4bAe53EC34b1e8Df2"
const BSCZKB = "";
//CARDS DATA:
// All contract addresses are the same per network now!!
export function getCardPropsData(cardType: "Bunny Note", netId: string): Array<SelectableCardsParams> {
    switch (netId) {
        case BTTCTESTNETID:
            return [
                { isFeeless: false, isCustom: true, networkAlt: "", networkLogo: "", imageLink: "/imgs/questionMark.png", imageAlt: "Custom Token", currency: "Custom Token", cardType, erc20Address: "", },
                { isFeeless: false, isCustom: false, networkAlt: "", networkLogo: "", imageLink: "/imgs/bttLogo.svg", imageAlt: "BTT", currency: "BTT", cardType, erc20Address: ZEROADDRESS },
                { isFeeless: true, isCustom: false, networkAlt: BSC_A, networkLogo: BSC_N, imageLink: "/imgs/Bunny.svg", imageAlt: "ZKB", currency: "ZKB", cardType, erc20Address: BTTZKB, },
            ]
        case BSCTESTNETID:
            return [
                { isFeeless: false, isCustom: true, networkAlt: "", networkLogo: "", imageLink: "/imgs/questionMark.png", imageAlt: "Custom Token", currency: "Custom Token", cardType, erc20Address: "", },
                { isFeeless: false, isCustom: false, networkAlt: "", networkLogo: "", imageLink: "/imgs/bnb-chain-binance-smart-chain-logo.svg", imageAlt: "BNB", currency: "BNB", cardType, erc20Address: ZEROADDRESS },
                { isFeeless: true, isCustom: false, networkAlt: "", networkLogo: "", imageLink: "/imgs/Bunny.svg", imageAlt: "ZKB", currency: "ZKB", cardType, erc20Address: BSCZKB, },
            ]
        // case FANTOMTESTNETID:
        //     return [
        //         { isCustom: false, networkAlt: "", networkLogo: "", imageLink: "/imgs/FantomLogo.svg", imageAlt: "1 FTM", denomination: "1", currency: "FTM", cardType, erc20Address: ZEROADDRESS, noteContractAddress: FANTOM_NATIVE_TESTNET }
        //     ];
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
        tooltipTitle: "Select Bittorrent Chain",
        chainId: BTTCTESTNETID,
        imageAlt: "Bittorrent Chain",
        imageSrc: "/imgs/bttLogo.svg",
        cardTypography: "BTTC Testnet"
    },
    {
        tooltipTitle: "Select Binance Smart Chain Testnet",
        chainId: BSCTESTNETID,
        imageAlt: "Binance Smart Chain",
        imageSrc: "/imgs/bnb-chain-binance-smart-chain-logo.svg",
        cardTypography: "BSC Testnet"
    }
    // {
    //     tooltipTitle: " Select Fantom",
    //     chainId: "0xfa2",
    //     imageAlt: "Fantom",
    //     imageSrc: "/imgs/FantomLogo.svg",
    //     cardTypography: "Fantom Testnet"
    // }
]
