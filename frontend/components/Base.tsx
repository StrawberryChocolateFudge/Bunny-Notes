import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { styled } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Header from './Header';
import VerifyNoteTab from './VerifyNoteTab';
import CashOutGiftCardTab from './CashOutGiftCardTab';
import PaymentRequestTab from './PaymentRequestTab';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { default as MuiLink } from "@mui/material/Link";
import getTheme from './theme';
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import { PaymentRequestPage } from './PaymentRequestPage';
import { NotFoundPage } from './404page';
import HelpPage from './HelpPage';
import BunnyWalletTab from './BunnyWalletTab';
import BunnyNotesTab from './BunnyNotesTab';
import { SelectNetworkDialog } from './utils/NetworkSelector';
import { getCurrenttNetworkFromSS, getSelectedNFromSS } from '../storage/session';
import { NoteDetails } from '../zkp/generateProof';

export interface Base {
    myAddress: string,
    setMyAddress: (newValue: string) => void
    provider: any,
    setProvider: any,
    displayError: any,
    selectedNetwork: string,
    setSelectedNetwork: (n: string) => void;
    navigateToVerifyPage: (note: NoteDetails) => void;
}

export function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <MuiLink color="inherit" href="https://bunnynotes.finance">
                bunnynotes.finance {" "}
            </MuiLink>

            {new Date().getFullYear()}
            {/* <Button >Partner with us</Button> */}
        </Typography >
    );
}

const theme = getTheme();

export const Spacer = styled("div")({
    marginBottom: "10px"
})

export default function Base() {
    // Handling if the dialog to select network should show
    const currentN = getCurrenttNetworkFromSS();
    const selectedN = getSelectedNFromSS();

    let showNetworkSelectInit = true;
    let selectedNetworkInit = "";

    if (currentN === selectedN && currentN !== null) {
        showNetworkSelectInit = false;
        selectedNetworkInit = currentN;
    }

    const [showNetworkSelect, setShowNetworkSelect] = React.useState(showNetworkSelectInit);

    const [selectedNetwork, setSelectedNetwork] = React.useState(selectedNetworkInit);

    const [snackbarOpen, setSnackbarOpen] = React.useState(false);

    const [snackbarMessage, setSnackbarMessage] = React.useState("");

    const [selectedTab, setSelectedTab] = React.useState(0);

    const [myAddress, setMyAddress] = React.useState("");

    const [noteString, setMyNoteString] = React.useState("");

    const [paymentRequest, setPaymentRequest] = React.useState({ price: "", payTo: "" })

    const [provider, setProvider] = React.useState(null);

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

    const genericProps = {
        displayError: openSnackbar,
        provider,
        setProvider,
        setMyAddress,
        myAddress,
        selectedNetwork,
        setSelectedNetwork,
        navigateToVerifyPage
    }

    const noteStringProps = {
        noteString,
        setMyNoteString
    }

    const paymentRequestProps = {
        paymentRequest,
        setPaymentRequest
    }

    const networkSelectProps = {
        displayError: openSnackbar,
        selectedNetwork,
        setSelectedNetwork,
        showNetworkSelect,
        setShowNetworkSelect,
        setProvider
    }

    const getTabContent = () => {
        switch (selectedTab) {
            case 0:
                return <BunnyNotesTab {...genericProps} />
            case 1:
                return <VerifyNoteTab {...genericProps} {...noteStringProps} />
            case 2:
                return <CashOutGiftCardTab {...genericProps} {...noteStringProps}></CashOutGiftCardTab>
            case 3:
                return <PaymentRequestTab {...genericProps} {...paymentRequestProps}></PaymentRequestTab>;
            case 4:
                return <BunnyWalletTab {...genericProps}></BunnyWalletTab>
            default:
                break;
        }
    }



    function mainRoute() {
        return <React.Fragment>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Header withTabs={true} selectedTab={selectedTab} onTabToggle={onTabToggle} />
                <Box component="main" sx={{ flex: 1, }}>
                    {getTabContent()}
                </Box>
                <Box component="footer" sx={{ p: 2 }}>
                    <Copyright />
                </Box>
            </Box>
            <SelectNetworkDialog {...networkSelectProps}></SelectNetworkDialog>
        </React.Fragment>
    }

    const getRoutes = () => {
        return (<BrowserRouter>
            <Routes>
                <Route path="/" element={mainRoute()}></Route>
                <Route path="/paymentRequest/:payTo/:amount/:currency/:network" element={<PaymentRequestPage {...genericProps}></PaymentRequestPage>}></Route>
                <Route path="*" element={<NotFoundPage></NotFoundPage>} />
                <Route path="/help" element={<HelpPage></HelpPage>}></Route>
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