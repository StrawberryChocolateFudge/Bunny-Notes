import { styled, AppBar, Box, Button, Grid, Paper, TextField, Toolbar, Typography, FormControl, InputLabel, Select, SelectChangeEvent, MenuItem, FormHelperText, Autocomplete, createFilterOptions } from "@mui/material";
import * as React from "react";
import { Base } from "./Base";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet"
import { AvailableERC20Token, getAvailableERC20Tokens, getChainId, getContract, getWalletCurrency, onBoardOrGetProvider, requestAccounts } from "../web3/web3";
import { getOwner, transferETHByOwner, transferTokenByOwner } from "../web3/Wallet";
import { Contract, utils } from "ethers";
import { BunnyWallet } from "../../typechain/BunnyWallet";
import { formatEther, isAddress } from "ethers/lib/utils";

interface BunnyWalletTabProps extends Base { }

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    width: "200px"
});

const Center = styled('div')({
    margin: '0 auto',
    textAlign: "center"
})

const ActionSelector = styled("div")({
    textAlign: "center",
    marginTop: "10px",
    marginBottom: "20px"
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

const Erc20BalanceDisplay = styled("div")({
    margin: "auto"
})

export default function BunnyWalletTab(props: BunnyWalletTabProps) {
    const [smartContractWallet, setSmartContractWallet] = React.useState("");
    const [connected, setConnected] = React.useState(false);
    const [netId, setNetId] = React.useState(0);
    const [walletBalance, setWalletBalance] = React.useState("0.0");
    const [walletCurrency, setWalletCurrency] = React.useState("");
    const [selectedAction, setSelectedAction] = React.useState("");
    const [formHelperText, setFormHelperText] = React.useState("");


    const [transferEthTo, setTransferEthTo] = React.useState("");
    const [transferEthAmount, setTransferEthAmount] = React.useState("");


    const [erc20Balance, setERC20Balance] = React.useState("");
    const [formattedERC20Balance, setFormattedERC20Balance] = React.useState("");
    const [erc20Address, setERC20Address] = React.useState<AvailableERC20Token | null>(null);
    const [transferERC20To, setTransferERC20To] = React.useState("");
    const [transferERC20Amount, setTransferERC20Amount] = React.useState("");

    const transferEthToSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setTransferEthTo(event.target.value);
    }
    const transferERC20ToSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setTransferERC20To(event.target.value);
    }

    const setERC20AddressAndFetchBalance = async (data) => {
        if (data === null) {
            return;
        }

        // Get the contract using the address and fetch the balance

        let errorOccured = false;

        const contract = await getContract(props.provider, data.address, "/MOCKERC20.json").catch(err => {
            props.displayError("Unable to connect to contract!");
            errorOccured = true;
        });

        if (errorOccured) {
            return;
        }
        const balance = await contract.balanceOf(smartContractWallet).catch(err => {
            props.displayError("Unable to fetch token balance!")
            errorOccured = true;
            setFormattedERC20Balance("");
            setERC20Balance("");
        });

        if (errorOccured) {
            return;
        }

        setERC20Address(data);
        setFormattedERC20Balance(`Balance:  ${formatEther(balance)} ${data.name}`);
        setERC20Balance(formatEther(balance));
    }

    const transferEthAmountSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const value = parseFloat(event.target.value);
        if (!isNaN(value)) {
            setTransferEthAmount(value.toString())
        } else {
            setTransferEthAmount("");
        }

    }

    const transferERC20AmountSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const value = parseFloat(event.target.value);
        if (!isNaN(value)) {
            setTransferERC20Amount(value.toString());
        } else {
            setTransferERC20Amount("");
        }
    }

    const setTransferETHAmountMax = () => {
        setTransferEthAmount(walletBalance);
    }

    const setTransferERC20AmountMax = () => {
        setTransferERC20Amount(erc20Balance);
    }

    async function transferETH() {

        if (!isAddress(transferEthTo)) {
            props.displayError("Invalid Address to Transfer To!")
            return;
        }
        if (parseFloat(transferEthAmount) < 0) {
            props.displayError("Invalid Transfer Amount");
            return;
        }
        if (parseFloat(transferEthAmount) > parseFloat(walletBalance)) {
            props.displayError("Transfer Amount Too Large!");
            return;
        }
        const bunnyWallet = await getContract(props.provider, smartContractWallet, "/BunnyWallet.json") as BunnyWallet;
        const receipt = await transferETHByOwner(bunnyWallet, transferEthTo, transferEthAmount);
        const balance = await props.provider.getBalance(smartContractWallet);
        setWalletBalance(utils.formatEther(balance))
    }

    async function transferERC20() {

        if (erc20Address === null) {
            return;
        }
        if (transferERC20Amount === "") {
            props.displayError("Invalid Transfer Amount");
            return;
        }

        if (!isAddress(erc20Address.address)) {
            props.displayError("Invalid Contract Address");
            return;
        }
        let errorOccured = false;

        const erc20Contract = await getContract(props.provider, erc20Address.address, "/MOCKERC20.json").catch(err => {
            props.displayError("Unable to connect to contract!");
            errorOccured = true;
        });
        // Tries to get balance to check if address is an ERC20 compatible contract!
        await erc20Contract.balanceOf(smartContractWallet).catch(err => {
            errorOccured = true;
            props.displayError("Unable to connect to contract");
        })

        if (errorOccured) {
            props.displayError("Invalid Contract");
            return;
        }

        if (!isAddress(transferERC20To)) {
            props.displayError("Invalid Address to Transfer To!");
            return;
        }
        if (parseFloat(transferERC20Amount) < 0) {
            props.displayError("Invalid Transfer Amount");
            return;
        }
        if (parseFloat(transferERC20Amount) > parseFloat(erc20Balance)) {
            props.displayError("Transfer Amount Too Large!");
            return;
        }

        const bunnyWallet = await getContract(props.provider, smartContractWallet, "/BunnyWallet.json") as BunnyWallet;
        const receipt = await transferTokenByOwner(bunnyWallet, erc20Address.address, transferERC20To, transferERC20Amount);

        const balance = await erc20Contract.balanceOf(smartContractWallet).catch(err => {
            errorOccured = true;
            props.displayError("Unable to fetch balance!");
        })

        if (errorOccured) {
            return;
        }
        setFormattedERC20Balance(`Balance: ${formatEther(balance)} ${erc20Address.name}`);
        setERC20Balance(formatEther(balance));
    }


    const walletAddressSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSmartContractWallet(event.target.value);
    }

    const actionSelector = (event: SelectChangeEvent) => {
        setSelectedAction(event.target.value as string);
        switch (event.target.value as string) {
            case "transferEth":
                setFormHelperText(`Transfer ${walletCurrency} to an address`);
                break;
            case "transferERC20":
                setFormHelperText("Transfer Tokens from the Bunny Wallet");
                break;
            case "approveERC20":
                setFormHelperText("Approve Spending from the Bunny Wallet");
                break;
            case "NFTBalance":
                setFormHelperText("Check the NFT balance of the Wallet");
                break;
            case "transferERC721":
                setFormHelperText("Transfer your NFT to another wallet");
                break;
            case "approveERC721":
                setFormHelperText("Approve your NFT to be transferred by others");
                break;
            case "resetCommitment":
                setFormHelperText("If your wallet was lost you can reset the note")
                break;
            default:
                break;
        }

    };

    const connectButtonAction = async () => {

        if (props.provider === null) {
            const provider = await onBoardOrGetProvider(props.displayError);
            if (provider) {
                await doConnect(provider)
            }
            props.setProvider(provider);
        } else {
            await doConnect(props.provider);
        }
    }

    const doConnect = async (provider) => {
        // Validate the smart contract wallet address
        if (smartContractWallet.length !== 42) {
            props.displayError("Invalid Smart Contract Wallet Address");
            return;
        }

        let errorOccured = false;
        // try to connect to the smart contract
        // The user must have selected the correct network in metamask
        const contract = await getContract(provider, smartContractWallet, "/BunnyWallet.json").catch(err => {
            props.displayError("Unable to Connect to Contract")
        });
        const owner = await getOwner(contract).catch(err => {
            props.displayError("Unable to Call Contract")
        });
        const userWalletAddress = await requestAccounts(provider).catch(err => {
            props.displayError("Unable to Request Account!")
        });

        if (errorOccured) {
            return;
        }

        if (owner === undefined) {
            return;
        }

        if (owner !== userWalletAddress) {
            props.displayError("You are not the owner of this smart contract!");
            return;
        }

        setConnected(true);
        const chainId = await getChainId(provider);
        setNetId(chainId);
        const walletCurrency = getWalletCurrency(chainId)
        setWalletCurrency(walletCurrency);

        const balance = await provider.getBalance(smartContractWallet);
        setWalletBalance(utils.formatEther(balance))

    }




    const renderSelectedAction = () => {
        switch (selectedAction) {
            case "transferEth":
                return <TransferETHElements
                    transferEthTo={transferEthTo}
                    transferEthToSetter={transferEthToSetter}
                    transferEthAmount={transferEthAmount}
                    transferEthAmountSetter={transferEthAmountSetter}
                    setTransferETHAmountMax={setTransferETHAmountMax}
                    transferETH={transferETH}
                ></TransferETHElements>
            case "transferERC20":
                return <TransferERC20Elements
                    netId={netId}
                    setERC20Address={setERC20AddressAndFetchBalance}
                    erc20Balance={erc20Balance}
                    formattedERC20Balance={formattedERC20Balance}
                    erc20Address={erc20Address}
                    transferERC20To={transferERC20To}
                    transferERC20ToSetter={transferERC20ToSetter}
                    transferERC20Amount={transferERC20Amount}
                    transferERC20AmountSetter={transferERC20AmountSetter}
                    setTransferERC20AmountMax={setTransferERC20AmountMax}
                    transferERC20={transferERC20}
                ></TransferERC20Elements>
            case "approveERC20":
                return <ApproveERC20Elements></ApproveERC20Elements>
            case "NFTBalance":
                return <NftBalanceElements></NftBalanceElements>
            case "transferERC721":
                return <NftTransferElements></NftTransferElements>
            case "approveERC721":
                return <ApproveNFTElements></ApproveNFTElements>
            case "resetCommitment":
                return <ResetCommitmentElements></ResetCommitmentElements>
            default:
                break;
        }
    }

    if (!connected) {
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
                            <TextField autoComplete='off' value={smartContractWallet} onChange={walletAddressSetter} fullWidth placeholder="Paste your Smart Contract Wallet Address Here" InputProps={{ disableUnderline: true, sx: { fontSize: 'default' } }} variant="standard" />
                        </Grid>
                        <Grid item>
                            <Button onClick={connectButtonAction} variant="contained">Connect</Button>
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
    else {
        return <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden' }}>
            <Box>
                <Typography variant="subtitle2" sx={{ padding: "5px", textAlign: "center" }}>Administer your Bunny Wallet. For best experience, use the Mobile App!</Typography>
                <Typography sx={{ padding: "5px", textAlign: "center" }} component={"p"} variant="subtitle1">{smartContractWallet}
                </Typography>
                <Typography sx={{ padding: "5px", textAlign: "center" }} component={"p"} variant="subtitle1">Balance: {walletBalance} {walletCurrency}
                </Typography>
            </Box>
            <Box>
                <ActionSelector>
                    <FormControl sx={{ minWidth: "100px" }}>
                        <InputLabel id="contract-actions-label">Actions</InputLabel>
                        <Select
                            labelId="contract-actions-label"
                            id="contract-actions-select"
                            value={selectedAction}
                            onChange={actionSelector}
                            label="Actions"
                        >
                            <MenuItem value="transferEth">Transfer {walletCurrency}</MenuItem>
                            <MenuItem value="transferERC20">Transfer Token</MenuItem>
                            <MenuItem value="approveERC20">Approve Token Spend</MenuItem>
                            <MenuItem value="NFTBalance">NFT Balance</MenuItem>
                            <MenuItem value="transferERC721">Transfer NFT</MenuItem>
                            <MenuItem value="approveERC721">Approve NFT</MenuItem>
                            <MenuItem value="resetCommitment">Reset Commitment</MenuItem>
                        </Select>
                        <FormHelperText>{formHelperText}</FormHelperText>
                    </FormControl>
                </ActionSelector>
            </Box>
            <Box>{renderSelectedAction()}</Box>
        </Paper>
    }
}

