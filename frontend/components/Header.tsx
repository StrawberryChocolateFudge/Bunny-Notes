import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Link } from '@mui/material';


interface HeaderProps {
    onTabToggle?: (event: React.SyntheticEvent, newValue: number) => void;
    selectedTab?: number,
    withTabs: boolean

}

export default function Header(props: HeaderProps) {
    return (
        <React.Fragment>


            {props.withTabs ? <AppBar component="div" position="static" elevation={0} sx={{ zIndex: 0 }}>
                <Tabs value={props.selectedTab} onChange={props.onTabToggle} textColor="inherit" variant='scrollable' scrollButtons allowScrollButtonsMobile aria-label="Bunny Notes Options">
                    <Tab label="Bunny Notes" />
                    <Tab label="Verify a Note" />
                    <Tab label="Cash Out" />
                    <Tab label="Request Payment" />
                    <Tab label="Bunny Wallet"></Tab>
                </Tabs>
            </AppBar> : <React.Fragment></React.Fragment>}

        </React.Fragment>
    );
}