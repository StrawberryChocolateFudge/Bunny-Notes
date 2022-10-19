import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PurchaseGiftCardTab from './PurchaseGiftCardTab';
import Header from './Header';
import PurchaseCashNote from './PurchaseCashNote';
import VerifyNoteTab from './VerifyNoteTab';
import CashOutGiftCardTab from './CashOutGiftCardTab';
import PaymentRequestTab from './PaymentRequestTab';
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
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


export interface BaseTronUser {
    myAddress: string,
    setMyAddress: (newValue: string) => void
    tronWeb: any,
    setTronWeb: any,
    displayError: any,
}


function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <MuiLink color="inherit" href="https://bunnynotes.finance">
                bunnynotes.finance {" "}
            </MuiLink>

            {new Date().getFullYear()}
            <Button >Partner with us</Button>
        </Typography >
    );
}

const theme = getTheme();


export default function Base() {
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);

    const [snackbarMessage, setSnackbarMessage] = React.useState("");

    const [selectedTab, setSelectedTab] = React.useState(0);

    const [myAddress, setMyAddress] = React.useState("");

    const [noteString, setMyNoteString] = React.useState("");

    const [paymentRequest, setPaymentRequest] = React.useState({ price: "", payTo: "" })

    const [tronWeb, setTronWeb] = React.useState(null);

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


    const getLoading = () => {
        return <Box sx={{ display: 'flex', justifyContent: "center" }}>
            <CircularProgress />
        </Box>
    }

    const genericProps = {
        displayError: openSnackbar,
        tronWeb,
        setTronWeb,
        setMyAddress,
        myAddress
    }

    const noteStringProps = {
        noteString,
        setMyNoteString
    }

    const paymentRequestProps = {
        paymentRequest,
        setPaymentRequest
    }

    const getTabContent = () => {
        switch (selectedTab) {
            case 0:
                return <PurchaseGiftCardTab {...genericProps} />
            case 1:
                return <PurchaseCashNote {...genericProps} />
            case 2:
                return <VerifyNoteTab {...genericProps} {...noteStringProps} />
            case 3:
                return <CashOutGiftCardTab {...genericProps} {...noteStringProps}></CashOutGiftCardTab>
            case 4:
                return <PaymentRequestTab {...genericProps} {...paymentRequestProps}></PaymentRequestTab>;
            default:
                break;
        }
    }



    const getRoutes = () => {
        return (<BrowserRouter>
            <Routes>
                <Route path="/" element={getTabContent()}>
                </Route>
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

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Header selectedTab={selectedTab} onTabToggle={onTabToggle} />
                    <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}>
                        {getRoutes()}
                    </Box>
                    <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
                        <Copyright />
                    </Box>
                </Box>
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