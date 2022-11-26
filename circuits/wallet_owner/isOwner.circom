pragma circom 2.0.0;
include "../utils/CommitmentHasher.circom";

// Prove that you own the smart contract with a ZKP
// IsOwner supports functions with 7 parameters. Functions with less must use padding!
template IsOwner(){
        // Public inputs 
    signal input commitmentHash; // The commitment hash of the smart contract
    signal input smartContractWallet; // The address of the smart contract wallet
    signal input relayer; // The address that relays this transaction
     
    // The nullifierHash is the product of hash(nullifier + salt)
    signal input nullifierHash;
    
    // Secret inputs
    signal input nullifier;
    signal input secret;

    // The Salt is a secret input that is different each time the proof is computed!
    // It's purpuse is to calculate the nullifierHash that is unique per relayed transaction!
    signal input salt;

    // hidden signals to make sure this is only used on that smart contract
    signal smartContractWalletSquare;
    signal relayerSquare;

   // The exra signals to avoid tampering later
    smartContractWalletSquare <== smartContractWallet * smartContractWallet;
    relayerSquare <== relayer * relayer;
 

    // hashing the commitment and the nullifier
    component commitmentHasher = CommitmentHasher();

    commitmentHasher.nullifier <== nullifier;
    commitmentHasher.secret <== secret;

    // Assert that the hashes are correct
    commitmentHasher.commitment === commitmentHash; 

    component nullifierWithSaltHasher = CommitmentHasher();
    nullifierWithSaltHasher.nullifier <== nullifier;
    nullifierWithSaltHasher.secret <== salt;

    // The commitment here is nullifier + salt
    nullifierWithSaltHasher.commitment === nullifierHash;
}

component main {public [commitmentHash,smartContractWallet,relayer,nullifierHash]} = IsOwner();