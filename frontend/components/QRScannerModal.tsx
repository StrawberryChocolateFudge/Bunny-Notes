import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { QrReader } from 'react-qr-reader';
import styled from '@emotion/styled';
import { isMobile } from 'react-device-detect';
import { parseNote } from '../../lib/BunnyNote';
import { Tooltip } from '@mui/material';


const ReaderFrame = styled("div")({
    width: "100%"
})

interface QRReaderProps {
    setData: (d: string) => void;
    handleError: (msg: string) => void;
    handleClose: () => void
}

const QRReader = (props: QRReaderProps) => {
    const facingMode = isMobile ? "environment" : "user";
    return (
        <ReaderFrame>
            <QrReader
                ViewFinder={ViewFinder}
                constraints={{ facingMode }}
                onResult={async (result: any, error: any) => {
                    if (!!result) {
                        // Only set the data if the note is valid
                        // otherwise render an error
                        await parseNote(result?.text).then(() => {
                            props.setData(result?.text);
                            props.handleClose();

                        }).catch((err) => {
                            props.handleError(err.message);
                        });
                    }
                    if (!!error) {
                        // This is constantly triggered during scanning.

                    }
                }
                }
            />
        </ReaderFrame>
    );
};




export interface ScanNoteDialogProps {
    open: boolean;
    onClose: () => void;
    setData: (d: string) => void;
    handleError: (msg: string) => void;
    dialogTitle: string;
}

function ScanNoteDialog(props: ScanNoteDialogProps) {
    const { onClose, open } = props;

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>{props.dialogTitle}</DialogTitle>
            <QRReader handleClose={handleClose} setData={props.setData} handleError={props.handleError}></QRReader>
        </Dialog>
    );
}

interface ScanNoteButtonProps {
    setData: (d: string) => void;
    handleError: (msg: string) => void;
    dialogTitle: string;
}

export default function ScanNoteButton(props: ScanNoteButtonProps) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Tooltip arrow title="Scan a QR code">
                <Button variant="contained"
                    sx={{ height: "100%" }}
                    onClick={handleClickOpen}>
                    Scan
                </Button>
            </Tooltip>
            <ScanNoteDialog
                open={open}
                onClose={handleClose}
                setData={props.setData}
                handleError={props.handleError}
                dialogTitle={props.dialogTitle}
            />
        </div>
    );
}


export const ViewFinder = () => (
    <>
        <svg
            width="50px"
            viewBox="0 0 100 100"
            style={{
                top: 0,
                left: 0,
                zIndex: 1,
                boxSizing: 'border-box',
                border: '50px solid rgba(0, 0, 0, 0.3)',
                position: 'absolute',
                width: '100%',
                height: '100%',
            }}
        >
            <path
                fill="none"
                d="M13,0 L0,0 L0,13"
                stroke="rgba(255, 0, 0, 0.5)"
                strokeWidth="5"
            />
            <path
                fill="none"
                d="M0,87 L0,100 L13,100"
                stroke="rgba(255, 0, 0, 0.5)"
                strokeWidth="5"
            />
            <path
                fill="none"
                d="M87,100 L100,100 L100,87"
                stroke="rgba(255, 0, 0, 0.5)"
                strokeWidth="5"
            />
            <path
                fill="none"
                d="M100,13 L100,0 87,0"
                stroke="rgba(255, 0, 0, 0.5)"
                strokeWidth="5"
            />
        </svg>
    </>
);