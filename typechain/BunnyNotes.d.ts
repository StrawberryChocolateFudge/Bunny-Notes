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

interface BunnyNotesInterface extends ethers.utils.Interface {
  functions: {
    "_owner()": FunctionFragment;
    "commitments(bytes32)": FunctionFragment;
    "denomination()": FunctionFragment;
    "deposit(bytes32,bool,address)": FunctionFragment;
    "fee()": FunctionFragment;
    "isSpent(bytes32)": FunctionFragment;
    "isSpentArray(bytes32[])": FunctionFragment;
    "nullifierHashes(bytes32)": FunctionFragment;
    "relayer()": FunctionFragment;
    "verifier()": FunctionFragment;
    "withdrawCashNote(uint256[8],bytes32,bytes32,address,uint256)": FunctionFragment;
    "withdrawGiftCard(uint256[8],bytes32,bytes32,address,uint256)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "_owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "commitments",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "denomination",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [BytesLike, boolean, string]
  ): string;
  encodeFunctionData(functionFragment: "fee", values?: undefined): string;
  encodeFunctionData(functionFragment: "isSpent", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "isSpentArray",
    values: [BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "nullifierHashes",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "relayer", values?: undefined): string;
  encodeFunctionData(functionFragment: "verifier", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "withdrawCashNote",
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
      string,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawGiftCard",
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
      string,
      BigNumberish
    ]
  ): string;

  decodeFunctionResult(functionFragment: "_owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "commitments",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "denomination",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "fee", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isSpent", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isSpentArray",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "nullifierHashes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "relayer", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "verifier", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawCashNote",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawGiftCard",
    data: BytesLike
  ): Result;

  events: {
    "Deposit(bytes32,address,uint256)": EventFragment;
    "WithdrawCashNote(address,address,bytes32,uint256,uint256)": EventFragment;
    "WithdrawGiftCard(address,address,bytes32,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Deposit"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "WithdrawCashNote"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "WithdrawGiftCard"): EventFragment;
}

export type DepositEvent = TypedEvent<
  [string, string, BigNumber] & {
    commitment: string;
    depositedBy: string;
    timestamp: BigNumber;
  }
>;

export type WithdrawCashNoteEvent = TypedEvent<
  [string, string, string, BigNumber, BigNumber] & {
    from: string;
    to: string;
    nullifierHashes: string;
    price: BigNumber;
    change: BigNumber;
  }
>;

export type WithdrawGiftCardEvent = TypedEvent<
  [string, string, string, BigNumber] & {
    from: string;
    to: string;
    nullifierHash: string;
    fee: BigNumber;
  }
>;

export class BunnyNotes extends BaseContract {
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

  interface: BunnyNotesInterface;

