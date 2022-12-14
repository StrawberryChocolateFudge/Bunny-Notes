import { styled, AppBar, Box, Button, Grid, Paper, TextField, Toolbar, Typography, FormControl, InputLabel, Select, SelectChangeEvent, MenuItem, FormHelperText, Autocomplete, createFilterOptions, CircularProgress, FormGroup, FormControlLabel, Checkbox, Switch } from "@mui/material";
import * as React from "react";
import { AvailableERC20Token, getAvailableERC20Tokens } from "../../web3/web3";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet"
import ScanNoteButton from "../QRScannerModal";

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    width: "200px"
});

const Center = styled('div')({
    margin: '0 auto',
    textAlign: "center"
})


const Column = styled("div")({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around"
});

const PaddedDiv = styled("div")({
    padding: "5px"
})
const RowSpaceBetween = styled("div")({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
})

const Display = styled("div")({
    margin: "auto",
    top: "20%",
    marginLeft: "11px"
})

const ActionSelector = styled("div")({
    textAlign: "center",
    marginTop: "10px",
    marginBottom: "20px"
})



export function WalletNotConnected(props: any) {
    return <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden' }}>
        <AppBar
            position="static"
            color="default"
            elevation={0}
            sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
        >
            <Toolbar>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <WalletIcon color="inherit" sx={{ display: 'block' }} />
                    </Grid>
                    <Grid item xs>
                        <TextField autoComplete='off' value={props.smartContractWallet} onChange={props.walletAddressSetter} fullWidth placeholder="Paste your Smart Contract Wallet Address Here" InputProps={{ disableUnderline: true, sx: { fontSize: 'default' } }} variant="standard" />
                    </Grid>
                    <Grid item>
                        <Button onClick={props.connectButtonAction} variant="contained">Connect</Button>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
        <Box>
            <Typography sx={{ padding: "5px", textAlign: "center" }} component={"h5"} variant="h5">Connect to the Bunny Wallet created with the Mobile App</Typography>
            <Center>
                <Button sx={{ margin: "0 auto" }}><Img src="/imgs/get-it-on-google-play-badge.png" /></Button>
            </Center>
        </Box>
    </Paper>
}

export function WalletConnected(props: any) {
    return <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden' }}>
        <Box>
            <Typography variant="subtitle2" sx={{ padding: "5px", textAlign: "center" }}>Administer your Bunny Wallet. For best experience, use the Mobile App!</Typography>
            <Typography sx={{ padding: "5px", textAlign: "center" }} component={"p"} variant="subtitle1">{props.smartContractWallet}
            </Typography>
            <Typography sx={{ padding: "5px", textAlign: "center" }} component={"p"} variant="subtitle1">Balance: {props.walletBalance} {props.walletCurrency}
            </Typography>
        </Box>
        <Box>
            <ActionSelector>
                <FormControl sx={{ minWidth: "100px" }}>
                    <InputLabel id="contract-actions-label">Actions</InputLabel>
                    <Select
                        labelId="contract-actions-label"
                        id="contract-actions-select"
                        value={props.selectedAction}
                        onChange={props.actionSelector}
                        label="Actions"
                    >
                        <MenuItem value="transferEth">Transfer {props.walletCurrency}</MenuItem>
                        <MenuItem value="transferERC20">Transfer Token</MenuItem>
                        <MenuItem value="approveERC20">Approve Token Spend</MenuItem>
                        <MenuItem value="transferERC721">Transfer NFT</MenuItem>
                        <MenuItem value="approveERC721">Approve NFT</MenuItem>
                        <MenuItem value="resetCommitment">Reset Commitment</MenuItem>
                    </Select>
                    <FormHelperText>{props.formHelperText}</FormHelperText>
                </FormControl>
            </ActionSelector>
        </Box>
        <Box>{props.renderSelectedAction()}</Box>
    </Paper>
}

