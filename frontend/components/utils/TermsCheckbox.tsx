import { Link, Stack, styled } from "@mui/material";
import React from "react";
import { getTermsAcceptedFromLS } from "../../storage/local";

interface TermsCheckboxProps {
    termsAccepted: boolean;
    onTermsChecked: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function getTermsAcceptedInit() {
    const termsAcceptedLS = getTermsAcceptedFromLS();

    return termsAcceptedLS === null ?
        false :
        termsAcceptedLS === "true" ?
            true :
            false;

}

const LinkContainer = styled("div")({
    minWidth: "340px"
})