function TransferETHElements(props: any) {
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
                <Button onClick={props.transferETH} variant="contained">Submit</Button>
            </RowSpaceBetween>
        </PaddedDiv>
    </Box>
}


const filter = createFilterOptions<AvailableERC20Token>();

function TransferERC20Elements(props: any) {
    return <Box>
        <PaddedDiv>
            <Autocomplete
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

        </PaddedDiv>
        <PaddedDiv>
            <TextField value={props.transferERC20To} onChange={props.transferERC20ToSetter} key="transferERC20Token" variant="filled" sx={{ marginBottom: "20p", width: "100%" }} label="Transfer To"></TextField>
        </PaddedDiv>
        <PaddedDiv>
            <RowSpaceBetween>
                <div>
                    <TextField key="transferERC20AmountKey" value={props.transferERC20Amount} onChange={props.transferERC20AmountSetter} type={"number"} label="Transfer Amount" variant="filled"></TextField>
                    <Button onClick={props.setTransferERC20AmountMax} sx={{ top: "20%" }} variant="text">Max</Button>
                </div>
                <Erc20BalanceDisplay sx={{ top: "20%" }}>{props.formattedERC20Balance}</Erc20BalanceDisplay>
                <Button onClick={props.transferERC20} variant="contained">Submit</Button>
            </RowSpaceBetween>
        </PaddedDiv>
    </Box >
}

const ApproveERC20Elements = () => <React.Fragment>Approve ERC20 Elements</React.Fragment>
const NftBalanceElements = () => <React.Fragment>NFT Balance ELements</React.Fragment>
const NftTransferElements = () => <React.Fragment>NFTTransfer Elements</React.Fragment>
const ApproveNFTElements = () => <React.Fragment>Approve NFT Elements</React.Fragment>
const ResetCommitmentElements = () => <React.Fragment>Reset commitment elements</React.Fragment>
