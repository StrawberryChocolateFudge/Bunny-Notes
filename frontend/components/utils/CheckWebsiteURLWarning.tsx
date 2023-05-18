import { Chip } from "@mui/material";
import React from "react";

interface CheckWebsiteURLWarningProps { }

export function CheckWebsiteURLWarning(props: CheckWebsiteURLWarningProps) {

    return <Chip sx={{
        borderRadius: "0", '& .MuiChip-label': {
            width: "100%"
        }

    }} color="primary"
        //@ts-ignore
        label={<marquee>Beware of Phishing! Make sure the url is https://bunnynotes.finance !</marquee>} />
}