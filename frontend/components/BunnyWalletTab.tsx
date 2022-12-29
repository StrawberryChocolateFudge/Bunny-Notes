import { SelectChangeEvent, styled } from "@mui/material";
import * as React from "react";
import { Base } from "./Base";
import { AvailableERC20Token, getChainId, getContract, getWalletCurrencyFromFetchedChainId, onBoardOrGetProvider, requestAccounts } from "../web3/web3";
import { approveERC20SpendByOwner, approveERC721ByOwner, getOwner, resetCommitment, transferERC721ByOwner, transferETHByOwner, transferTokenByOwner } from "../web3/Wallet";
import { utils } from "ethers";
import { BunnyWallet } from "../../typechain/BunnyWallet";
import { IERC721 } from "../../typechain/IERC721"
import { formatEther, isAddress } from "ethers/lib/utils";
import { ApproveERC20Elements, ApproveNFTElements, NftTransferElements, ResetCommitmentElements, TransferERC20Elements, TransferETHElements, WalletConnected, WalletNotConnected } from "./utils/BunnyWalletElements";

interface BunnyWalletTabProps extends Base { }

const IMG = styled("img")({
    margin: "0 auto",
    width: "100%"
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

    const [erc20Allowance, setERC20Allowance] = React.useState("");
    const [approveERC20To, setApproveERC20To] = React.useState("");
    const [approveERC20Amount, setApproveERC20Amount] = React.useState("");


    const [erc721ContractAddress, setERC721ContractAddress] = React.useState("");

    const [erc721Balance, setERC721Balance] = React.useState("");

    const [transferERC721To, setTransferERC721To] = React.useState("");
    const [transferERC721TokenId, setTransferERC721TokenId] = React.useState("");

    const [approveERC721To, setApproveERC721To] = React.useState("");


    const [approveERC721TokenId, setApproveERC721TokenId] = React.useState("");

    const [approveForAllChecked, setApproveForAllChecked] = React.useState(false);
    const [approveAllowance, setApproveAllowance] = React.useState(false);

    const [isTokenIdApproved, setIsTokenIdApproved] = React.useState("");
    const [isApprovedForAll, setIsApprovedForAll] = React.useState("");

    const [currentCommitment, setCurrentCommitment] = React.useState("");
    const [newCommitment, setNewCommitment] = React.useState("");

    const transferEthToSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setTransferEthTo(event.target.value);
    }
    const transferERC20ToSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setTransferERC20To(event.target.value);
    }

    const approveERC20ToSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setApproveERC20To(event.target.value)
    }


    const erc721ContractAddressSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setERC721ContractAddress(event.target.value);
        setIsTokenIdApproved("");
        setIsApprovedForAll("");
        setERC721Balance("");
    }

    const transferERC721ToSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setTransferERC721To(event.target.value);
    }
    const transferERC721TokenIdSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setTransferERC721TokenId(event.target.value);
    }

    const approveERC721ToSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setApproveERC721To(event.target.value);
        setIsTokenIdApproved("");
        setIsApprovedForAll("");
    }

    const approveForAllCheckedSetter = (event: React.ChangeEvent<HTMLInputElement>) => {
        setApproveForAllChecked(event.target.checked);
        setIsTokenIdApproved("");
        setIsApprovedForAll("");
    }

    const approveAllowanceSetter = (event: React.ChangeEvent<HTMLInputElement>) => {
        setApproveAllowance(event.target.checked);
    }

    const approveERC721TokenIdSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setApproveERC721TokenId(event.target.value);
    }

    const newCommitmentSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setNewCommitment(event.target.value);
    }


    const setERC20AddressAndFetchBalance = async (data) => {
        if (data === null) {
            return;
        }
        let errorOccured = false;
        const contract = await getContract(props.provider, data.address, "/ERC20.json").catch(err => {
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

    const approveERC20AmountSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const value = parseFloat(event.target.value);
        if (!isNaN(value)) {
            setApproveERC20Amount(value.toString());
        } else {
            setApproveERC20Amount("");
        }
    }

    // TODO: THIS SETTER DON"T WORK!!
    const setTransferETHAmountMax = () => {
        setTransferEthAmount(walletBalance);
    }

    const setTransferERC20AmountMax = () => {
        setTransferERC20Amount(erc20Balance);
    }

    const walletAddressSetter = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSmartContractWallet(event.target.value);
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

    const showTokenName = (name) => {
        if (name === "Add ") {
            return ""
        } else {
            return name;
        }
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

        const erc20Contract = await getContract(props.provider, erc20Address.address, "/ERC20.json").catch(err => {
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
        setFormattedERC20Balance(`Balance: ${formatEther(balance)} ${showTokenName(erc20Address.name)}`);
        setERC20Balance(formatEther(balance));
    }

    async function approveERC20() {
        if (erc20Address === null) {
            return;
        }
        if (approveERC20Amount === "") {
            props.displayError("Invalid Approve Amount");
            return;
        }

        if (!isAddress(erc20Address.address)) {
            props.displayError("Invalid Contract Address");
            return;
        }
        let errorOccured = false;


        const erc20Contract = await getContract(props.provider, erc20Address.address, "/ERC20.json").catch(err => {
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

        if (!isAddress(approveERC20To)) {
            props.displayError("Invalid Spender Address");
            return;
        }

        if (parseFloat(approveERC20Amount) < 0) {
            props.displayError("Invalid Approve Amount");
            return;
        }

        const bunnyWallet = await getContract(props.provider, smartContractWallet, "/BunnyWallet.json") as BunnyWallet;
        const receipt = await approveERC20SpendByOwner(bunnyWallet, erc20Address.address, approveERC20To, approveERC20Amount);

        const allowance = await erc20Contract.allowance(smartContractWallet, approveERC20To).catch(err => {
            props.displayError("Unable to fetch allowance!")
            errorOccured = true;
        });

        if (errorOccured) {
            return;
        }

        setERC20Allowance(`Allowance: ${formatEther(allowance)} ${showTokenName(erc20Address.name)}`);

    }

    async function getERC20Allowance() {
        if (erc20Address === null) {
            return;
        }

        if (!isAddress(erc20Address.address)) {
            props.displayError("Invalid Contract Address");
            return;
        }
        let errorOccured = false;


        const erc20Contract = await getContract(props.provider, erc20Address.address, "/ERC20.json").catch(err => {
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

        if (!isAddress(approveERC20To)) {
            props.displayError("Invalid Spender Address");
            return;
        }

        const allowance = await erc20Contract.allowance(smartContractWallet, approveERC20To).catch(err => {
            props.displayError("Unable to fetch allowance!")
            errorOccured = true;
        });

        if (errorOccured) {
            return;
        }

        setERC20Allowance(`Allowance: ${formatEther(allowance)} ${showTokenName(erc20Address.name)}`);

    }


    async function transferERC721() {
        if (!isAddress(erc721ContractAddress)) {
            props.displayError("Invalid NFT Contract Address");
            return;
        }
        if (!isAddress(transferERC721To)) {
            props.displayError("Invalid Address To Transfer To!")
            return;
        }

        if (isNaN(parseInt(transferERC721TokenId))) {
            props.displayError("Invalid Token Id");
            return;
        }

        // check if the contract owns the token id
        const nftContract = await getContract(props.provider, erc721ContractAddress, "/ERC721.json") as IERC721;
        const currentOwner = await nftContract.ownerOf(transferERC721TokenId);

        if (currentOwner !== smartContractWallet) {
            props.displayError("You don't own this token!");
            return;
        }

        const bunnyWallet = await getContract(props.provider, smartContractWallet, "/BunnyWallet.json");


        const receipt = await transferERC721ByOwner(bunnyWallet, erc721ContractAddress, smartContractWallet, transferERC721To, transferERC721TokenId).catch((err) => {
            console.log(err)
            props.displayError("Unable to transfer token!")
        });
    }

    async function getERC721Allowance() {
        if (!isAddress(erc721ContractAddress)) {
            props.displayError("Invalid NFT Contract Address");
            return;
        }

        if (!isAddress(approveERC721To)) {
            props.displayError("Invalid Spender Address");
            return;
        }

        const nftContract = await getContract(props.provider, erc721ContractAddress, "/ERC721.json") as IERC721;
        let errorOccured = false;
        if (approveForAllChecked) {
            const isApproved = await nftContract.isApprovedForAll(smartContractWallet, approveERC721To).catch(err => {
                props.displayError("Unable to fetch approvals");
                errorOccured = true;
            });

            if (errorOccured) {
                setIsApprovedForAll("");
                return;
            }
            setIsApprovedForAll(isApproved ? "Address is approved for all" : "Address is not approved for all");
        } else {

            if (isNaN(parseInt(approveERC721TokenId))) {
                props.displayError("Invalid Token Id");
                return;
            }

            const tokenApprovedTo = await nftContract.getApproved(approveERC721TokenId).catch(err => {
                props.displayError("Unable to fetch approvals");
                errorOccured = true;
            });

            let message = "";

            if (errorOccured) {
                setIsTokenIdApproved(message);
                return;
            }

            if (tokenApprovedTo === "0x0000000000000000000000000000000000000000") {
                message = "Token is not approved to be spent";
            } else if (tokenApprovedTo === approveERC721To) {
                message = "Token is approved to spender!";
            } else {
                message = "Token is approved to " + tokenApprovedTo
            }
            setIsTokenIdApproved(message);
        }
    }

    async function approveERC721() {
        if (!isAddress(erc721ContractAddress)) {
            props.displayError("Invalid NFT Contract Address");
            return;
        }
        if (!isAddress(approveERC721To)) {
            props.displayError("Invalid Address to Approve");
            return;
        }
        let errorOccured = false;
        const bunnyWallet = await getContract(props.provider, smartContractWallet, "/BunnyWallet.json") as BunnyWallet;
        const nftContract = await getContract(props.provider, erc721ContractAddress, "/ERC721.json") as IERC721;

        if (approveForAllChecked) {

            const balanceOf = await nftContract.balanceOf(smartContractWallet);

            if (balanceOf.toNumber() === 0) {
                props.displayError("Token Balance is zero! Nothing to approve!");
                return;
            }

            const receipt = await approveERC721ByOwner(bunnyWallet, erc721ContractAddress, approveERC721To, "0", true, approveAllowance);
        } else {
            if (isNaN(parseInt(approveERC721TokenId))) {
                props.displayError("Invalid Token Id");
                return;
            }


            const ownerOfToken = await nftContract.ownerOf(approveERC721TokenId).catch(err => {
                props.displayError("Unable to fetch token id owner!");
                errorOccured = true;
            });

            if (errorOccured) {
                return;
            }

            if (ownerOfToken !== smartContractWallet) {
                props.displayError("You do not own the Token!");
                return;
            }

            const receipt = await approveERC721ByOwner(bunnyWallet, erc721ContractAddress, approveERC721To, approveERC721TokenId, false, approveAllowance);
        }

    }

    async function getERC721Balance() {
        if (!isAddress(erc721ContractAddress)) {
            props.displayError("Invalid Contract Address");
            return;
        }
        const nftContract = await getContract(props.provider, erc721ContractAddress, "/ERC721.json") as IERC721;
        let errorOccured = false;
        const balance = await nftContract.balanceOf(smartContractWallet).catch(err => {
            props.displayError("Unable to fetch balance")
            errorOccured = true;
        });

        if (errorOccured || balance === undefined) {
            return;
        }

        setERC721Balance(`The Smart Contract Wallet owns ${balance} ${balance.toNumber() === 1 ? "NFT" : "NFTs"}`)
    }

    async function callResetCommitment() {
        //Check if the commitment is a valid bytes32
        //TODO: Test with Wallet App!

        if (newCommitment === "") {
            props.displayError("Please scan the commitment from the app!")
            return;
        }

        let formatted;

        try {
            formatted = utils.formatBytes32String(newCommitment)
        } catch (err) {
            props.displayError("Invalid Commitment Format")

        }
        if (formatted === undefined) {
            return;
        }
        if (!utils.isBytesLike(formatted)) {
            props.displayError("Invalid Commitment");
            return;
        }

        const bunnyWallet = await getContract(props.provider, smartContractWallet, "/BunnyWallet.json") as BunnyWallet;

        const receipt = await resetCommitment(bunnyWallet, newCommitment.toString());
        setCurrentCommitment(newCommitment);
    }



    const actionSelector = async (event: SelectChangeEvent) => {
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
            case "transferERC721":
                setFormHelperText("Transfer your NFT to another wallet");
                break;
            case "approveERC721":
                setFormHelperText("Approve your NFT to be transferred by others");
                break;
            case "resetCommitment":

                // I can fetch the current commitment here
                const bunnyWallet = await getContract(props.provider, smartContractWallet, "/BunnyWallet.json");
                const commitment = await bunnyWallet.commitment().catch(err => {
                    props.displayError("Unable to fetch current commitment!")
                });
                if (commitment === undefined) {
                    return;
                }
                setCurrentCommitment(commitment);
                setFormHelperText("If your old wallet was lost you can reset the note")
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

        const chainId = await getChainId(provider);

        if (chainId !== parseInt(props.selectedNetwork)) {
            props.displayError("You are on the wrong network!");
            return;
        }


        setConnected(true);
        setNetId(chainId);
        const walletCurrency = getWalletCurrencyFromFetchedChainId(chainId)
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
                return <ApproveERC20Elements
                    netId={netId}
                    setERC20Address={setERC20AddressAndFetchBalance}
                    erc20Address={erc20Address}
                    erc20Allowance={erc20Allowance}
                    formattedERC20Balance={formattedERC20Balance}
                    approveERC20To={approveERC20To}
                    approveERC20ToSetter={approveERC20ToSetter}
                    approveERC20Amount={approveERC20Amount}
                    approveERC20AmountSetter={approveERC20AmountSetter}
                    approveERC20={approveERC20}
                    getERC20Allowance={getERC20Allowance}
                ></ApproveERC20Elements>
            case "transferERC721":
                return <NftTransferElements
                    netId={netId}
                    erc721ContractAddressSetter={erc721ContractAddressSetter}
                    erc721Address={erc721ContractAddress}
                    erc721Balance={erc721Balance}
                    getERC721Balance={getERC721Balance}
                    transferERC721To={transferERC721To}
                    transferERC721ToSetter={transferERC721ToSetter}
                    transferERC721TokenId={transferERC721TokenId}
                    transferERC721TokenIdSetter={transferERC721TokenIdSetter}
                    transferERC721={transferERC721}
                ></NftTransferElements>
            case "approveERC721":
                return <ApproveNFTElements
                    netId={netId}
                    erc721Address={erc721ContractAddress}
                    erc721ContractAddressSetter={erc721ContractAddressSetter}
                    erc721Balance={erc721Balance}
                    getERC721Balance={getERC721Balance}
                    approveERC721To={approveERC721To}
                    approveERC721ToSetter={approveERC721ToSetter}
                    getERC721Allowance={getERC721Allowance}
                    approveForAllChecked={approveForAllChecked}
                    approveForAllCheckedSetter={approveForAllCheckedSetter}
                    approveERC721={approveERC721}
                    approveAllowance={approveAllowance}
                    approveAllowanceSetter={approveAllowanceSetter}
                    approveERC721TokenIdSetter={approveERC721TokenIdSetter}
                    approveERC721TokenId={approveERC721TokenId}
                    isTokenIdApproved={isTokenIdApproved}
                    isApprovedForAll={isApprovedForAll}
                ></ApproveNFTElements>
            case "resetCommitment":
                return <ResetCommitmentElements
                    netId={netId}
                    displayError={props.displayError}
                    newCommitment={newCommitment}
                    newCommitmentSetter={newCommitmentSetter}
                    setNewCommitment={setNewCommitment}
                    resetCommitment={callResetCommitment}
                    currentCommitment={currentCommitment}
                ></ResetCommitmentElements>
            default:
                break;
        }
    }

    if (!connected) {
        return <WalletNotConnected
            smartContractWallet={smartContractWallet}
            walletAddressSetter={walletAddressSetter}
            setSmartContractWallet={setSmartContractWallet}
            connectButtonAction={connectButtonAction}
        ></WalletNotConnected>
    }
    else {
        return <WalletConnected
            smartContractWallet={smartContractWallet}
            walletBalance={walletBalance}
            walletCurrency={walletCurrency}
            selectedAction={selectedAction}
            actionSelector={actionSelector}
            formHelperText={formHelperText}
            renderSelectedAction={renderSelectedAction}
        ></WalletConnected>
    }
}

