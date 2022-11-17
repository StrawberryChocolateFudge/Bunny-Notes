
# Compile the r1cs, wasm and the debugging files
circom swapVerifier.circom --r1cs --wasm --sym

# get the .zkey
snarkjs groth16 setup swapVerifier.r1cs ../pot15_final.ptau swapVerifier_0000.zkey

# Contribute to the phase 2 ceremony, add your name if you are not me
snarkjs zkey contribute swapVerifier_0000.zkey swapVerifier_0001.zkey --name="StrawberryChocolateFudge" -verification

# export the verifiaction key
snarkjs zkey export verificationkey swapVerifier_0001.zkey verification_key.json

# generate the verifier.sol file
snarkjs zkey export solidityverifier swapVerifier_0001.zkey SwapVerifier.sol

# copy the SwapVerifier.sol to the contracts directory
mv SwapVerifier.sol ../../contracts/SwapVerifier.sol

cp swapVerifier_0001.zkey ../../dist/swapVerifier_0001.zkey
cp swapVerifier_js/swapVerifier.wasm ../../dist/swapVerifier.wasm
