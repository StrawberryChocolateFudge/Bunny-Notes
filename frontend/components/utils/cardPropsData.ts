import { BTTCTESTNETID, FANTOMTESTNETID, BTT_BUNNYNOTES_DONAU, ZEROADDRESS } from "../../web3/web3";
import { SelectableCardsParams } from "../SelectableCards";


const BSC_N = "/imgs/bsc-networkLogo.png";
const BSC_A = "BSC";
const TRON_N = "/imgs/tron-NetworkLogo.svg";
const TRON_A = "Tron";
const ETH_N = "/imgs/eth_netwrokLogo.png";
const ETH_A = "ETH";

// export function getCardPropsData(cardType: 'Bunny Note' | "Spending Note" | "Payment Request", netId: string): Array<SelectableCardsParams> {
//     if (cardType === "Payment Request") {
//         switch (netId) {
//             case BTTCTESTNETID:
//                 return [
//                     { networkAlt: "", networkLogo: "", imageLink: "/imgs/bttLogo.svg", imageAlt: "1 BTT", denomination: "1", currency: "BTT", cardType, erc20Address: ZEROADDRESS, noteContractAddress: BTT_NATIVE_DONAU },
//                     // { networkAlt: "", networkLogo: "", imageLink: "/imgs/Bunny.svg", imageAlt: "100 USDTM", denomination: "100", currency: "USDTM", cardType, erc20Address: USDTMCONTRACTADDRESS_DONAU, noteContractAddress: USDTM100ADDRESS_DONAU },
//                 ]
//             case FANTOMTESTNETID:
//                 return [
//                     { networkAlt: "", networkLogo: "", imageLink: "/imgs/FantomLogo.svg", imageAlt: "1 FTM", denomination: "1", currency: "FTM", cardType, erc20Address: ZEROADDRESS, noteContractAddress: FANTOM_NATIVE_TESTNET }
//                 ];
//             default:
//                 return []
//         }

//     } else {
//         switch (netId) {
//             case BTTCTESTNETID:
//                 return [
//                     { networkAlt: "", networkLogo: "", imageLink: "/imgs/bttLogo.svg", imageAlt: "1 BTT", denomination: "1", currency: "BTT", cardType, erc20Address: ZEROADDRESS, noteContractAddress: BTT_NATIVE_DONAU },
//                     // { networkAlt: "", networkLogo: "", imageLink: "/imgs/Bunny.svg", imageAlt: "100 USDTM TESTNET", denomination: "100", currency: "USDTM", cardType, erc20Address: USDTMCONTRACTADDRESS_DONAU, noteContractAddress: USDTM100ADDRESS_DONAU },
//                 ]
//             case FANTOMTESTNETID:
//                 return [
//                     { networkAlt: "", networkLogo: "", imageLink: "/imgs/FantomLogo.svg", imageAlt: "1 FTM", denomination: "1", currency: "FTM", cardType, erc20Address: ZEROADDRESS, noteContractAddress: FANTOM_NATIVE_TESTNET }
//                 ];
//             default:
//                 return [];
//         }
//     }
// }


// All contract addresses are the same per network now!!
export function getCardPropsData(cardType: "Bunny Note", netId: string): Array<SelectableCardsParams> {
    switch (netId) {
        case BTTCTESTNETID:
            return [
                { isCustom: true, networkAlt: "", networkLogo: "", imageLink: "/imgs/questionMark.png", imageAlt: "Custom Token", currency: "Custom Token", cardType, erc20Address: "", },
                { isCustom: false, networkAlt: "", networkLogo: "", imageLink: "/imgs/bttLogo.svg", imageAlt: "1 BTT", currency: "BTT", cardType, erc20Address: ZEROADDRESS },
                // { networkAlt: "", networkLogo: "", imageLink: "/imgs/Bunny.svg", imageAlt: "100 USDTM", denomination: "100", currency: "USDTM", cardType, erc20Address: USDTMCONTRACTADDRESS_DONAU, noteContractAddress: USDTM100ADDRESS_DONAU },
            ]
        // case FANTOMTESTNETID:
        //     return [
        //         { isCustom: false, networkAlt: "", networkLogo: "", imageLink: "/imgs/FantomLogo.svg", imageAlt: "1 FTM", denomination: "1", currency: "FTM", cardType, erc20Address: ZEROADDRESS, noteContractAddress: FANTOM_NATIVE_TESTNET }
        //     ];
        default:
            return []
    }
}