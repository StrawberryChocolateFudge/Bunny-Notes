import { BTTCTESTNETID, BTT_NATIVE_DONAU, USDTM100ADDRESS_DONAU, USDTMCONTRACTADDRESS_DONAU, ZEROADDRESS } from "../../web3/web3";
import { SelectableCardsParams } from "../SelectableCards";


const BSC_N = "/imgs/bsc-networkLogo.png";
const BSC_A = "BSC";
const TRON_N = "/imgs/tron-NetworkLogo.svg";
const TRON_A = "Tron";
const ETH_N = "/imgs/eth_netwrokLogo.png";
const ETH_A = "ETH";

export function getCardPropsData(cardType: 'Gift Card' | "Cash Note" | "Payment Request", netId: string): Array<SelectableCardsParams> {
    if (cardType === "Payment Request" && netId === BTTCTESTNETID) {
        return [
            { networkAlt: "", networkLogo: "", imageLink: "/imgs/bttLogo.svg", imageAlt: "1 BTT", denomination: "1", currency: "BTT", cardType, erc20Address: ZEROADDRESS, noteContractAddress: BTT_NATIVE_DONAU },
            { networkAlt: "", networkLogo: "", imageLink: "/imgs/Bunny.svg", imageAlt: "100 USDTM", denomination: "100", currency: "USDTM", cardType, erc20Address: USDTMCONTRACTADDRESS_DONAU, noteContractAddress: USDTM100ADDRESS_DONAU },
            // { networkAlt: TRON_A, networkLogo: TRON_N, imageLink: "/imgs/tetherLogo.svg", imageAlt: `100 USDT ${cardType}`, denomination: "100", currency: "USDT", cardType, erc20Address: "", noteContractAddress: "" },
            // { networkAlt: TRON_A, networkLogo: TRON_N, imageLink: "/imgs/usddLogo.svg", imageAlt: `100 USDD ${cardType}`, denomination: "100", currency: "USDD", cardType, erc20Address: "", noteContractAddress: "" },
            // { networkAlt: TRON_A, networkLogo: TRON_N, imageLink: "/imgs/bttLogo.svg", imageAlt: "1 BTT", denomination: "1", currency: "BTT", cardType, erc20Address: "", noteContractAddress: "" },
            // { networkAlt: ETH_A, networkLogo: ETH_N, imageLink: "/imgs/ethLogo.svg", imageAlt: "1 ETH", denomination: "1", currency: "ETH", cardType, erc20Address: "", noteContractAddress: "" },
            // { networkAlt: BSC_A, networkLogo: BSC_N, imageLink: "/imgs/btcLogo.svg", imageAlt: "0.1 BTC", denomination: "0.1", currency: "BTC", cardType, erc20Address: "", noteContractAddress: "" }
        ]
    } else if (cardType !== "Payment Request" && netId === BTTCTESTNETID) {
        return [
            { networkAlt: "", networkLogo: "", imageLink: "/imgs/bttLogo.svg", imageAlt: "1 BTT", denomination: "1", currency: "BTT", cardType, erc20Address: ZEROADDRESS, noteContractAddress: BTT_NATIVE_DONAU },
            { networkAlt: "", networkLogo: "", imageLink: "/imgs/Bunny.svg", imageAlt: "100 USDTM TESTNET", denomination: "100", currency: "USDTM", cardType, erc20Address: USDTMCONTRACTADDRESS_DONAU, noteContractAddress: USDTM100ADDRESS_DONAU },
            // { networkAlt: TRON_A, networkLogo: TRON_N, imageLink: "/imgs/tetherLogo.svg", imageAlt: `10 USDT ${cardType}`, denomination: "10", currency: "USDT", cardType, erc20Address: "", noteContractAddress: "" },
            // { networkAlt: TRON_A, networkLogo: TRON_N, imageLink: "/imgs/tetherLogo.svg", imageAlt: `100 USDT ${cardType}`, denomination: "100", currency: "USDT", cardType, erc20Address: "", noteContractAddress: "" },
            // { networkAlt: TRON_A, networkLogo: TRON_N, imageLink: "/imgs/usddLogo.svg", imageAlt: `10 USDD ${cardType}`, denomination: "10", currency: "USDD", cardType, erc20Address: "", noteContractAddress: "" },
            // { networkAlt: TRON_A, networkLogo: TRON_N, imageLink: "/imgs/usddLogo.svg", imageAlt: `100 USDD ${cardType}`, denomination: "100", currency: "USDD", cardType, erc20Address: "", noteContractAddress: "" },
            // { networkAlt: TRON_A, networkLogo: TRON_N, imageLink: "/imgs/bttLogo.svg", imageAlt: "1 BTT", denomination: "1", currency: "BTT", cardType, erc20Address: "", noteContractAddress: "" },
            // { networkAlt: ETH_A, networkLogo: ETH_N, imageLink: "/imgs/ethLogo.svg", imageAlt: "1 ETH", denomination: "1", currency: "ETH", cardType, erc20Address: "", noteContractAddress: "" },
            // { networkAlt: BSC_A, networkLogo: BSC_N, imageLink: "/imgs/btcLogo.svg", imageAlt: "0.1 BTC", denomination: "0.1", currency: "BTC", cardType, erc20Address: "", noteContractAddress: "" }

        ]
    } else {
        return []
    }
}
