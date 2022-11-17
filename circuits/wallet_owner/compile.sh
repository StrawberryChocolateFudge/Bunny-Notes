
# Compile the r1cs, wasm and the debugging files
circom isOwner.circom --r1cs --wasm --sym

# get the .zkey
snarkjs groth16 setup isOwner.r1cs ../pot15_final.ptau isOwner_0000.zkey

# Contribute to the phase 2 ceremony, add your name if you are not me XD
snarkjs zkey contribute isOwner_0000.zkey isOwner_0001.zkey --name="StrawberryChocolateFudge" -verification

# export the verification key
snarkjs zkey export verificationkey isOwner_0001.zkey verification_key.json

# generate the verifier.sol file
snarkjs zkey export solidityverifier isOwner_0001.zkey IsOwnerVerifier.sol

# copy the IsOwnerVerifier.sol to the contracts directory
mv IsOwnerVerifier.sol ../../contracts/IsOwnerVerifier.sol

cp isOwner_0001.zkey ../../dist/isOwner_0001.zkey
cp isOwner_js/isOwner.wasm ../../dist/isOwner.wasm