export function TransferETHElements(props: any) {
    return <Box>
        <PaddedDiv>
            <TextField key="transferEthToKey" value={props.transferEthTo} onChange={props.transferEthToSetter} sx={{ marginBottom: "20px", width: "100%" }} label="Transfer To" variant="filled"></TextField>
        </PaddedDiv>
        <PaddedDiv>
            <RowSpaceBetween>
                <div>
                    <TextField key="transferETHAmountKey" value={props.transferEtAmount} onChange={props.transferEthAmountSetter} type={"number"} label="Transfer Amount" variant="filled"></TextField>
                    <Button onClick={props.setTransferETHAmountMax} sx={{ top: "20%" }} variant="text">Max</Button>
                </div>
                <Button onClick={props.transferETH} variant="contained">Transfer</Button>
            </RowSpaceBetween>
        </PaddedDiv>
    </Box>
}


const filter = createFilterOptions<AvailableERC20Token>();

export function TransferERC20Elements(props: any) {
    return <Box>
        <PaddedDiv>
            <Erc20SelectorAutocomplete {...props}></Erc20SelectorAutocomplete>
        </PaddedDiv>
        <PaddedDiv>
            <TextField value={props.transferERC20To} onChange={props.transferERC20ToSetter} key="transferERC20Token" variant="filled" sx={{ marginBottom: "20p", width: "100%" }} label="Transfer To"></TextField>
        </PaddedDiv>
        <PaddedDiv>
            <RowSpaceBetween>
                <TextField key="transferERC20AmountKey" value={props.transferERC20Amount} onChange={props.transferERC20AmountSetter} type={"number"} label="Transfer Amount" variant="filled"></TextField>
                <Button onClick={props.setTransferERC20AmountMax} sx={{ top: "20%" }} variant="text">Max</Button>

                <Display>{props.formattedERC20Balance}</Display>
                <Button onClick={props.transferERC20} variant="contained">Transfer</Button>
            </RowSpaceBetween>
        </PaddedDiv>
    </Box >
}

export function Erc20SelectorAutocomplete(props: any) {
    return <Autocomplete
        key="erc20AddressAutocompletes"
        disablePortal
        id="select-erc20-token"
        options={getAvailableERC20Tokens(props.netId)}
        getOptionLabel={(option) => option.address}
        isOptionEqualToValue={(option, value) => { return true }}
        sx={{ width: "100%" }}
        value={props.erc20Address}
        onChange={(event, newValue) => {
            if (typeof newValue === 'string') {
                props.setERC20Address({
                    address: newValue,
                });
            } else if (newValue && newValue.inputValue) {
                // Create a new value from the user input
                props.setERC20Address({
                    address: newValue.inputValue,
                });
            } else {
                props.setERC20Address(newValue);
            }
        }}
        filterOptions={(options, params) => {
            const filtered = filter(options, params);

            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = options.some((option) => inputValue === option.address);
            if (inputValue !== '' && !isExisting) {
                filtered.push({
                    address: inputValue,
                    name: `Add `,
                    logo: ""
                });
            }

            return filtered;
        }}
        renderOption={(props, option) => (
            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                <img
                    loading="lazy"
                    width="20"
                    src={option.logo}
                    alt=""
                />
                {option.name} {option.address}
            </Box>
        )}
        renderInput={(params) => <TextField {...params} label="Token Address"></TextField>}
    />
}

export function ApproveERC20Elements(props: any) {
    return <Box>
        <PaddedDiv>
            <Erc20SelectorAutocomplete {...props}></Erc20SelectorAutocomplete>
        </PaddedDiv>
        <PaddedDiv>
            <RowSpaceBetween>
                <TextField value={props.approveERC20To} onChange={props.approveERC20ToSetter} key="approveERC20Token" variant="filled" sx={{ marginBottom: "20p", width: "100%" }} label="Spender"></TextField>
                <Button onClick={props.getERC20Allowance} sx={{ width: "100px" }} variant="outlined">Allowance</Button>
            </RowSpaceBetween>
        </PaddedDiv>
        <PaddedDiv>
            <RowSpaceBetween>
                <TextField key="approveERC20AmountKey" value={props.approveERC20Amount} onChange={props.approveERC20AmountSetter} type="number" label="Approve Amount" variant="filled"></TextField>
                <Display>{props.erc20Allowance}</Display>
                <Button sx={{ width: "93px" }} onClick={props.approveERC20} variant="contained">Approve</Button>
            </RowSpaceBetween>
        </PaddedDiv>
    </Box>
}

