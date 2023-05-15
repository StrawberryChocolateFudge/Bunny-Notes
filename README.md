# Bunny Notes

This is the full implementation of Bunny Notes, a zero-knowledge proof based crypto note protocol.

The repository contains the zero-knowledge circuits, the solidity smart contracts and a front-end created with parcel.

It uses the same repository for all for easy testing. 

Note: When using npm install , you might need to run it with --force due to different react dependency versions!

## Node Version:
Use 18.12.1 !!

## Tests

To run the tests run 

   `npx hardhat test`

## Circom

I used `compile.sh` from the /circuits directory to recompile the Verifier. DO NOT RUN THIS ANYMORE, IT WILL GENRATE A BRAND NEW VERIFIER!
## Powers of Tau

The ptau file was downloaded from  Hermez Protocol Ceremony from their dropbox [here](https://www.dropbox.com/sh/mn47gnepqu88mzl/AACaJkBU7mmCq8uU8ml0-0fma?dl=0)

These are all named powersOfTau28_hez_final_*.ptau where the * is some number. This number indicates the number of constraints (2^x) that can exist in your circuits.

I used powersOfTau28_hez_final_15.ptau

## Phase 2 ceremony was done using snarkyceremonies.com with anonymous contributors!

You can find the details in the circuits/withdraw_bunnyNote/log.csv file!
Thank you for all the contributors!

### Verify the latest zKey!

snarkjs zkey verify ./circuits/withdraw_bunnyNote/withdraw.r1cs ./circuits/powersOfTau28_hez_final_15.ptau ./circuits/withdraw_bunnyNote/withdraw_0017.zkey 

### Adding the random beacon!

The random beacon selected is the transaction ID of a BTT transaction that was sent during deployment. Nobody was able to predict before what this id will be. The transaction contains a message: `Bunny Notes Mainnet Beacon Transaction`

BEACON TX ID : 0x00be88dde5f0daae36044fb54da956026cf533d3e24f7d3b54710d22da8b39bd

` snarkjs zkey beacon withdraw_0017.zkey withdraw_final.zkey 00be88dde5f0daae36044fb54da956026cf533d3e24f7d3b54710d22da8b39bd 10 -n="Final Beacon Phase 2 Bunny Notes Mainnet is Ready :)" `

Verify the final zkey
` snarkjs zkey verify withdraw.r1cs ../powersOfTau28_hez_final_15.ptau withdraw_final.zkey`

Export the verification key: 

` snarkjs zkey export verificationkey withdraw_final.zkey verification_key.json `

Export the verifier smart contract

` snarkjs zkey export solidityverifier withdraw_final.zkey WithdrawVerifier.sol`

And finally the verifier was copied to the contracts library
