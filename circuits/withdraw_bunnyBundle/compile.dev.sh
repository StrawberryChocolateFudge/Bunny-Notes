# Compiling the ciruits for dev
# First we remove the files if they already exist

rm -rf withdraw_bunnyBundle_js
rm -f withdrawBundledNote_verificationKey.json
rm -f withdrawBundledNote_0000.zkey
rm -f withdrawBundledNote_0001.zkey
rm -f withdrawBunnyBundle.r1cs
rm -f withdrawBunnyBundle.sym



# Compile the r1cs, wasm and the debugging files
 circom withdrawBundledNote.circom --r1cs --wasm --sym

# get the .zkey

snarkjs groth16 setup withdrawBundledNote.r1cs ../powersOfTau28_hez_final_15.ptau withdrawBundledNote_0000.zkey

# contribute to the phase 2 ceremony, Add your name if you are not me
snarkjs zkey contribute withdrawBundledNote_0000.zkey withdrawBundledNote_0001.zkey --name="StrawberyyChocolateFudge" -v

# export the verification key
snarkjs zkey export verificationkey withdrawBundledNote_0001.zkey withdrawBundledNote_verificationKey.json

# generate the verifier.sol file
snarkjs zkey export solidityverifier withdrawBundledNote_0001.zkey WithdrawBundledNotes.sol

# Copy the verifier to the contracts directory

mv WithdrawBundledNotes.sol ../../contracts/WithdrawBundledNotes.sol
cp withdrawBundledNote_0001.zkey ../../dist/withdrawBundledNote_0001.zkey
cp withdrawBundledNote_js/withdrawBundledNote.wasm ../../dist/withdrawBundledNote.wasm
