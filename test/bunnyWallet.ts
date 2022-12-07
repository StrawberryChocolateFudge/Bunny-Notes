import { expect } from "chai";
import { ethers } from "hardhat";
import { parseEther } from "ethers/lib/utils";
import { setUpBunnyWallet, expectRevert } from "./setup";
import { ArgType, createBunnyWalletNote, parseOwnerNote, prepareRelayProof, relayedNoteNullifierHash, TransferERC721ParamsArgs } from "../lib/OwnerNote";
import { deposit, parseNote, toNoteHex } from "../lib/BunnyNote";
import { transferParamsHash } from "../lib/ParamsHasher";
import { generateIsOwnerProof, IsOwnerProofDetails } from "../lib/generateProof";
import packToSolidityProof from "../lib/packToSolidityProof";
import { getBalance } from "./bunnynotes_eth";
import { eventABIs, parseLog } from "../lib/EventInterfaces";

const zeroAddress = "0x0000000000000000000000000000000000000000";



describe("Bunny Wallet", async function () {
    it("Should set up a bunny wallet and change the commitment", async function () {
        const { owner, alice, bob, attacker, relayer, bunnyWallet, provider, note, isOwnerVerifier, network } = await setUpBunnyWallet();
        //Test trying to call the initializer again!
        const parsedNote = await parseOwnerNote(note);
        const commitment = toNoteHex(parsedNote.deposit.commitment);
        await expectRevert(
            async () => await bunnyWallet.initialize(
                isOwnerVerifier.address,
                commitment,
                alice.address),
            "Initializable: contract is already initialized"
        );

        //    Reset the commitment!
        const newNoteString = await createBunnyWalletNote({ smartContract: bunnyWallet.address, netId: network.chainId })
        const newNote = await parseOwnerNote(newNoteString);
        const newCommitment = toNoteHex(newNote.deposit.commitment);
        await expectRevert(
            async () => await bunnyWallet.resetCommitment(
                newCommitment,
            ),
            "Only owner"
        )

        expect(await bunnyWallet.commitment()).to.equal(commitment);
        const resetTx = await bunnyWallet.connect(alice).resetCommitment(newCommitment);
        const resetReceipt = await resetTx.wait();
        expect(await bunnyWallet.commitment()).to.equal(newCommitment);

        let log = parseLog(eventABIs.CommitmentReset, resetReceipt.logs[0]);
        expect(log.name).to.equal("CommitmentReset");
        expect(log.signature).to.equal("CommitmentReset(bytes32,bytes32)");
        expect(log.args.oldCommitment).to.equal(commitment);
        expect(log.args.newCommitment).to.equal(newCommitment);

    })

    it("Testing deposits and note creation, owner note parsing", async function () {
        const [bob] = await ethers.getSigners();
        const bunnyWalletNote = await createBunnyWalletNote({ smartContract: bob.address, netId: 1 });
        const parsedNote = await parseOwnerNote(bunnyWalletNote);
        const newNoteCreatedFromDeposit = await createBunnyWalletNote({ smartContract: bob.address, netId: 1, deposit: parsedNote.deposit })
        expect(bunnyWalletNote).to.equal(newNoteCreatedFromDeposit);

        // const deposit = await createDeposit({ nullifier: rbigint(), secret: rbigint() });
        const noteFromDeposit = await createBunnyWalletNote({ smartContract: bob.address, netId: 1, deposit: parsedNote.deposit })
        const parsedFromDeposit = await parseOwnerNote(noteFromDeposit);
        const noteFromParsed = await createBunnyWalletNote({ smartContract: bob.address, netId: 1, deposit: parsedFromDeposit.deposit })
        expect(noteFromDeposit).to.equal(noteFromParsed);
        // expect(deposit.commitment).to.equal(parsedFromDeposit.deposit.commitment);
    })

    it("Sending some eth to bunnyWallet should emit a Received event!", async function () {
        const { bob, bunnyWallet } = await setUpBunnyWallet();
        // const iface = new ethers.utils.Interface(eventABIs.Received);

        const totalBalance = await bunnyWallet.totalWeiReceived();

        expect(totalBalance).to.equal(parseEther("0"));

        const tx = await bob.sendTransaction(
            {
                to: bunnyWallet.address,
                value: parseEther("1")
            })

        const receipt = await tx.wait();
        let log = parseLog(eventABIs.Received, receipt.logs[0])

        // I expect a received event occured!!

        expect(log.name).to.equal("Received");
        expect(log.signature).to.equal("Received(address,uint256)");
        expect(log.args.from).to.equal(bob.address);
        expect(log.args.amount).to.equal(parseEther("1"));
        const newTotalBalance = await bunnyWallet.totalWeiReceived();
        expect(newTotalBalance).to.equal(parseEther("1"));
    })

    it("Verifier contract", async function () {
        const { isOwnerVerifier, note, bob, relayer, USDTM, alice, bunnyWallet } = await setUpBunnyWallet();
        const parsedNote = await parseOwnerNote(note);

        const { newNullifierHash, salt } = await relayedNoteNullifierHash(parsedNote.deposit.nullifier);

        const details: IsOwnerProofDetails = {
            secret: parsedNote.deposit.secret,
            nullifier: parsedNote.deposit.nullifier,
            salt,
            nullifierHash: newNullifierHash,
            commitmentHash: parsedNote.deposit.commitment,
            relayer: relayer.address,
            smartContract: bunnyWallet.address
        }

        const { proof, publicSignals } = await generateIsOwnerProof({ details })

        const solidityProof = packToSolidityProof(proof);

        const verificationResult = await isOwnerVerifier.verifyProof(
            [solidityProof[0], solidityProof[1]],
            [[solidityProof[2], solidityProof[3]], [solidityProof[4], solidityProof[5]]],
            [solidityProof[6], solidityProof[7]],
            [
                publicSignals[0],
                publicSignals[1],
                publicSignals[2],
                publicSignals[3]
            ]
        )
        expect(verificationResult).to.be.true;
    })

    it("transferTokenByOwner,transferTokenRelayed, ethByOwner, transferEThRelayed, params tests", async function () {

        const { USDTM, bunnyWallet, alice, bob, netId, relayer, note, provider } = await setUpBunnyWallet();

        // First Alice mints some USDTM for herself
        expect(await USDTM.balanceOf(alice.address)).to.equal(parseEther("0"));

        await USDTM.mint(alice.address, parseEther("100"));
        expect(await USDTM.balanceOf(alice.address)).to.equal(parseEther("100"));

        // then sends it to the bunny wallet
        await USDTM.connect(alice).transfer(bunnyWallet.address, parseEther("10"))

        expect(await USDTM.balanceOf(alice.address)).to.equal(parseEther("90"));
        expect(await USDTM.balanceOf(bunnyWallet.address)).to.equal(parseEther("10"));

        expect(await USDTM.balanceOf(bob.address)).to.equal(parseEther("0"));

        const parsedNote = await parseOwnerNote(note);

        await expectRevert(async () => await bunnyWallet.transferTokenByOwner(USDTM.address, bob.address, parseEther("1")), "Only owner");

        const transferTokenByOwnerTx = await bunnyWallet.connect(alice).transferTokenByOwner(USDTM.address, bob.address, parseEther("1"));
        const transferTokenByOwnerReceipt = await transferTokenByOwnerTx.wait();
        const transferTokenByOwnerLog = parseLog(eventABIs.TransferTokenByOwner, transferTokenByOwnerReceipt.logs[1]);
        expect(transferTokenByOwnerLog.name).to.equal("TransferTokenByOwner");
        expect(transferTokenByOwnerLog.signature).to.equal("TransferTokenByOwner(address,address,uint256)");
        expect(transferTokenByOwnerLog.args.token).to.equal(USDTM.address);
        expect(transferTokenByOwnerLog.args.to).to.equal(bob.address);
        expect(transferTokenByOwnerLog.args.amount).to.equal(parseEther("1"));

        // Transfer token tests
        expect(await USDTM.balanceOf(bob.address)).to.equal(parseEther("1"));

        expect(await USDTM.balanceOf(bunnyWallet.address)).to.equal(parseEther("9"));

        // A new nullifier hash is created, with random salt that makes this transaction non-replayable!!
        const { newNullifierHash, salt } = await relayedNoteNullifierHash(parsedNote.deposit.nullifier);
        const paramsHash = await transferParamsHash(toNoteHex(parsedNote.deposit.commitment), toNoteHex(newNullifierHash), USDTM.address, bob.address, parseEther("1"));

        const ownerProof = await generateIsOwnerProof({
            details: {
                secret: parsedNote.deposit.secret,
                nullifier: parsedNote.deposit.nullifier,
                nullifierHash: newNullifierHash,
                salt: salt,
                commitmentHash: parsedNote.deposit.commitment,
                smartContract: bunnyWallet.address,
                relayer: relayer.address,
            }
        });
        // ownerProof public signals:     
        // [0] = commitmentHash, [1] = smartcontractwallet, [2] = relayer, [3] = nullifierHash
        const proof = packToSolidityProof(ownerProof.proof);

        const getZKOwner = () => {
            return {
                proof,
                commitment: toNoteHex(ownerProof.publicSignals[0]),
                smartContract: bunnyWallet.address,
                relayer: relayer.address,
                paramsHash,
                nullifierHash: toNoteHex(newNullifierHash),
            }
        }

        // TransferParamsHash tests
        const transferParamsHashClient = await transferParamsHash(toNoteHex(parsedNote.deposit.commitment), toNoteHex(newNullifierHash), USDTM.address, bob.address, parseEther("1"));

        const transferParamsHashRPC = await bunnyWallet.connect(alice).transferParamsHash(getZKOwner(), USDTM.address, bob.address, parseEther("1"));

        expect(transferParamsHashClient).to.equal(transferParamsHashRPC);



        expect(await bunnyWallet.nullifierHashes(toNoteHex(newNullifierHash))).to.equal(false);

        await expectRevert(
            async () => await bunnyWallet.transferTokenRelayed(getZKOwner(), USDTM.address, bob.address, parseEther("1")), "Invalid Relayer")

        // now the relayer will transfer the transaction,

        const transferTokenRelayedTx = await bunnyWallet.connect(relayer).transferTokenRelayed(getZKOwner(), USDTM.address, bob.address, parseEther("1"));
        const transferTokenRelayedReceipt = await transferTokenRelayedTx.wait();
        const transferTokenRelayedLog = parseLog(eventABIs.TransferTokenByRelayer, transferTokenRelayedReceipt.logs[1])
        expect(transferTokenRelayedLog.name).to.equal("TransferTokenByRelayer");
        expect(transferTokenRelayedLog.signature).to.equal("TransferTokenByRelayer(address,address,uint256)");
        expect(transferTokenRelayedLog.args.token).to.equal(USDTM.address);
        expect(transferTokenRelayedLog.args.to).to.equal(bob.address);
        expect(transferTokenRelayedLog.args.amount).to.equal(parseEther("1"));

        // Now I expect this succeeded

        expect(await bunnyWallet.nullifierHashes(toNoteHex(newNullifierHash))).to.equal(true);


        await expectRevert(
            async () => await bunnyWallet.connect(relayer).transferTokenRelayed(
                getZKOwner(), USDTM.address, bob.address, parseEther("1")), "Proof used!");

        // Transfer ETH tests!

        // I expect the smart contract has no balance!
        const walletBalance = await getBalance(provider, bunnyWallet.address);

        expect(walletBalance).to.equal("0.0");

        // Now I transfer some eth to the smart contract walet
        const tx = await alice.sendTransaction({
            to: bunnyWallet.address,
            value: parseEther("1")
        });

        const walletBalance2 = await getBalance(provider, bunnyWallet.address);
        expect(walletBalance2).to.equal("1.0");

        await expectRevert(async () => await bunnyWallet.transferETHByOwner(bob.address, parseEther("1")), "Only owner");
        //Transfer eth by owner
        const transferEthByOwnerTx = await bunnyWallet.connect(alice).transferETHByOwner(bob.address, parseEther("0.1"));
        const transferEthByOwnerReceipt = await transferEthByOwnerTx.wait();
        const transferEthByOwnerLog = parseLog(eventABIs.TransferEthByOwner, transferEthByOwnerReceipt.logs[0]);

        expect(transferEthByOwnerLog.name).to.equal("TransferEthByOwner");
        expect(transferEthByOwnerLog.signature).to.equal("TransferEthByOwner(address,uint256)");
        expect(transferEthByOwnerLog.args.to).to.equal(bob.address);
        expect(transferEthByOwnerLog.args.amount).to.equal(parseEther("0.1"));

        const walletBalance3 = await getBalance(provider, bunnyWallet.address);
        expect(walletBalance3).to.equal("0.9");

        // Now I initiate the transaction with a zero knowledge proof argument!

        const { newNullifierHash: newNullifierHash2, salt: salt2 } = await relayedNoteNullifierHash(parsedNote.deposit.nullifier);

        const ownershipProof2 = await generateIsOwnerProof({
            details: {
                secret: parsedNote.deposit.secret,
                nullifier: parsedNote.deposit.nullifier,
                nullifierHash: newNullifierHash2,
                salt: salt2,
                commitmentHash: parsedNote.deposit.commitment,
                smartContract: bunnyWallet.address,
                relayer: relayer.address
            }
        });

        // owenershipProof2
        const proof2 = packToSolidityProof(ownershipProof2.proof);
        const paramsHash2 = await transferParamsHash(toNoteHex(parsedNote.deposit.commitment), toNoteHex(newNullifierHash2), USDTM.address, bob.address, parseEther("0.1"));

        const getZKOwner2 = () => {
            return {
                proof: proof2,
                commitment: toNoteHex(ownerProof.publicSignals[0]),
                smartContract: bunnyWallet.address,
                relayer: relayer.address,
                paramsHash: paramsHash2,
                nullifierHash: toNoteHex(newNullifierHash2)

            }
        }

        // Try to dispatch a transaction with modified parameters!
        await expectRevert(
            async () => await bunnyWallet.connect(relayer)
                .transferETHRelayed(
                    getZKOwner2(),
                    USDTM.address,
                    alice.address,
                    parseEther("10")), "Invalid Params");
        // Relayer is unable to alter the parameters of the function call!

        const transferEthRelayedTX = await bunnyWallet.connect(relayer).transferETHRelayed(
            getZKOwner2(),
            USDTM.address,
            bob.address,
            parseEther("0.1")
        );

        const transferEthRelayedReceipt = await transferEthRelayedTX.wait();
        let log = parseLog(eventABIs.TransferEthRelayed, transferEthRelayedReceipt.logs[0]);
        expect(log.name).to.equal("TransferEthRelayed");
        expect(log.signature).to.equal("TransferEthRelayed(address,uint256)");
        expect(log.args.to).to.equal(bob.address);
        expect(log.args.amount).to.equal(parseEther("0.1"));

    })

    it("approve ERC20 spend ", async function () {
        // Testing approve spend wallet functions
        const { USDTM, bunnyWallet, alice, bob, netId, relayer, note, provider } = await setUpBunnyWallet();

        // I expect the allowance of bunnyWallet to spend USDTM from alice is 0

        expect(await USDTM.allowance(alice.address, bunnyWallet.address)).to.equal(parseEther("0"));

        const approveSpendByOwnerTx = await bunnyWallet.connect(alice).approveERC20SpendByOwner(USDTM.address, alice.address, parseEther("1"));
        const approveSpendReceipt = await approveSpendByOwnerTx.wait();
        const approveSpendLog = parseLog(eventABIs.ApproveSpendByOwner, approveSpendReceipt.logs[1]);
        expect(approveSpendLog.name).to.equal("ApproveSpendByOwner");
        expect(approveSpendLog.signature).to.equal("ApproveSpendByOwner(address,address,uint256)");
        expect(approveSpendLog.args.token).to.equal(USDTM.address);
        expect(approveSpendLog.args.spender).to.equal(alice.address);
        expect(approveSpendLog.args.amount).to.equal(parseEther("1"));

        expect(await USDTM.allowance(alice.address, bunnyWallet.address));

        // Now check the approve spend relayed

        const zkOwner = await prepareRelayProof(
            note,
            bunnyWallet.address,
            relayer.address,
            ArgType.TransferParamsArgs,
            {
                token: USDTM.address,
                transferTo: alice.address,
                transferAmount: parseEther("3")
            });

        const approveSpendRelayedTx = await bunnyWallet.connect(relayer).approveERC20SpendRelayed(
            zkOwner,
            USDTM.address,
            alice.address,
            parseEther("3"));

        const approveSpendRelayedReceipt = await approveSpendRelayedTx.wait();
        const approveSpendRelayedLog = parseLog(eventABIs.ApproveSpendRelayed, approveSpendRelayedReceipt.logs[1]);
        expect(approveSpendRelayedLog.name).to.equal("ApproveSpendRelayed");
        expect(approveSpendRelayedLog.signature).to.equal("ApproveSpendRelayed(address,address,uint256)");
        expect(approveSpendRelayedLog.args.token).to.equal(USDTM.address);
        expect(approveSpendRelayedLog.args.spender).to.equal(alice.address);
        expect(approveSpendRelayedLog.args.amount).to.equal(parseEther("3"));
        expect(await USDTM.allowance(bunnyWallet.address, alice.address)).to.equal(parseEther("3"))

    })

    it("onERC721Received, transferERC721, ApproveRC721", async function () {
        const { NFT, alice, bunnyWallet, bob, relayer, note } = await setUpBunnyWallet();

        // Alice has no NFT
        expect(await NFT.balanceOf(alice.address)).to.equal(parseEther("0"));

        // Alice mints an NFT for herself
        await NFT.mintUniqueTokenTo(alice.address, 0);

        expect(await NFT.balanceOf(alice.address)).to.equal(1);

        // Now Alice will transfer her NFT to BOB

        // NOW I transfer this NFT to bunnyWallet.

        await NFT.connect(alice).transferFrom(alice.address, bunnyWallet.address, 0);
        // Now I expect the bunnyWallet got the token
        expect(await NFT.balanceOf(bunnyWallet.address)).to.equal(1);
        // Alice got zero tokens
        expect(await NFT.balanceOf(alice.address)).to.equal(0);


        // Let's mint a few more tokens and send it to the bunnyWallet
        await NFT.mintUniqueTokenTo(bunnyWallet.address, 1);
        await NFT.mintUniqueTokenTo(bunnyWallet.address, 2);
        await NFT.mintUniqueTokenTo(bunnyWallet.address, 3);
        await NFT.mintUniqueTokenTo(bunnyWallet.address, 4);

        expect(await NFT.balanceOf(bunnyWallet.address)).to.equal(5);

        // transferERC721ByOwner

        const transferERC721ByOwnerTx = await bunnyWallet.connect(alice).transferERC721ByOwner(NFT.address, bunnyWallet.address, alice.address, 0);
        const transferERC721ByOwnerReceipt = await transferERC721ByOwnerTx.wait();
        const transferERC721ByOwnerLogs = parseLog(eventABIs.TransferERC721ByOwner, transferERC721ByOwnerReceipt.logs[2]);
        expect(transferERC721ByOwnerLogs.name).to.equal("TransferERC721ByOwner");
        expect(transferERC721ByOwnerLogs.signature).to.equal("TransferERC721ByOwner(address,address,address,uint256)");
        expect(transferERC721ByOwnerLogs.args.token).to.equal(NFT.address);
        expect(transferERC721ByOwnerLogs.args.from).to.equal(bunnyWallet.address);
        expect(transferERC721ByOwnerLogs.args.to).to.equal(alice.address);
        expect(transferERC721ByOwnerLogs.args.tokenId).to.equal(0);

        expect(await NFT.balanceOf(bunnyWallet.address)).to.equal(4);
        expect(await NFT.balanceOf(alice.address)).to.equal(1);

        // transferERC721Relayed

        const zkOwner = await prepareRelayProof(
            note, bunnyWallet.address,
            relayer.address,
            ArgType.TransferERC721ParamsArgs,
            {
                token: NFT.address,
                transferFrom: bunnyWallet.address,
                transferTo: alice.address,
                tokenId: 1
            }
        );

        const transferERC721RelayedTx = await bunnyWallet.connect(relayer).transferERC721Relayed(zkOwner, NFT.address, bunnyWallet.address, alice.address, 1);
        const transferERC721RelayedReceipt = await transferERC721RelayedTx.wait();
        const transferERC721RelayedLogs = parseLog(eventABIs.TransferERC721Relayed, transferERC721RelayedReceipt.logs[2]);
        expect(transferERC721RelayedLogs.name).to.equal("TransferERC721Relayed");
        expect(transferERC721RelayedLogs.signature).to.equal("TransferERC721Relayed(address,address,address,uint256)");
        expect(transferERC721RelayedLogs.args.token).to.equal(NFT.address);
        expect(transferERC721RelayedLogs.args.from).to.equal(bunnyWallet.address);
        expect(transferERC721RelayedLogs.args.to).to.equal(alice.address);
        expect(transferERC721RelayedLogs.args.tokenId).to.equal(1);

        expect(await NFT.balanceOf(bunnyWallet.address)).to.equal(3);
        expect(await NFT.balanceOf(alice.address)).to.equal(2);

        //approveERC721ByOwner
        //Let's see if token 2 is approved to be used by an account!
        expect(await NFT.getApproved(2)).to.equal(zeroAddress);

        // Now the owner of bunnyWallet will approve that for bob to spend!
        const approveERC721ByOwnerTx = await bunnyWallet.connect(alice).approveERC721ByOwner(NFT.address, bob.address, 2, false, true);
        const approveERC721ByOwnerReceipt = await approveERC721ByOwnerTx.wait();
        const approveERC721ByOwnerLogs = parseLog(eventABIs.ApproveERC721ByOwner, approveERC721ByOwnerReceipt.logs[1]);
        expect(approveERC721ByOwnerLogs.name).to.equal("ApproveERC721ByOwner");
        expect(approveERC721ByOwnerLogs.signature).to.equal("ApproveERC721ByOwner(address,address,uint256,bool,bool)");
        expect(approveERC721ByOwnerLogs.args.token).to.equal(NFT.address);
        expect(approveERC721ByOwnerLogs.args.to).to.equal(bob.address);
        expect(approveERC721ByOwnerLogs.args.tokenId).to.equal(2);
        expect(approveERC721ByOwnerLogs.args.forAll).to.be.false;
        expect(approveERC721ByOwnerLogs.args.approved).to.be.true;

        expect(await NFT.getApproved(2)).to.equal(bob.address);

        // Test the same with relayed!!

        const zkOwner2 = await prepareRelayProof(
            note,
            bunnyWallet.address,
            relayer.address,
            ArgType.ApproveERC721ParamsArgs,
            { token: NFT.address, to: bob.address, tokenId: 2, forAll: false, approved: false });


        const approveERC721RelayedTx = await bunnyWallet.connect(relayer).approveERC721Relayed(zkOwner2, NFT.address, bob.address, 2, false, false);
        const approveERC721RelayedReceipt = await approveERC721RelayedTx.wait();
        const approveERC721RelayedLog = parseLog(eventABIs.ApproveERC721Relayed, approveERC721RelayedReceipt.logs[1]);
        expect(approveERC721RelayedLog.name).to.equal("ApproveERC721Relayed");
        expect(approveERC721RelayedLog.signature).to.equal("ApproveERC721Relayed(address,address,uint256,bool,bool)");
        expect(approveERC721RelayedLog.args.token).to.equal(NFT.address);
        expect(approveERC721RelayedLog.args.to).to.equal(bob.address);
        expect(approveERC721RelayedLog.args.tokenId).to.equal(2);
        expect(approveERC721RelayedLog.args.forAll).to.equal(false);
        expect(approveERC721RelayedLog.args.approved).to.equal(false);

        expect(await NFT.getApproved(2)).to.equal(zeroAddress);

        // Now test approve for all! I approve all the rest of the tokens to bob!
        const approveERC721ForAllTX = await bunnyWallet.connect(alice).approveERC721ByOwner(NFT.address, bob.address, 2, true, true);
        const approveERC721ForAllReceipt = await approveERC721ForAllTX.wait();
        const approveERC721ForAllLog = parseLog(eventABIs.ApproveERC721ByOwner, approveERC721ForAllReceipt.logs[1]);
        expect(approveERC721ForAllLog.name).to.equal("ApproveERC721ByOwner");
        expect(await NFT.isApprovedForAll(bunnyWallet.address, bob.address)).to.equal(true);

        // disapprove for all
        const approveNOTERC721ForAllTX = await bunnyWallet.connect(alice).approveERC721ByOwner(NFT.address, bob.address, 2, true, false);
        const approveNOTERC721ForAllReceipt = await approveNOTERC721ForAllTX.wait();
        const approveNOTERC721ForAllLog = parseLog(eventABIs.ApproveERC721ByOwner, approveNOTERC721ForAllReceipt.logs[1]);
        expect(approveNOTERC721ForAllLog.name).to.equal("ApproveERC721ByOwner");
        expect(await NFT.isApprovedForAll(bunnyWallet.address, bob.address)).to.equal(false);
    })

    it("deposit Bunny Notes ETHNotes,ERC20Notes ByOwner and Relayed!", async function () {
        const { relayer, USDTM, alice, bob, bunnyWallet, ETHNotes, ERC20Notes, provider, note } = await setUpBunnyWallet();

        // Deposit ETH with bunny wallet to a bunny notes contract
        // I expect the bunnyWallet has no ETH!
        const walletBalance = await getBalance(provider, bunnyWallet.address);
        expect(walletBalance).to.equal("0.0");

        // Now I deposit some ETH to the contract!
        await alice.sendTransaction(
            {
                to: bunnyWallet.address,
                value: parseEther("30")
            }
        )

        const walletBalance2 = await getBalance(provider, bunnyWallet.address);
        expect(walletBalance2).to.equal("30.0")

        //GONNA CREATE AN ETH NOTE FROM OWNER

        const bunnyNoteStringETHGiftCard = await deposit({ currency: "ETH", amount: 10, netId: 1337 });
        const parsedBunnyNoteETHGiftCard = await parseNote(bunnyNoteStringETHGiftCard);


        const depositToBunnyNoteETHGiftCardByOwnerTx = await bunnyWallet.connect(alice).depositToBunnyNoteByOwner(
            ETHNotes.address,
            zeroAddress, // passing zero address cuz this is not an erc 20 note
            toNoteHex(parsedBunnyNoteETHGiftCard.deposit.commitment),
            false, false);

        const depositToBunnyNoteETHGiftCardByOwnerReceipt = await depositToBunnyNoteETHGiftCardByOwnerTx.wait();
        const depositToBunnyNoteETHGiftCardByOwnerLog = parseLog(eventABIs.DepositBunnyNoteByOwner, depositToBunnyNoteETHGiftCardByOwnerReceipt.logs[1])
        expect(depositToBunnyNoteETHGiftCardByOwnerLog.name).to.equal("DepositBunnyNoteByOwner");
        expect(depositToBunnyNoteETHGiftCardByOwnerLog.signature).to.equal("DepositBunnyNoteByOwner(address,address,bytes32,bool,bool)");
        expect(depositToBunnyNoteETHGiftCardByOwnerLog.args._notesContract).to.equal(ETHNotes.address);
        expect(depositToBunnyNoteETHGiftCardByOwnerLog.args.token).to.equal(zeroAddress);
        expect(depositToBunnyNoteETHGiftCardByOwnerLog.args.commitment).to.equal(toNoteHex(parsedBunnyNoteETHGiftCard.deposit.commitment))
        expect(depositToBunnyNoteETHGiftCardByOwnerLog.args.cashNote).to.equal(false);
        expect(depositToBunnyNoteETHGiftCardByOwnerLog.args.isERC20).to.equal(false);
        // 10 eth + 1 eth fee was taken with the deposit!
        expect(await getBalance(provider, bunnyWallet.address)).to.equal("19.0");

        // I expect the note is valid!
        const ethGiftCardDepositCommitment = await ETHNotes.commitments(toNoteHex(parsedBunnyNoteETHGiftCard.deposit.commitment));
        expect(ethGiftCardDepositCommitment.used).to.be.true;
        expect(ethGiftCardDepositCommitment.creator).to.equal(bunnyWallet.address);
        expect(ethGiftCardDepositCommitment.cashNote).to.be.false;

        // Now I create a cash note with the same ETHNote contract!

        const bunnyNotesStringCashNote = await deposit({ currency: "ETH", amount: 10, netId: 1337 });
        const parsedBunnyNoteCashNote = await parseNote(bunnyNotesStringCashNote);

        const depositToBunnyNoteETHCashNoteByOwnerTx = await bunnyWallet.connect(alice).depositToBunnyNoteByOwner(
            ETHNotes.address,
            zeroAddress, // passing zero address cuz this is not an erc 20 note
            toNoteHex(parsedBunnyNoteCashNote.deposit.commitment),
            true, // Cash note
            false);
        const depositToBunnyNoteETHCashNoteByOwnerReceipt = await depositToBunnyNoteETHCashNoteByOwnerTx.wait();
        const depositToBunnyNoteETHCashNotebyOwnerLog = parseLog(eventABIs.DepositBunnyNoteByOwner, depositToBunnyNoteETHCashNoteByOwnerReceipt.logs[1]);
        expect(depositToBunnyNoteETHCashNotebyOwnerLog.name).to.equal("DepositBunnyNoteByOwner");
        expect(depositToBunnyNoteETHCashNotebyOwnerLog.signature).to.equal("DepositBunnyNoteByOwner(address,address,bytes32,bool,bool)");
        expect(depositToBunnyNoteETHCashNotebyOwnerLog.args._notesContract).to.equal(ETHNotes.address);
        expect(depositToBunnyNoteETHCashNotebyOwnerLog.args.token).to.equal(zeroAddress);
        expect(depositToBunnyNoteETHCashNotebyOwnerLog.args.commitment).to.equal(toNoteHex(parsedBunnyNoteCashNote.deposit.commitment));
        expect(depositToBunnyNoteETHCashNotebyOwnerLog.args.cashNote).to.equal(true);
        expect(depositToBunnyNoteETHCashNotebyOwnerLog.args.isERC20).to.equal(false);

        const ethCashNoteDepositCommitment = await ETHNotes.commitments(toNoteHex(parsedBunnyNoteCashNote.deposit.commitment));
        expect(ethCashNoteDepositCommitment.used).to.be.true;
        expect(ethCashNoteDepositCommitment.creator).to.equal(bunnyWallet.address);
        expect(ethCashNoteDepositCommitment.cashNote).to.be.true;

        //NOW I TEST ERC20 NOTES!!

        const bunnyNoteStringERC20GiftCard = await deposit({ currency: "USDTM", amount: 10, netId: 1337 });
        const parsedBunnyNoteERC20GiftCard = await parseNote(bunnyNoteStringERC20GiftCard);

        // I mint some USDTM to the bunnyWallet so it can deposit to create a NOTE
        await USDTM.mint(bunnyWallet.address, parseEther("10000"));

        const depositToBunnyNoteERC20GiftCardByOwnerTx = await bunnyWallet.connect(alice).depositToBunnyNoteByOwner(
            ERC20Notes.address,
            USDTM.address,
            toNoteHex(parsedBunnyNoteERC20GiftCard.deposit.commitment),
            false,
            true // This is an ERC20 Note
        )
        const depositToBunnyNoteERC20GiftCardByOwnerReceipt = await depositToBunnyNoteERC20GiftCardByOwnerTx.wait();
        const depositToBunnyNoteERC20GiftCardByOwnerLog = parseLog(eventABIs.DepositBunnyNoteByOwner, depositToBunnyNoteERC20GiftCardByOwnerReceipt.logs[6]);

        expect(depositToBunnyNoteERC20GiftCardByOwnerLog.name).to.equal("DepositBunnyNoteByOwner");
        expect(depositToBunnyNoteERC20GiftCardByOwnerLog.signature).to.equal("DepositBunnyNoteByOwner(address,address,bytes32,bool,bool)");
        expect(depositToBunnyNoteERC20GiftCardByOwnerLog.args._notesContract).to.equal(ERC20Notes.address);
        expect(depositToBunnyNoteERC20GiftCardByOwnerLog.args.token).to.equal(USDTM.address);
        expect(depositToBunnyNoteERC20GiftCardByOwnerLog.args.commitment).to.equal(toNoteHex(parsedBunnyNoteERC20GiftCard.deposit.commitment));
        expect(depositToBunnyNoteERC20GiftCardByOwnerLog.args.cashNote).to.equal(false);
        expect(depositToBunnyNoteERC20GiftCardByOwnerLog.args.isERC20).to.equal(true);

        const ERC20GiftCardDepositCommitment = await ERC20Notes.commitments(toNoteHex(parsedBunnyNoteERC20GiftCard.deposit.commitment));
        expect(ERC20GiftCardDepositCommitment.used).to.be.true;
        expect(ERC20GiftCardDepositCommitment.creator).to.equal(bunnyWallet.address);
        expect(ERC20GiftCardDepositCommitment.cashNote).to.be.false;

        // Now TEST relayed transactions!

        const relayed_bunnyWalletETHGiftCardNoteString = await deposit({ currency: "ETH", amount: 10, netId: 1337 });
        const relayed_parsedBunnyWalletETHGiftCardNote = await parseNote(relayed_bunnyWalletETHGiftCardNoteString);


        const relayedBunnyDepositzkOwner = await prepareRelayProof(
            note,
            bunnyWallet.address,
            relayer.address,
            ArgType.DepositToBunnyNote,
            {
                notesContract: ETHNotes.address,
                token: zeroAddress,
                newCommitment: toNoteHex(relayed_parsedBunnyWalletETHGiftCardNote.deposit.commitment),
                isCashNote: false,
                isERC20Note: false,
            })

        // send some more ETH to the bunnyWallet contract
        await alice.sendTransaction({ to: bunnyWallet.address, value: parseEther("30") });

        const relayed_depositToBunnyNotesETHGiftCard_tx = await bunnyWallet.connect(relayer).depositToBunnyNoteRelayed(
            relayedBunnyDepositzkOwner,
            ETHNotes.address,
            zeroAddress,
            toNoteHex(relayed_parsedBunnyWalletETHGiftCardNote.deposit.commitment),
            false,
            false
        );

        const relayedNoteCommitment = await ETHNotes.commitments(toNoteHex(relayed_parsedBunnyWalletETHGiftCardNote.deposit.commitment));
        expect(relayedNoteCommitment.used).to.equal(true);
        expect(relayedNoteCommitment.creator).to.equal(bunnyWallet.address);

        const relayed_depositToBunnyNotesETHGiftCard_Receipt = await relayed_depositToBunnyNotesETHGiftCard_tx.wait()
        const relayed_depositToBunnyNotesETHGiftCard_logs = parseLog(eventABIs.DepositBunnyNoteRelayed, relayed_depositToBunnyNotesETHGiftCard_Receipt.logs[1])

        expect(relayed_depositToBunnyNotesETHGiftCard_logs.name).to.equal("DepositBunnyNoteRelayed");
        expect(relayed_depositToBunnyNotesETHGiftCard_logs.signature).to.equal("DepositBunnyNoteRelayed(address,address,bytes32,bool,bool)");
        expect(relayed_depositToBunnyNotesETHGiftCard_logs.args._notesContract).to.equal(ETHNotes.address);
        expect(relayed_depositToBunnyNotesETHGiftCard_logs.args.token).to.equal(zeroAddress);
        expect(relayed_depositToBunnyNotesETHGiftCard_logs.args.commitment).to.equal(toNoteHex(relayed_parsedBunnyWalletETHGiftCardNote.deposit.commitment));
        expect(relayed_depositToBunnyNotesETHGiftCard_logs.args.cashNote).to.equal(false);
        expect(relayed_depositToBunnyNotesETHGiftCard_logs.args.isERC20).to.equal(false);

    })

    it("Test ownerValid function", async function () {
        const { note, bunnyWallet, alice, relayer, USDTM, bob } = await setUpBunnyWallet();
        const parsedNote = await parseOwnerNote(note);
        // A new nullifier hash is created, with random salt that makes this transaction non-replayable!!
        const { newNullifierHash, salt } = await relayedNoteNullifierHash(parsedNote.deposit.nullifier);
        const paramsHash = await transferParamsHash(toNoteHex(parsedNote.deposit.commitment), toNoteHex(newNullifierHash), USDTM.address, bob.address, parseEther("1"));

        const ownerProof = await generateIsOwnerProof({
            details: {
                secret: parsedNote.deposit.secret,
                nullifier: parsedNote.deposit.nullifier,
                nullifierHash: newNullifierHash,
                salt: salt,
                commitmentHash: parsedNote.deposit.commitment,
                smartContract: bunnyWallet.address,
                relayer: relayer.address,
            }
        });
        // ownerProof public signals:     
        // [0] = commitmentHash, [1] = smartcontractwallet, [2] = relayer, [3] = nullifierHash
        const proof = packToSolidityProof(ownerProof.proof);

        const getZKOwner = () => {
            return {
                proof,
                commitment: toNoteHex(ownerProof.publicSignals[0]),
                smartContract: bunnyWallet.address,
                relayer: relayer.address,
                paramsHash,
                nullifierHash: toNoteHex(newNullifierHash),
            }
        }

        const owner = getZKOwner();

        await bunnyWallet.connect(relayer).ownerValid(owner);
        //After this runs the nullfier hash will be saved in the contract
        expect(await bunnyWallet.nullifierHashes(owner.nullifierHash)).to.equal(true);

        await expectRevert(
            async () => await bunnyWallet.connect(relayer).ownerValid(
                owner
            ),
            "Proof used!"
        )
    })
})