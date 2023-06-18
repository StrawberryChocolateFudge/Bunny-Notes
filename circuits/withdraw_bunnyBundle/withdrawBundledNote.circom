pragma circom 2.0.0;
include "../utils/CommitmentHasher.circom";
include "../utils/merkleTree.circom";

template WithdrawBundledNote(levels){
    // Public inputs
    signal input nullifierHash;
    signal input commitmentHash;
    signal input recipient;
    signal input root; // The tree's root hash

    // private inputs
    signal input nullifier;
    signal input secret;
    signal input pathElements[levels]; // The merkle proof which is fixed size, pathElements contains the hashes
    signal input pathIndices[levels]; // Indices encode if we hash left or right

    // A hidden signal to validate the recipient cannot be tampered later
    signal recipientSquare;

    component commitmentHasher = CommitmentHasher();

    commitmentHasher.nullifier <== nullifier;
    commitmentHasher.secret <== secret;

    // Check if the nullifierHash and commitment are valid
    commitmentHasher.nullifierHash === nullifierHash;
    commitmentHasher.commitment === commitmentHash;

    // An extra signal to avoid tampering with the recipient

    recipientSquare <== recipient * recipient;
    
    // Check if the merkle root contains the commitmentHash!
    component tree = MerkleTreeChecker(levels);

    tree.leaf <== commitmentHasher.commitment;
    tree.root <== root;

    for (var i = 0; i < levels; i++) {
        tree.pathElements[i] <== pathElements[i];
        tree.pathIndices[i] <== pathIndices[i];
    }

}

component main {public [nullifierHash,commitmentHash,recipient,root]} = WithdrawBundledNote(20);