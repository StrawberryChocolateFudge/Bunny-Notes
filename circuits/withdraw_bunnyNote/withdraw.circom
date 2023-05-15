pragma circom 2.0.0;
include "../utils/CommitmentHasher.circom";


template Withdraw(){
    signal input nullifierHash;
    signal input commitmentHash;

   signal input recipient;
   
   signal input nullifier;
   signal input secret;


   // hidden signals to make sure the recipient cannot be tampered with later
   signal recipientSquare;

  // Hashing the commitment and the nullifier
  component commitmentHasher = CommitmentHasher();

  commitmentHasher.nullifier <== nullifier;
  commitmentHasher.secret <== secret;


  // Assert that the hashes are correct
  commitmentHasher.nullifierHash === nullifierHash;
  commitmentHasher.commitment === commitmentHash;

  // An extra signal to avoid tampering later
  recipientSquare <== recipient * recipient;
}

component main {public [nullifierHash,commitmentHash,recipient]} = Withdraw();