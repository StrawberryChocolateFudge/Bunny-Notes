import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { styled } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Header from './Header';
import VerifyNoteTab from './VerifyNoteTab';
import CashOutGiftCardTab from './CashOutGiftCardTab';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import getTheme from './theme';
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import { NotFoundPage } from './404page';
import { BunnyNotesTab } from './BunnyNotesTab';
import { getSelectedNFromSS } from '../storage/session';
import { NoteDetails } from '../zkp/generateProof';
import { TermsPage } from './TermsPage';
import { TokenSalePage } from './TokenSalePage';
import { BunnyBundlesTab } from './BunnyBundlesTab';
import { onSelectedNetworkEmpty } from './utils/NetworkSelectorDropdown';


export interface BaseProps {
    displayError: any,
    selectedNetwork: string,
    setSelectedNetwork: (n: string) => void;
    navigateToVerifyPage: (note: NoteDetails) => void;
}

export function Copyright() {
    return (
        <React.Fragment>
        </React.Fragment>
    );
}

const theme = getTheme();

export const Spacer = styled("div")({
    marginBottom: "10px"
})

export default function Base() {
    // Handling if the dialog to select network should show
    const selectedN = getSelectedNFromSS();

    let selectedNetworkInit = selectedN === null ? onSelectedNetworkEmpty("") : selectedN;

    const [selectedNetwork, setSelectedNetwork] = React.useState(selectedNetworkInit);

    const [snackbarOpen, setSnackbarOpen] = React.useState(false);

    const [snackbarMessage, setSnackbarMessage] = React.useState("");

    const [selectedTab, setSelectedTab] = React.useState(0);

    const [noteString, setMyNoteString] = React.useState("");

    const [paymentRequest, setPaymentRequest] = React.useState({ price: "", payTo: "" })



    // Track if the download button was pressed for the bundle download

    // Initialize the terms accepted from local storage

    const openSnackbar = (msg: string) => {
        setSnackbarOpen(true);
        setSnackbarMessage(msg);
    }

    const closeSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    }


    const onTabToggle = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    function navigateToVerifyPage(note: NoteDetails) {
        setMyNoteString(note[0])
        setSelectedTab(1);

        const clickButton = () => {
            const button = document.getElementById("verifyNoteButton");
            button?.click();
        }
        // Wait 1 second for the page to render then click the verify automaticly!
        setTimeout(clickButton, 1000);
    }

    const baseprops = {
        displayError: openSnackbar,
        selectedNetwork,
        setSelectedNetwork,
        navigateToVerifyPage,
    }

    const noteStringProps = {
        noteString,
        setMyNoteString
    }


    const getTabContent = () => {
        switch (selectedTab) {
            case 0:
                return <BunnyNotesTab {...baseprops} />
            case 1:
                return <BunnyBundlesTab {...baseprops}></BunnyBundlesTab>
            case 2:
                return <CashOutGiftCardTab {...baseprops} {...noteStringProps}></CashOutGiftCardTab>
            case 3:
                return <VerifyNoteTab {...baseprops} {...noteStringProps} />
            default:
                break;
        }
    }

    function mainRoute() {
        return <React.Fragment>
            <Box sx={{ flex: 1, display: "flex", flexDirection: 'column' }}>
                <Header withTabs={true} selectedTab={selectedTab} onTabToggle={onTabToggle} />
                <Box component="main" sx={{ flex: 1, }}>
                    {getTabContent()}
                </Box>
                <Box component="footer" sx={{ p: 2 }}>
                    <Copyright />
                </Box>
            </Box>
        </React.Fragment>
    }

    const getRoutes = () => {
        return (<BrowserRouter>
            <Routes>
                <Route path="/" element={mainRoute()}></Route>
                <Route path="*" element={<NotFoundPage></NotFoundPage>} />
                <Route path="/terms" element={<TermsPage></TermsPage>}></Route>
                <Route path="/tokensale" element={<TokenSalePage displayError={openSnackbar}></TokenSalePage>}></Route>
            </Routes>
        </BrowserRouter>)
    }


    const snackBarAction = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={closeSnackbar}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                <CssBaseline />
                {getRoutes()}
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={closeSnackbar}
                message={snackbarMessage}
                action={snackBarAction}
            />
        </ThemeProvider>
    );
}   