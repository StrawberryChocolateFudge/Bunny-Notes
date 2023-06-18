/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface BunnyBundlesInterface extends ethers.utils.Interface {
  functions: {
    "FEE_DIVIDER()": FunctionFragment;
    "_owner()": FunctionFragment;
    "bundles(bytes32)": FunctionFragment;
    "calculateFee(uint256)": FunctionFragment;
    "depositEth(bytes32,uint256,uint256)": FunctionFragment;
    "depositToken(bytes32,uint256,uint256,address)": FunctionFragment;
    "feelessToken()": FunctionFragment;
    "getNoteValue(uint256,uint256)": FunctionFragment;
    "isSpent(bytes32,bytes32)": FunctionFragment;
    "nullifierHashes(bytes32,bytes32)": FunctionFragment;
    "setFeelessToken(address)": FunctionFragment;
    "verifier()": FunctionFragment;
    "withdraw(uint256[8],bytes32,bytes32,bytes32,address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "FEE_DIVIDER",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "_owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "bundles", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "calculateFee",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "depositEth",
    values: [BytesLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "depositToken",
    values: [BytesLike, BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "feelessToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getNoteValue",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isSpent",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "nullifierHashes",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setFeelessToken",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "verifier", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [
      [
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish
      ],
      BytesLike,
      BytesLike,
      BytesLike,
      string
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "FEE_DIVIDER",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "_owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "bundles", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "calculateFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "depositEth", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "depositToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "feelessToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getNoteValue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isSpent", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "nullifierHashes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setFeelessToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "verifier", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {
    "DepositETH(bytes32,address,uint256,uint256,uint256,uint256)": EventFragment;
    "DepositToken(bytes32,address,uint256,uint256,uint256,uint256,address)": EventFragment;
    "WithdrawFromBundle(address,address,bytes32,bytes32)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "DepositETH"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DepositToken"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "WithdrawFromBundle"): EventFragment;
}

export type DepositETHEvent = TypedEvent<
  [string, string, BigNumber, BigNumber, BigNumber, BigNumber] & {
    root: string;
    depositFor: string;
    timestamp: BigNumber;
    totalValue: BigNumber;
    size: BigNumber;
    fee: BigNumber;
  }
>;

export type DepositTokenEvent = TypedEvent<
  [string, string, BigNumber, BigNumber, BigNumber, BigNumber, string] & {
    root: string;
    depositFor: string;
    timestamp: BigNumber;
    totalValue: BigNumber;
    size: BigNumber;
    fee: BigNumber;
    token: string;
  }
>;

export type WithdrawFromBundleEvent = TypedEvent<
  [string, string, string, string] & {
    from: string;
    to: string;
    root: string;
    commitment: string;
  }
>;

export class BunnyBundles extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: BunnyBundlesInterface;

  functions: {
    FEE_DIVIDER(overrides?: CallOverrides): Promise<[BigNumber]>;

    _owner(overrides?: CallOverrides): Promise<[string]>;

    bundles(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        boolean,
        string
      ] & {
        creator: string;
        createdDate: BigNumber;
        size: BigNumber;
        totalValue: BigNumber;
        valueLeft: BigNumber;
        bunnyNotesLeft: BigNumber;
        usesToken: boolean;
        token: string;
      }
    >;

    calculateFee(
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { fee: BigNumber }>;

    depositEth(
      root: BytesLike,
      totalValue: BigNumberish,
      size: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    depositToken(
      root: BytesLike,
      totalValue: BigNumberish,
      size: BigNumberish,
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    feelessToken(overrides?: CallOverrides): Promise<[string]>;

    getNoteValue(
      totalValue: BigNumberish,
      size: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { value: BigNumber }>;

    isSpent(
      _nullifierHash: BytesLike,
      _root: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    nullifierHashes(
      arg0: BytesLike,
      arg1: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    setFeelessToken(
      newFeelesstoken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    verifier(overrides?: CallOverrides): Promise<[string]>;

    withdraw(
      _proof: [
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish
      ],
      _nullifierHash: BytesLike,
      _commitment: BytesLike,
      _root: BytesLike,
      _recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  FEE_DIVIDER(overrides?: CallOverrides): Promise<BigNumber>;

  _owner(overrides?: CallOverrides): Promise<string>;

  bundles(
    arg0: BytesLike,
    overrides?: CallOverrides
  ): Promise<
    [
      string,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      boolean,
      string
    ] & {
      creator: string;
      createdDate: BigNumber;
      size: BigNumber;
      totalValue: BigNumber;
      valueLeft: BigNumber;
      bunnyNotesLeft: BigNumber;
      usesToken: boolean;
      token: string;
    }
  >;

  calculateFee(
    amount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  depositEth(
    root: BytesLike,
    totalValue: BigNumberish,
    size: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  depositToken(
    root: BytesLike,
    totalValue: BigNumberish,
    size: BigNumberish,
    token: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  feelessToken(overrides?: CallOverrides): Promise<string>;

  getNoteValue(
    totalValue: BigNumberish,
    size: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  isSpent(
    _nullifierHash: BytesLike,
    _root: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  nullifierHashes(
    arg0: BytesLike,
    arg1: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  setFeelessToken(
    newFeelesstoken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  verifier(overrides?: CallOverrides): Promise<string>;

  withdraw(
    _proof: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ],
    _nullifierHash: BytesLike,
    _commitment: BytesLike,
    _root: BytesLike,
    _recipient: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    FEE_DIVIDER(overrides?: CallOverrides): Promise<BigNumber>;

    _owner(overrides?: CallOverrides): Promise<string>;

    bundles(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        boolean,
        string
      ] & {
        creator: string;
        createdDate: BigNumber;
        size: BigNumber;
        totalValue: BigNumber;
        valueLeft: BigNumber;
        bunnyNotesLeft: BigNumber;
        usesToken: boolean;
        token: string;
      }
    >;

    calculateFee(
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    depositEth(
      root: BytesLike,
      totalValue: BigNumberish,
      size: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    depositToken(
      root: BytesLike,
      totalValue: BigNumberish,
      size: BigNumberish,
      token: string,
      overrides?: CallOverrides
    ): Promise<void>;

    feelessToken(overrides?: CallOverrides): Promise<string>;

    getNoteValue(
      totalValue: BigNumberish,
      size: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isSpent(
      _nullifierHash: BytesLike,
      _root: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    nullifierHashes(
      arg0: BytesLike,
      arg1: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    setFeelessToken(
      newFeelesstoken: string,
      overrides?: CallOverrides
    ): Promise<void>;

    verifier(overrides?: CallOverrides): Promise<string>;

    withdraw(
      _proof: [
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish
      ],
      _nullifierHash: BytesLike,
      _commitment: BytesLike,
      _root: BytesLike,
      _recipient: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "DepositETH(bytes32,address,uint256,uint256,uint256,uint256)"(
      root?: BytesLike | null,
      depositFor?: null,
      timestamp?: null,
      totalValue?: null,
      size?: null,
      fee?: null
    ): TypedEventFilter<
      [string, string, BigNumber, BigNumber, BigNumber, BigNumber],
      {
        root: string;
        depositFor: string;
        timestamp: BigNumber;
        totalValue: BigNumber;
        size: BigNumber;
        fee: BigNumber;
      }
    >;

    DepositETH(
      root?: BytesLike | null,
      depositFor?: null,
      timestamp?: null,
      totalValue?: null,
      size?: null,
      fee?: null
    ): TypedEventFilter<
      [string, string, BigNumber, BigNumber, BigNumber, BigNumber],
      {
        root: string;
        depositFor: string;
        timestamp: BigNumber;
        totalValue: BigNumber;
        size: BigNumber;
        fee: BigNumber;
      }
    >;

    "DepositToken(bytes32,address,uint256,uint256,uint256,uint256,address)"(
      root?: BytesLike | null,
      depositFor?: null,
      timestamp?: null,
      totalValue?: null,
      size?: null,
      fee?: null,
      token?: null
    ): TypedEventFilter<
      [string, string, BigNumber, BigNumber, BigNumber, BigNumber, string],
      {
        root: string;
        depositFor: string;
        timestamp: BigNumber;
        totalValue: BigNumber;
        size: BigNumber;
        fee: BigNumber;
        token: string;
      }
    >;

    DepositToken(
      root?: BytesLike | null,
      depositFor?: null,
      timestamp?: null,
      totalValue?: null,
      size?: null,
      fee?: null,
      token?: null
    ): TypedEventFilter<
      [string, string, BigNumber, BigNumber, BigNumber, BigNumber, string],
      {
        root: string;
        depositFor: string;
        timestamp: BigNumber;
        totalValue: BigNumber;
        size: BigNumber;
        fee: BigNumber;
        token: string;
      }
    >;

    "WithdrawFromBundle(address,address,bytes32,bytes32)"(
      from?: null,
      to?: null,
      root?: null,
      commitment?: null
    ): TypedEventFilter<
      [string, string, string, string],
      { from: string; to: string; root: string; commitment: string }
    >;

    WithdrawFromBundle(
      from?: null,
      to?: null,
      root?: null,
      commitment?: null
    ): TypedEventFilter<
      [string, string, string, string],
      { from: string; to: string; root: string; commitment: string }
    >;
  };

  estimateGas: {
    FEE_DIVIDER(overrides?: CallOverrides): Promise<BigNumber>;

    _owner(overrides?: CallOverrides): Promise<BigNumber>;

    bundles(arg0: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    calculateFee(
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    depositEth(
      root: BytesLike,
      totalValue: BigNumberish,
      size: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    depositToken(
      root: BytesLike,
      totalValue: BigNumberish,
      size: BigNumberish,
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    feelessToken(overrides?: CallOverrides): Promise<BigNumber>;

    getNoteValue(
      totalValue: BigNumberish,
      size: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isSpent(
      _nullifierHash: BytesLike,
      _root: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    nullifierHashes(
      arg0: BytesLike,
      arg1: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setFeelessToken(
      newFeelesstoken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    verifier(overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(
      _proof: [
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish
      ],
      _nullifierHash: BytesLike,
      _commitment: BytesLike,
      _root: BytesLike,
      _recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    FEE_DIVIDER(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    _owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    bundles(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    calculateFee(
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    depositEth(
      root: BytesLike,
      totalValue: BigNumberish,
      size: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    depositToken(
      root: BytesLike,
      totalValue: BigNumberish,
      size: BigNumberish,
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    feelessToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getNoteValue(
      totalValue: BigNumberish,
      size: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isSpent(
      _nullifierHash: BytesLike,
      _root: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    nullifierHashes(
      arg0: BytesLike,
      arg1: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setFeelessToken(
      newFeelesstoken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    verifier(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdraw(
      _proof: [
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish
      ],
      _nullifierHash: BytesLike,
      _commitment: BytesLike,
      _root: BytesLike,
      _recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
