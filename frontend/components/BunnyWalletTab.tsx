import { styled, AppBar, Box, Button, Grid, Paper, TextField, Toolbar, Typography, FormControl, InputLabel, Select, SelectChangeEvent, MenuItem, FormHelperText } from "@mui/material";
import * as React from "react";
import { Base } from "./Base";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet"
import { getChainId, getContract, getWalletCurrency, onBoardOrGetProvider, requestAccounts } from "../web3/web3";
import { getOwner, transferETHByOwner } from "../web3/Wallet";
import { utils } from "ethers";
import { BunnyWallet } from "../../typechain/BunnyWallet";

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

export default function BunnyWalletTab(props: BunnyWalletTabProps) {

    const [smartContractWallet, setSmartContractWallet] = React.useState("");
    const [connected, setConnected] = React.useState(false);
    const [walletBalance, setWalletBalance] = React.useState("0.0");
    const [walletCurrency, setWalletCurrency] = React.useState("");
    const [selectedAction, setSelectedAction] = React.useState("");
    const [formHelperText, setFormHelperText] = React.useState("");
    const [transferTo, setTransferTo] = React.useState("");
    const [transferAmount, setTransferAmount] = React.useState("");

    const transferToSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setTransferTo(event.target.value);
    }
    const transferAmountSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const value = parseFloat(event.target.value);
        if (!isNaN(value)) {
            setTransferAmount(value.toString())
        } else {
            setTransferAmount("");
        }

    }
    const setTransferETHAmountMax = () => {
        setTransferAmount(walletBalance);
    }

    async function transferETH() {

        if (transferTo.length !== 42) {
            props.displayError("Invalid Address to Transfer To!")
            return;
        }
        if (parseFloat(transferAmount) < 0) {
            props.displayError("Invalid Transfer Amount");
            return;
        }
        if (parseFloat(transferAmount) > parseFloat(walletBalance)) {
            props.displayError("Transfer Amount Too Large!");
            return;
        }
        const bunnyWallet = await getContract(props.provider, smartContractWallet, "/BunnyWallet.json") as BunnyWallet;
        const receipt = await transferETHByOwner(bunnyWallet, transferTo, transferAmount);
        const balance = await props.provider.getBalance(smartContractWallet);
        setWalletBalance(utils.formatEther(balance))

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
            case "ERC20Balance":
                setFormHelperText("Get the token balance of the wallet");
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
        const walletCurrency = getWalletCurrency(chainId)
        setWalletCurrency(walletCurrency);

        const balance = await provider.getBalance(smartContractWallet);
        setWalletBalance(utils.formatEther(balance))

    }




    const renderSelectedAction = () => {
        switch (selectedAction) {
            case "transferEth":
                return <TransferETHElements
                    transferTo={transferTo}
                    transferToSetter={transferToSetter}
                    transferAmount={transferAmount}
                    transferAmountSetter={transferAmountSetter}
                    setTransferETHAmountMax={setTransferETHAmountMax}
                    transferETH={transferETH}
                ></TransferETHElements>
            case "ERC20Balance":
                return <Erc20BalanceElements></Erc20BalanceElements>
            case "transferERC20":
                return <TransferERC20Elements></TransferERC20Elements>
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
                            <MenuItem value="ERC20Balance">Get Token Balance</MenuItem>
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
            <TextField key="transferEthToKey" value={props.transferTo} onChange={props.transferToSetter} sx={{ marginBottom: "20px", width: "100%" }} label="Transfer To" variant="filled"></TextField>
        </PaddedDiv>
        <PaddedDiv>
            <RowSpaceBetween>
                <div>
                    <TextField key="transferETHAmountKey" value={props.transferAmount} onChange={props.transferAmountSetter} type={"number"} label="Transfer Amount" variant="filled"></TextField>
                    <Button onClick={props.setTransferETHAmountMax} sx={{ top: "20%" }} variant="text">Max</Button>
                </div>
                <Button onClick={props.transferETH} variant="contained">Submit</Button>
            </RowSpaceBetween>
        </PaddedDiv>
    </Box>
}

const Erc20BalanceElements = () => <React.Fragment>ERC20 balance elements</React.Fragment>
const TransferERC20Elements = () => <React.Fragment>Transfer ERC20 Elements</React.Fragment>
const ApproveERC20Elements = () => <React.Fragment>Approve ERC20 Elements</React.Fragment>
const NftBalanceElements = () => <React.Fragment>NFT Balance ELements</React.Fragment>
const NftTransferElements = () => <React.Fragment>NFTTransfer Elements</React.Fragment>
const ApproveNFTElements = () => <React.Fragment>Approve NFT Elements</React.Fragment>
const ResetCommitmentElements = () => <React.Fragment>Reset commitment elements</React.Fragment>
