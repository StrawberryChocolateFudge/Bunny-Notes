pragma circom 2.0.0;
include "../utils/CommitmentHasher.circom";

// I want to prove that commitmentHash and nullifierHash are correct
// And that the commitment is contained in the root without revealing the proof so I don't have to submit it to the blockchain!

// The tree has a hard coded 20 levels which is used here
template WithdrawBundledNote(levels){
    // Public inputs
    signal input nullifierHash;
    signal input commitmentHash;
    signal input recipient;
    signal input root; // The user root hash

    // private inputs
    signal input nullifier;
    signal input secret;
    signal input pathElements[levels]; // The merkle proof which is fixed size pathElements contains the elements 
    signal input pathIndices[levels]; // Indices contains if we hash left or right
    signal input commitmentIndex; // The index passed in where the calculated commitmentHash should be!

    // A hidden signal to validate the recipient cannot be tampered later
    signal recipientSquare;

    component commitmentHasher = CommitmentHasher();

    commitmentHasher.nullifier <== nullifier;
    commitmentHasher.secret <== secret;

    commitmentHasher.nullifierHash === nullifierHash;
    commitmentHasher.commitment === commitmentHash;

    // An extra signal to avoid tampering with the recipient

    recipientSquare <== recipient * recipient;

    // TODO :Calculate a root from the merkle proof and compare it to the root!
    // Check that the merkleProof contains the commitmentHash somewhere!

}

component main {public [nullifierHash,commitmentHash,recipient,root]} = WithdrawBundledNote(20);