pragma circom 2.0.0;
include "../utils/CommitmentHasher.circom";

// Prove that you own the smart contract with a ZKP

template IsOwner(){
        // Public inputs 
    signal input commitmentHash; // The commitment hash of the smart contract
    signal input smartContractWallet; // The address of the smart contract wallet
    signal input tokenAddress; // The address of the ERC20 to transfer could be zero address for ETH transaction
    signal input transferTo; // The address to transfer to
    signal input transferAmount; // the amount to transfer
    signal input relayer;

    // Secret inputs
    signal input nullifier;
    signal input secret;

    // hidden signals to make sure this is only used on that smart contract
    signal smartContractWalletSquare;
    signal tokenAddressSquare;
    signal transferToSquare;
    signal transferAmountSquare;
    signal relayerSquare;
    // hashing the commitment and the nullifier
    component commitmentHasher = CommitmentHasher();

    commitmentHasher.nullifier <== nullifier;
    commitmentHasher.secret <== secret;

    // Assert that the hashes are correct
    commitmentHasher.commitment === commitmentHash;

    // The exra signals to avoid tampering later
    smartContractWalletSquare <== smartContractWallet * smartContractWallet;
    tokenAddressSquare <== tokenAddress * tokenAddress;
    transferToSquare <== transferTo * transferTo;
    transferAmountSquare <== transferAmount * transferAmount;
    relayerSquare <== relayer * relayer;    
}

component main {public [commitmentHash,smartContractWallet,tokenAddress,transferTo,transferAmount,relayer]} = IsOwner();