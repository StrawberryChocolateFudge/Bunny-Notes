import { Box, Typography } from "@mui/material";
import React from "react";
import Header from "./Header";

export function NotFoundPage() {

    const quotes = ["Lay it on me, doc.",
        "Yeah, doc? What do you need?",
        "What's a rabbit gotta do to get some carrots around here?",
        "Bugs Bunny here, how can I help you?",
        "Eh, what's up, doc?",
        "Oh, it's you. I was hoping for room service.",
        "What's all the hubbub, bub?",
        "Start talking, it's your nickel!",
        "Eh, let's make it snappy, doc.",
        "What do you want? I'm missing my stories!",]


    return <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header withTabs={false} />
        <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}>
            <Typography variant="h6" component="div">{quotes[Math.floor(Math.random() * 10)
            ]}</Typography>
        </Box>
    </Box>
}