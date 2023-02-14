 # Compiling the circuits
 # First we remove the extra files from the directory

 rm -rf withdraw_js
 rm -f verification_key.json
 rm -f withdraw_0000.zkey
 rm -f withdraw_0001.zkey
 rm -f withdraw.r1cs
 rm -f withdrawn.sym

# Compile the r1cs, wasm and the debugging files
 circom withdraw.circom --r1cs --wasm --sym

# get the .zkey
snarkjs groth16 setup withdraw.r1cs ../pot15_final.ptau withdraw_0000.zkey

# Contribute to the phase 2 ceremony, Add your name if you are not me XD
snarkjs zkey contribute withdraw_0000.zkey withdraw_0001.zkey --name="StrawberryChocolateFudge" -v

# export the verification key
snarkjs zkey export verificationkey withdraw_0001.zkey verification_key.json

# generate the verifier.sol file
snarkjs zkey export solidityverifier withdraw_0001.zkey WithdrawVerifier.sol

# copy the WithdrawVerifier.sol to the contracts directory
mv WithdrawVerifier.sol ../../contracts/WithdrawVerifier.sol

cp withdraw_0001.zkey ../../dist/withdraw_0001.zkey

cp withdraw_js/withdraw.wasm ../../dist/withdraw.wasm