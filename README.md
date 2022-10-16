# Bunny Notes

This is the full implementation of Bunny Notes, a zero-knowledge proof based Gift Card and Cash Note protocol.

The repository contains the zero-knowledge circuits, the solidity smart contracts and a front-end created with parcel.

It uses the same repository for all for easy testing. 
The project was built of a Hackathon and was scaffolded with hardhat

To Run the zero-knowledge proof generation test use

   `npx hardhat run scripts/main.ts`

To run the tests run 

   `npx hardhat test`




## Circom

The verifying contract was generated using 

https://docs.circom.io/getting-started/proving-circuits/#verifying-a-proof
## Powers of TAU

The ptau file was downloaded from  Hermez Protocol Ceremony from their dropbox [here](https://www.dropbox.com/sh/mn47gnepqu88mzl/AACaJkBU7mmCq8uU8ml0-0fma?dl=0)

These are all named powersOfTau28_hez_final_*.ptau where the * is some number. This number indicates the number of constraints (2^x) that can exist in your circuits.

I used powersOfTau28_hez_final_15.ptau