import { AppBar, Button, Grid, Paper, Stack, Toolbar, Tooltip, Typography, CircularProgress, Switch } from "@mui/material";
import { ethers } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import React from "react";
import { serializeTree } from "../../lib/BunnyBundle";
import { toNoteHex } from "../../lib/BunnyNote";
import { downloadBunnyBundlePDF } from "../pdf";
import { isRelayerOnline, uploadMerkleTree } from "../web3/relayer";
import { getNetworkNameFromId, ZEROADDRESS, handleNetworkSelect, getContract, bunnyBundles, calculateFee, ERC20Approve, bundle_depositToken, bundle_depositEth, requestAccounts } from "../web3/web3";
import { CardType } from "./CardGrid";

interface DownloadBundleProps {
    cardType: CardType;
    bundleDetails: any;
    bundleFee: string;
    bundleValue: string;
    bundleCurrency: String;
    bundleSize: number;
    downloadClicked: boolean;
    setDownloadClicked: (boolean) => void;
    displayError: (msg) => void;
    showApproval: boolean;
    setShowApproval: (to: boolean) => void;
    setRenderDownloadPage: (to: boolean) => void;
    bundleAddresses: [string, string];
    selectedNetwork: string,
    depositButtonDisabled: boolean;
    setDepositButtonDisabled: (to: boolean) => void;
    isFeeless: boolean;
    downloadBundlePressed: boolean;
    setDownloadBundlePressed: (to: boolean) => void;
    downloadSwitchOn: boolean;
    setDownloadSwitchOn: (setTo: boolean) => void;
}

// TODO: This is UNTESTED!! TEST THE BUNNY BUNDLES

