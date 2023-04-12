import { Chip } from "@mui/material";
import React from "react";

interface CheckWebsiteURLWarningProps { }

export function CheckWebsiteURLWarning(props: CheckWebsiteURLWarningProps) {
    //@ts-ignore
    return <Chip sx={{ borderRadius: "0" }} color="warning" label={<marquee>Beware of Phishing! Make sure the url is https://bunnynotes.finance !</marquee>} />

}