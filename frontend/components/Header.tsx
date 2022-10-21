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
            <AppBar
                component="div"
                color="primary"
                position="static"
                elevation={0}
                sx={{ zIndex: 0 }}
            >
                <Toolbar>
                    <Grid container alignItems="center" spacing={1}>
                        <Grid item xs>
                            <Typography sx={{ marginLeft: "35px" }} color="inherit" variant="h5" component="h1"><Link sx={{ color: "white" }} href="/" underline="none">
                                Bunny Notes
                            </Link></Typography>
                        </Grid>
                        <Grid item>
                            <Typography color="inherit" variant='subtitle1' component={"p"}>
                                Gift Card and Cash Note Protocol
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Tooltip title="Help">
                                <IconButton color="inherit">
                                    <HelpIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>

            {props.withTabs ? <AppBar component="div" position="static" elevation={0} sx={{ zIndex: 0 }}>
                <Tabs value={props.selectedTab} onChange={props.onTabToggle} textColor="inherit" variant='scrollable' scrollButtons allowScrollButtonsMobile aria-label="Bunny Notes Options">
                    <Tab label="Purchase Gift Cards" />
                    <Tab label="Purchase Cash Notes" />
                    <Tab label="Verify a Note" />
                    <Tab label="Cash Out Gift Card" />
                    <Tab label="Request Payment" />
                </Tabs>
            </AppBar> : <React.Fragment></React.Fragment>}

        </React.Fragment>
    );
}