export function downloadBundle(props: DownloadBundleProps) {
    const denominationAndCurr = `${props.bundleValue}${props.bundleCurrency}`;
    const displayedFee = `${props.bundleFee} ${props.bundleCurrency}`;

    const erc20Address = props.bundleAddresses[0];
    const bundleContractAddress = props.bundleAddresses[1];

    const isNativeToken = erc20Address === ZEROADDRESS;

    const networkName = getNetworkNameFromId(props.selectedNetwork);

    const bundleUnitPrice = parseEther(props.bundleValue).div(props.bundleSize);
    const formattedBundleUnitPrice = formatEther(bundleUnitPrice);

    const bearerText = `The smart contract on ${networkName} will pay the bearer on demand the sum of ${formattedBundleUnitPrice} ${props.bundleCurrency}`

    const backButtonClicked = () => {
        props.setRenderDownloadPage(false);
        props.setDepositButtonDisabled(true);
        props.setDownloadBundlePressed(false);
    }

    const downloadClick = async () => {
        props.setDownloadBundlePressed(true);
        if (!props.downloadSwitchOn) {
            setTimeout(async () => {
                await downloadBunnyBundlePDF({
                    bearerText,
                    bundleValue: denominationAndCurr,
                    bundleSize: props.bundleSize,
                    networkName,
                    cardType: props.cardType,
                    tokenAddress: isNativeToken ? "Native Token" : erc20Address,
                    bundle: props.bundleDetails
                }).then(() => {
                    downloadRecovery(props.bundleDetails);
                    props.setDownloadBundlePressed(false);
                    props.setDownloadClicked(true);
                    props.setDepositButtonDisabled(false);
                }).catch(err => {
                    props.setDownloadBundlePressed(false);
                })
            }, 1000);
        } else {
            downloadRecovery(props.bundleDetails)
            downloadNoteBundleFile(props.bundleDetails);
            props.setDownloadBundlePressed(false);
            props.setDownloadClicked(true);
            props.setDepositButtonDisabled(false);
        }

    }


    const handleDepositTx = async (tx) => {
        if (tx !== undefined) {
            await tx.wait().then(async (receipt) => {
                if (receipt.status === 1) {
                    const uploadRes = await uploadMerkleTree(
                        {
                            root: props.bundleDetails.root,
                            leaves: props.bundleDetails.leaves,
                            network: networkName

                        });
                    if (!uploadRes) {
                        props.displayError("Unable to cache public_merkletree. Try again on the verification page!");
                        return;
                    }
                    //navigate to the verify page and verify using root!
                } else {
                    // If the deposit transaction fails the deposit button will be reenabled
                    // This can happen if the deposit was dispatched too fast and the approval didn't succeed, yet
                    props.setDepositButtonDisabled(false);
                }
            })
        }
    }

    const handleApprovalTx = async (tx, bundleContract, root, depositAmount, size) => {
        if (tx !== undefined) {
            await tx.wait().then(async (receipt) => {
                if (receipt.status === 1) {
                    await handleDepositToken(bundleContract, root, depositAmount, size)
                }
            })
        }
    }

    const handleDepositToken = async (bundleContract, root, depositAmount, size) => {
        const tx = await bundle_depositToken(bundleContract, toNoteHex(root), depositAmount, size, erc20Address).catch(err => {
            if (err.message.includes("underlying network changed")) {
                props.displayError("Underlying error changed! Refresh the application!")
                return;
            }
            props.displayError("Unable to deposit ERC20 Note");
            props.setDepositButtonDisabled(false);
        });
        await handleDepositTx(tx);
    }

    const depositWithOwnerAddress = async (provider) => {
        await requestAccounts(provider);
        const bundleContract = await getContract(provider, bundleContractAddress, "/BunnyBundles.json");
        const bundle = await bunnyBundles(bundleContract, toNoteHex(props.bundleDetails.root));
        if (bundle.creator !== ZEROADDRESS) {
            props.displayError("Invalid root. Bundle already exists!");
            return;
        }

        if (props.showApproval && !isNativeToken) {
            // approve the spend, need to approve for the fee
            const fee = await calculateFee(bundleContract, parseEther(props.bundleValue));
            const approveAmount = props.isFeeless ? ethers.utils.parseEther(props.bundleValue) : fee.add(ethers.utils.parseEther(props.bundleValue));

            if (erc20Address === "") {
                props.displayError("Token address missing. Maybe you are on testnet?")
            }

            const ERC20Contract = await getContract(provider, erc20Address, "/ERC20.json");
            props.setDepositButtonDisabled(true);
            props.setShowApproval(false);
            const tx = await ERC20Approve(ERC20Contract, bundleContractAddress, approveAmount).catch((err) => {
                props.setShowApproval(true);
            });

            await handleApprovalTx(tx, bundleContract, props.bundleDetails.root, props.bundleValue, props.bundleSize);
            return;

        } else {
            props.setDepositButtonDisabled(true);
            // Check if the commitment exists already to stop the deposit!
            if (isNativeToken) {
                const tx = await bundle_depositEth(
                    bundleContract,
                    toNoteHex(props.bundleDetails.root),
                    parseEther(props.bundleValue),
                    props.bundleSize).catch(err => {
                        props.displayError("Unable to deposit Bundle");
                        props.setDepositButtonDisabled(false);
                    }).catch(err => {
                        {
                            if (err.message.includes("underlying network changed")) {
                                props.displayError("Underlying error changed! Refresh the application!")
                            }
                        }
                    });
                await handleDepositTx(tx);
                return;
            } else {
                await handleDepositToken(bundleContract, toNoteHex(props.bundleDetails.root), props.bundleValue, props.bundleSize)
                return;
            }
        }
    }


    const depositClick = async () => {
        if (!props.downloadClicked) {
            props.displayError("You need to download the Bundle before you can make a deposit!");
            return;
        }

        const isOnline = await isRelayerOnline();
        if (!isOnline) {
            props.displayError("Relayer is offline. We can't cache the public_merkletree for you!")
        }

        //When it's done upload the file to the server!
        const provider = await handleNetworkSelect(props.selectedNetwork, props.displayError)
        await depositWithOwnerAddress(provider);

    }

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setDownloadSwitchOn(event.target.checked);
    };


    return <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden' }}>
        <AppBar
            position="static"
            color="default"
            elevation={0}
            sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
        >
            <Toolbar>
                <Grid container spacing={2} alignItems="center" sx={{ paddingTop: "20px" }}>
                    <Grid item>
                        <Tooltip arrow title="Go back">
                            <Button disabled={props.downloadBundlePressed} onClick={backButtonClicked}>Back</Button>
                        </Tooltip>
                    </Grid>
                    <Grid item>

                        <Tooltip arrow title="Download the Bundle">
                            <Button onClick={downloadClick} variant="contained" sx={{ mr: 1, fontWeight: 800 }}> {props.downloadBundlePressed ? <CircularProgress sx={{ color: "white" }} /> : `Download ${props.bundleSize} X ${formattedBundleUnitPrice} ${props.bundleCurrency} Bunny Notes`}</Button>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Stack direction="row" sx={{ marginLeft: "10px" }}>
                            <Typography sx={{ alignSelf: "center" }} variant="subtitle2" component="div">PDF</Typography>
                            <Switch checked={props.downloadSwitchOn} onChange={handleSwitchChange} />
                            <Typography sx={{ alignSelf: "center" }} variant="subtitle2" component="div">JSON</Typography>
                        </Stack>
                    </Grid>

                    <Grid item sx={{ margin: "0 auto" }}>
                        <Stack sx={{ textAlign: "center" }}>
                            <Typography variant="h6" component="div">{"Deposit " + denominationAndCurr}</Typography>
                        </Stack>
                        {props.isFeeless ? null :
                            <Stack sx={{ textAlign: "center" }}>
                                <Typography variant="subtitle2" component="div">
                                    plus 1% fee ({displayedFee})
                                </Typography>
                            </Stack>}
                        <Grid item sx={{ textAlign: "center", paddingBottom: "20px", marginTop: "20px" }}>

                            {props.showApproval && !isNativeToken ? <Tooltip arrow title={"Approve spending " + denominationAndCurr + ` (plus ${displayedFee} fee)`}>
                                <span><Button onClick={depositClick} sx={{ marginBottom: "10px" }} variant="contained">Approve Spend<img width="35px" src="/imgs/metamaskFox.svg" /></Button></span></Tooltip> : <Tooltip arrow title={"Deposit " + denominationAndCurr + ` (plus ${displayedFee} fee)`}>
                                <span><Button disabled={props.depositButtonDisabled} onClick={depositClick} sx={{ marginBottom: "10px" }} variant="contained">Deposit<img width="35px" src="/imgs/metamaskFox.svg" /></Button></span></Tooltip>}
                        </Grid>
                        <Grid item sx={{ textAlign: "left", paddingBottom: "20px", marginTop: "20px" }}>
                            <Typography variant="subtitle1" component="div">
                                Make sure to download the bundle before making the deposit! If you loose the bundle the deposit will be lost!<br /> You can download multiple files. The <strong>public_merkletree file is public</strong> and needed for withdrawals. The relayer will cache it! The other files are either pdfs or json. Those are your bunny notes and only you have access to them! Keep them safe!
                                <br />
                                <strong>If you loose your Bunny Notes we are not able to recover them for you!</strong>
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar >
    </Paper >
}

function downloadRecovery(bundle) {
    downloadTextFile(serializeTree(bundle.root, bundle.leaves), `public_merkletree-${bundle.root}.json`);
}

function downloadNoteBundleFile(bundle) {
    downloadTextFile(JSON.stringify(bundle.bunnyBundle), `bunnyBundle-${bundle.root}.json`)
}

function downloadTextFile(text, name) {
    const a = document.createElement('a');
    const type = name.split(".").pop();
    a.href = URL.createObjectURL(new Blob([text], { type: `text/${type === "txt" ? "plain" : type}` }));
    a.download = name;
    a.click();
}
