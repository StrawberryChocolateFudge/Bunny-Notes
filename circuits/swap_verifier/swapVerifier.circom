pragma circom 2.0.0;

include "../utils/CommitmentHasher.circom";

template SwapVerifier(){
    // Public inputs
    signal input commitmentHash; // The commitment hash of the smart contract
    signal input smartContractWallet; // The address of the smart contract wallet
    signal input parameterHash;
    
    signal input relayer; // the address of the relayer
    
    // Secret inputs
    signal input nullifier;
    signal input secret;

    // hidden signals to make sure the parameters cannot be altered

    signal smartContractWalletSquare;
        
    signal relayerSquare;
    signal parameterHashSquare;

    // hashing the commitment and the nullifier
    component commitmentHasher = CommitmentHasher();

    commitmentHasher.nullifier <== nullifier;
    commitmentHasher.secret  <== secret;

    //Assert that the hashes are correct
    commitmentHasher.commitment === commitmentHash;

    // The extra signals to avoid tampering later
    smartContractWalletSquare <== smartContractWallet * smartContractWallet;

    relayerSquare <== relayer *relayer;
    parameterHashSquare <== parameterHash * parameterHash;
}

component main {public [commitmentHash, smartContractWallet,relayer,parameterHash]} = SwapVerifier();