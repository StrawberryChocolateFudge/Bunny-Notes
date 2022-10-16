include "../node_modules/circomlib/circuits/poseidon.circom";

template CommitmentHasher(){
    signal input nullifier;
    signal input secret;
    signal output commitment;
    signal output nullifierHash;

    component commitmentPoseidon = Poseidon(2);

    commitmentPoseidon.inputs[0] <== nullifier;
    commitmentPoseidon.inputs[1] <== secret;

    commitment <== commitmentPoseidon.out;

    component nullifierPoseidon = Poseidon(1);

    nullifierPoseidon.inputs[0] <== nullifier;

    nullifierHash <== nullifierPoseidon.out;

}

template Withdraw(){
    signal input nullifierHash;
    signal input commitmentHash;

    signal input recipient;
    signal input fee;
    signal input change;

   signal input nullifier;
   signal input secret;


   // hidden signals to make sure the recipient and fee cannot be tampered with later
   signal recipientSquare;
   signal feeSquare;
   signal changeSquare;

  // Hashing the commitmetn and the nullifier
  component commitmentHasher = CommitmentHasher();

  commitmentHasher.nullifier <== nullifier;
  commitmentHasher.secret <== secret;


  // Assert that the hashes are correct
  commitmentHasher.nullifierHash === nullifierHash;
  commitmentHasher.commitment === commitmentHash;

  // An extra signal to avoid tampering later
  recipientSquare <== recipient * recipient;
  feeSquare <== fee * fee;
  changeSquare <== change * change;
}

component main {public [nullifierHash,commitmentHash,recipient,fee]} = Withdraw();