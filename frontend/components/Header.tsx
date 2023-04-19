import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';


interface HeaderProps {
    onTabToggle?: (event: React.SyntheticEvent, newValue: number) => void;
    selectedTab?: number,
    withTabs: boolean,


}

export default function Header(props: HeaderProps) {
    return (
        <React.Fragment>
            {props.withTabs ? <AppBar component="div" position="static" elevation={0} sx={{ zIndex: 0 }}>
                <Tabs value={props.selectedTab} onChange={props.onTabToggle} textColor="inherit" variant='scrollable' scrollButtons allowScrollButtonsMobile aria-label="Bunny Notes Options">
                    <Tab label="Bunny Notes" />
                    <Tab label="Verify a Note" />
                    <Tab label="Withdraw" />
                    {/* <Tab label="Request Payment" /> */}
                </Tabs>
            </AppBar> : <React.Fragment></React.Fragment>}

        </React.Fragment>
    );
}