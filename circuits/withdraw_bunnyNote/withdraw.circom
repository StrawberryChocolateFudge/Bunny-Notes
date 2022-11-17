pragma circom 2.0.0;
include "../utils/CommitmentHasher.circom";


template Withdraw(){
    signal input nullifierHash;
    signal input commitmentHash;

    signal input recepient;
    signal input change;

   signal input nullifier;
   signal input secret;


   // hidden signals to make sure the recepient and fee cannot be tampered with later
   signal recepientSquare;
   signal feeSquare;
   signal changeSquare;

  // Hashing the commitment and the nullifier
  component commitmentHasher = CommitmentHasher();

  commitmentHasher.nullifier <== nullifier;
  commitmentHasher.secret <== secret;


  // Assert that the hashes are correct
  commitmentHasher.nullifierHash === nullifierHash;
  commitmentHasher.commitment === commitmentHash;

  // An extra signal to avoid tampering later
  recepientSquare <== recepient * recepient;
  changeSquare <== change * change;
}

component main {public [nullifierHash,commitmentHash,recepient,change]} = Withdraw();