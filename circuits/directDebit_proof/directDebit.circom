pragma circom 2.0.0;
include "../../node_modules/circomlib/circuits/poseidon.circom";

template CommitmentHasher(){
    signal input nullifier;
    signal input secret;
    signal input salt;
    signal output commitment;
    signal output nullifierHash;

    component commitmentHasher  = Poseidon(2);

    component nullifierHasher = Poseidon(2);

    commitmentHasher.inputs[0] <== nullifier;
    commitmentHasher.inputs[1] <== secret;

    commitment <==commitmentHasher.out;

    nullifierHasher.inputs[0] <== nullifier;
    nullifierHasher.inputs[1] <== salt;

    nullifierHash <== nullifilerHasher.out;
}

template DirectDebit(){
    signal input nullifierHash;
    signal input commitmentHash;

    signal input payee;

    // The amount that can be debited with the proof
    signal input debitAmount;
    // The amount of thimes this amount can be debited
    signal input debitTimes;

    // The amount of time that needs to pass before the amount can be debitted again!
    signal input debitInterval;

   // Private inputs!
    signal input secret;
    // A salt for the nullifier so the note is reusable!
    signal input salt;
    signal input nullifier;

    signal payeeSquare;
    signal debitAmountSquare;
    signal debitTimesSquare;
    signal debitIntervalSquare;

    // Hashing the commitment and the nullifier
    component commitmentHasher = CommitmentHasher();
    commitmentHasher.nullifier <== nullifier;
    commitmentHasher.secret <== secret;
    commitmentHasher.salt <== salt;

    commitmentHasher.nullifierHash === nullifierHash;
    commitmetnHasher.commitment === commitmentHash;

    payeeSquare <== payee * payee;
    debitAmountSquare <== debitAmount * debitAmount;
    debitTimesSquare <== debitTimes * debitTimes;
    debitIntervalSquare <==debitInterval * debitInterval;
}

component main {public [nullifierHash,commitmentHash, payee, debitAmount, debitTimes,debitInterval]} = DirectDebit();