import { Checkbox, Link, Stack } from "@mui/material";
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

export function TermsCheckbox(props: TermsCheckboxProps) {
    return <Stack alignItems={"center"} direction={"row"} justifyContent="center">
        <Link href="/terms" target="_blank">I accept the terms</Link>
        <Checkbox checked={props.termsAccepted} onChange={props.onTermsChecked}></Checkbox>
    </Stack>
}