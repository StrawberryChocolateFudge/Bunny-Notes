import { SelectableCardsParams } from "../SelectableCards";

export function getCardPropsData(cardType: 'Gift Card' | "Cash Note" | "Payment Request"): Array<SelectableCardsParams> {

    if (cardType === "Payment Request") {
        return [
            { imageLink: "/Bunny.svg", imageAlt: "100 USDTM TESTNET", denomination: "100", currency: "USDTM", cardType },
            { imageLink: "https://raw.githubusercontent.com/StrawberryChocolateFudge/Bunny-Notes/master/frontend/logos/tetherLogo.svg", imageAlt: `100 USDT ${cardType}`, denomination: "100", currency: "USDT", cardType },
            // { imageLink: "https://raw.githubusercontent.com/StrawberryChocolateFudge/Bunny-Notes/master/frontend/logos/usddLogo.svg", imageAlt: `100 USDD ${cardType}`, denomination: "100", currency: "USDD", cardType },

        ]
    } else {
        return [
            { imageLink: "/Bunny.svg", imageAlt: "100 USDTM TESTNET", denomination: "100", currency: "USDTM", cardType },
            { imageLink: "https://raw.githubusercontent.com/StrawberryChocolateFudge/Bunny-Notes/master/frontend/logos/tetherLogo.svg", imageAlt: `10 USDT ${cardType}`, denomination: "10", currency: "USDT", cardType },
            { imageLink: "https://raw.githubusercontent.com/StrawberryChocolateFudge/Bunny-Notes/master/frontend/logos/tetherLogo.svg", imageAlt: `100 USDT ${cardType}`, denomination: "100", currency: "USDT", cardType },
            { imageLink: "https://raw.githubusercontent.com/StrawberryChocolateFudge/Bunny-Notes/master/frontend/logos/usddLogo.svg", imageAlt: `10 USDD ${cardType}`, denomination: "10", currency: "USDD", cardType },
            // { imageLink: "https://raw.githubusercontent.com/StrawberryChocolateFudge/Bunny-Notes/master/frontend/logos/usddLogo.svg", imageAlt: `100 USDD ${cardType}`, denomination: "100", currency: "USDD", cardType },
        ]
    }
}