  functions: {
    _owner(overrides?: CallOverrides): Promise<[string]>;

    commitments(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [boolean, string, string, boolean, BigNumber, BigNumber] & {
        used: boolean;
        creator: string;
        recipient: string;
        cashNote: boolean;
        createdDate: BigNumber;
        spentDate: BigNumber;
      }
    >;

    denomination(overrides?: CallOverrides): Promise<[BigNumber]>;

    deposit(
      _commitment: BytesLike,
      cashNote: boolean,
      depositFor: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    fee(overrides?: CallOverrides): Promise<[BigNumber]>;

    isSpent(
      _nullifierHash: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isSpentArray(
      _nullifierHashes: BytesLike[],
      overrides?: CallOverrides
    ): Promise<[boolean[]] & { spent: boolean[] }>;

    nullifierHashes(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    relayer(overrides?: CallOverrides): Promise<[string]>;

    verifier(overrides?: CallOverrides): Promise<[string]>;

    withdrawCashNote(
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
      _recipient: string,
      _change: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawGiftCard(
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
      _recipient: string,
      _change: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  _owner(overrides?: CallOverrides): Promise<string>;

  commitments(
    arg0: BytesLike,
    overrides?: CallOverrides
  ): Promise<
    [boolean, string, string, boolean, BigNumber, BigNumber] & {
      used: boolean;
      creator: string;
      recipient: string;
      cashNote: boolean;
      createdDate: BigNumber;
      spentDate: BigNumber;
    }
  >;

  denomination(overrides?: CallOverrides): Promise<BigNumber>;

  deposit(
    _commitment: BytesLike,
    cashNote: boolean,
    depositFor: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  fee(overrides?: CallOverrides): Promise<BigNumber>;

  isSpent(
    _nullifierHash: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isSpentArray(
    _nullifierHashes: BytesLike[],
    overrides?: CallOverrides
  ): Promise<boolean[]>;

  nullifierHashes(arg0: BytesLike, overrides?: CallOverrides): Promise<boolean>;

  relayer(overrides?: CallOverrides): Promise<string>;

  verifier(overrides?: CallOverrides): Promise<string>;

  withdrawCashNote(
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
    _recipient: string,
    _change: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawGiftCard(
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
    _recipient: string,
    _change: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    _owner(overrides?: CallOverrides): Promise<string>;

    commitments(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [boolean, string, string, boolean, BigNumber, BigNumber] & {
        used: boolean;
        creator: string;
        recipient: string;
        cashNote: boolean;
        createdDate: BigNumber;
        spentDate: BigNumber;
      }
    >;

    denomination(overrides?: CallOverrides): Promise<BigNumber>;

    deposit(
      _commitment: BytesLike,
      cashNote: boolean,
      depositFor: string,
      overrides?: CallOverrides
    ): Promise<void>;

    fee(overrides?: CallOverrides): Promise<BigNumber>;

    isSpent(
      _nullifierHash: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isSpentArray(
      _nullifierHashes: BytesLike[],
      overrides?: CallOverrides
    ): Promise<boolean[]>;

    nullifierHashes(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    relayer(overrides?: CallOverrides): Promise<string>;

    verifier(overrides?: CallOverrides): Promise<string>;

    withdrawCashNote(
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
      _recipient: string,
      _change: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawGiftCard(
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
      _recipient: string,
      _change: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "Deposit(bytes32,address,uint256)"(
      commitment?: BytesLike | null,
      depositedBy?: null,
      timestamp?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { commitment: string; depositedBy: string; timestamp: BigNumber }
    >;

    Deposit(
      commitment?: BytesLike | null,
      depositedBy?: null,
      timestamp?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { commitment: string; depositedBy: string; timestamp: BigNumber }
    >;

    "WithdrawCashNote(address,address,bytes32,uint256,uint256)"(
      from?: null,
      to?: null,
      nullifierHashes?: null,
      price?: null,
      change?: null
    ): TypedEventFilter<
      [string, string, string, BigNumber, BigNumber],
      {
        from: string;
        to: string;
        nullifierHashes: string;
        price: BigNumber;
        change: BigNumber;
      }
    >;

    WithdrawCashNote(
      from?: null,
      to?: null,
      nullifierHashes?: null,
      price?: null,
      change?: null
    ): TypedEventFilter<
      [string, string, string, BigNumber, BigNumber],
      {
        from: string;
        to: string;
        nullifierHashes: string;
        price: BigNumber;
        change: BigNumber;
      }
    >;

    "WithdrawGiftCard(address,address,bytes32,uint256)"(
      from?: null,
      to?: null,
      nullifierHash?: null,
      fee?: null
    ): TypedEventFilter<
      [string, string, string, BigNumber],
      { from: string; to: string; nullifierHash: string; fee: BigNumber }
    >;

    WithdrawGiftCard(
      from?: null,
      to?: null,
      nullifierHash?: null,
      fee?: null
    ): TypedEventFilter<
      [string, string, string, BigNumber],
      { from: string; to: string; nullifierHash: string; fee: BigNumber }
    >;
  };

  estimateGas: {
    _owner(overrides?: CallOverrides): Promise<BigNumber>;

    commitments(arg0: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    denomination(overrides?: CallOverrides): Promise<BigNumber>;

    deposit(
      _commitment: BytesLike,
      cashNote: boolean,
      depositFor: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    fee(overrides?: CallOverrides): Promise<BigNumber>;

    isSpent(
      _nullifierHash: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isSpentArray(
      _nullifierHashes: BytesLike[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    nullifierHashes(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    relayer(overrides?: CallOverrides): Promise<BigNumber>;

    verifier(overrides?: CallOverrides): Promise<BigNumber>;

    withdrawCashNote(
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
      _recipient: string,
      _change: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawGiftCard(
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
      _recipient: string,
      _change: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    _owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    commitments(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    denomination(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    deposit(
      _commitment: BytesLike,
      cashNote: boolean,
      depositFor: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    fee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    isSpent(
      _nullifierHash: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isSpentArray(
      _nullifierHashes: BytesLike[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    nullifierHashes(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    relayer(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    verifier(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdrawCashNote(
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
      _recipient: string,
      _change: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawGiftCard(
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
      _recipient: string,
      _change: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
