pragma circom 2.0.0;
include "../utils/CommitmentHasher.circom";

// Prove that you own the smart contract with a ZKP

template IsOwner(){
        // Public inputs 
    signal input commitmentHash; // The commitment hash of the smart contract
    signal input smartContractWallet; // The address of the smart contract wallet
    signal input relayer; // The address that relays this transaction
    signal input paramsHash; // The hash of the parameters values passed to the solidity function, for verification!
    
    // Secret inputs
    signal input nullifier;
    signal input secret;

    // hidden signals to make sure this is only used on that smart contract
    signal smartContractWalletSquare;
    signal relayerSquare;
    signal paramsHashSquare;
    
   // The exra signals to avoid tampering later
    smartContractWalletSquare <== smartContractWallet * smartContractWallet;
    paramsHashSquare <== paramsHash * paramsHash;
    relayerSquare <== relayer * relayer;

    // hashing the commitment and the nullifier
    component commitmentHasher = CommitmentHasher();

    commitmentHasher.nullifier <== nullifier;
    commitmentHasher.secret <== secret;

    // Assert that the hashes are correct
    commitmentHasher.commitment === commitmentHash; 
}

component main {public [commitmentHash,smartContractWallet,relayer,paramsHash]} = IsOwner();