export function NftTransferElements(props: any) {
    return <Box>
        <PaddedDiv>
            <RowSpaceBetween>
                <TextField value={props.erc721Address} onChange={props.erc721ContractAddressSetter} key="ERC721ContractAddress" variant="filled" sx={{ marginBottom: "20p", width: "100%" }} label="NFT Contract Address" ></TextField>
                <Button onClick={props.getERC721Balance} sx={{ width: "100px" }} variant="outlined">Balance</Button>
            </RowSpaceBetween>
        </PaddedDiv>
        <PaddedDiv>
            <Display key="displayNFTbalance" >
                {props.erc721Balance}
            </Display>
        </PaddedDiv>
        <PaddedDiv>
            <TextField value={props.transferERC721To} onChange={props.transferERC721ToSetter} key="transferERC721TokenTo" variant="filled" sx={{ marginBottom: "20p", width: "100%" }} label="Transfer To" ></TextField>
        </PaddedDiv>
        <PaddedDiv>
            <RowSpaceBetween>
                <TextField key="transferERC721TokenId" value={props.transferERC721TokenId} onChange={props.transferERC721TokenIdSetter} type="number" label="Token Id" variant="filled"></TextField>
                <Button onClick={props.transferERC721} variant="contained">Transfer</Button>
            </RowSpaceBetween>
        </PaddedDiv>
    </Box>
}
export function ApproveNFTElements(props: any) {
    return <Box>
        <PaddedDiv>
            <RowSpaceBetween>
                <TextField value={props.erc721Address} onChange={props.erc721ContractAddressSetter} key="ERC721ContractAddress" variant="filled" sx={{ marginBottom: "20p", width: "100%" }} label="NFT Contract Address" ></TextField>
                <Button onClick={props.getERC721Balance} sx={{ width: "100px" }} variant="outlined">Balance</Button>
            </RowSpaceBetween>
        </PaddedDiv>
        <PaddedDiv>
            <Display key="displayNFTbalance">
                {props.erc721Balance}
            </Display>
        </PaddedDiv>
        <PaddedDiv>
            <RowSpaceBetween>
                <TextField value={props.approveERC721To} onChange={props.approveERC721ToSetter} key="approveERC721TokenTo" variant="filled" sx={{ marginBottom: "20px", width: "100%" }} label="Spender" ></TextField>
                <Button onClick={props.getERC721Allowance} sx={{ width: "100px" }} variant="outlined">Allowance</Button>
            </RowSpaceBetween>
        </PaddedDiv>
        <PaddedDiv>
            <Display key="displayApprovalNFT" >
                {props.approveForAllChecked ? props.isApprovedForAll : props.isTokenIdApproved}
            </Display>
        </PaddedDiv>
        <PaddedDiv>
            <RowSpaceBetween>
                <TextField disabled={props.approveForAllChecked} key="ERC721TokenId" value={props.approveERC721TokenId} onChange={props.approveERC721TokenIdSetter} type="number" label="Token Id" variant="filled"></TextField>
                <FormGroup>
                    <FormControlLabel control={<Switch checked={props.approveAllowance} onChange={props.approveAllowanceSetter} />} label={"Approve"} />
                    <FormControlLabel control={<Switch checked={props.approveForAllChecked} onChange={props.approveForAllCheckedSetter} />} label="For All" />
                </FormGroup>
                <Button onClick={props.approveERC721} variant="contained">Submit</Button>
            </RowSpaceBetween>
        </PaddedDiv>
    </Box>
}

export const ResetCommitmentElements = (props: any) =>
    <Box>
        <PaddedDiv>
            <Typography component="p" variant="subtitle1">Commitment: {props.currentCommitment}</Typography>
        </PaddedDiv>
        <PaddedDiv>
            <RowSpaceBetween>
                <ScanNoteButton setData={props.setNewCommitment} handleError={props.displayError}></ScanNoteButton>
                <TextField value={props.newCommitment} onChange={props.newCommitmentSetter} key="newCommitmentField" variant="filled" sx={{ width: "100%" }} label="New Commitment" disabled></TextField>
                <Button onClick={props.resetCommitment} variant="contained">Reset</Button>
            </RowSpaceBetween>
        </PaddedDiv>
        <PaddedDiv>
            <RowSpaceBetween>
                <Typography component={"p"} variant="subtitle1">Scan the Wallet Note Commitment from App to reset the commitment!</Typography>
            </RowSpaceBetween>
        </PaddedDiv>
    </Box>
