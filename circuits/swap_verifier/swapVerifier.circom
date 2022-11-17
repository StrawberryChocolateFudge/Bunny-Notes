pragma circom 2.0.0;

include "../utils/CommitmentHasher.circom";

template SwapVerifier(){
    // Public inputs
    signal input commitmentHash; // The commitment hash of the smart contract
    signal input smartContractWallet; // The address of the smart contract wallet
    signal input tokenIn; // The address of the token swapped
    signal input tokenOut; // The address of the token we swap for
    signal input amountIn; // The amount of tokens swapped
    signal input recipient; // The address that will get the tokens
    signal input amountOutMinimum; // The minimum amount to recieve
    signal input relayer; // the address of the relayer
    signal input poolFee; // The selected pool fee

    // Secret inputs
    signal input nullifier;
    signal input secret;

    // hidden signals to make sure the parameters cannot be altered

    signal smartContractWalletSquare;
    signal tokenInSquare;
    signal tokenOutSquare;
    signal amountInSquare;
    signal recipentSquare;
    signal amountOutMinimumSquare;
    signal relayerSquare;
    signal poolFeeSquare;
    

    // hashing the commitment and the nullifier
    component commitmentHasher = CommitmentHasher();

    commitmentHasher.nullifier <== nullifier;
    commitmentHasher.secret  <== secret;

    //Assert that the hashes are correct
    commitmentHasher.commitment === commitmentHash;

    // The extra signals to avoid tampering later
    smartContractWalletSquare <== smartContractWallet * smartContractWallet;
    tokenInSquare <== tokenIn * tokenIn;
    tokenOutSquare <== tokenOut * tokenOut;
    amountInSquare <== amountIn * amountIn;
    recipentSquare <== recipient * recipient;
    amountOutMinimumSquare <== amountOutMinimum * amountOutMinimum;
    relayerSquare <== relayer *relayer;
    poolFeeSquare <== poolFee * poolFee;
}

component main {public [commitmentHash, smartContractWallet,tokenIn,tokenOut,amountIn,recipient,amountOutMinimum,relayer]} = SwapVerifier();