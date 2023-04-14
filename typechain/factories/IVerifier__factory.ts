/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IVerifier, IVerifierInterface } from "../IVerifier";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256[2]",
        name: "a",
        type: "uint256[2]",
      },
      {
        internalType: "uint256[2][2]",
        name: "b",
        type: "uint256[2][2]",
      },
      {
        internalType: "uint256[2]",
        name: "c",
        type: "uint256[2]",
      },
      {
        internalType: "uint256[3]",
        name: "_input",
        type: "uint256[3]",
      },
    ],
    name: "verifyProof",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IVerifier__factory {
  static readonly abi = _abi;
  static createInterface(): IVerifierInterface {
    return new utils.Interface(_abi) as IVerifierInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IVerifier {
    return new Contract(address, _abi, signerOrProvider) as IVerifier;
  }
}
