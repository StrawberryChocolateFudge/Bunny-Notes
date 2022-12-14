/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { SwapTokens, SwapTokensInterface } from "../SwapTokens";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IOwnerVerifier",
        name: "_isOwnerVerifier",
        type: "address",
      },
      {
        internalType: "contract ISwapRouter",
        name: "_swapRouter",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "tokenIn",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenOut",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountOutMin",
        type: "uint256",
      },
    ],
    name: "SwapRelayed",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256[8]",
            name: "proof",
            type: "uint256[8]",
          },
          {
            internalType: "bytes32",
            name: "commitment",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "smartContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "relayer",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "paramsHash",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "nullifierHash",
            type: "bytes32",
          },
        ],
        internalType: "struct ZkOwner",
        name: "_zkOwner",
        type: "tuple",
      },
      {
        internalType: "address[4]",
        name: "_addressParams",
        type: "address[4]",
      },
      {
        internalType: "uint256[2]",
        name: "_amounts",
        type: "uint256[2]",
      },
      {
        internalType: "uint24",
        name: "_fee",
        type: "uint24",
      },
    ],
    name: "exactInputSingleSwapParamsHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "h",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256[8]",
            name: "proof",
            type: "uint256[8]",
          },
          {
            internalType: "bytes32",
            name: "commitment",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "smartContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "relayer",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "paramsHash",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "nullifierHash",
            type: "bytes32",
          },
        ],
        internalType: "struct ZkOwner",
        name: "_zkOwner",
        type: "tuple",
      },
      {
        internalType: "address[4]",
        name: "_addressParams",
        type: "address[4]",
      },
      {
        internalType: "uint256[2]",
        name: "_amounts",
        type: "uint256[2]",
      },
      {
        internalType: "uint24",
        name: "_fee",
        type: "uint24",
      },
    ],
    name: "exactInputSingleSwapRelayed",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "nullifierHashes",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ownerVerifier",
    outputs: [
      {
        internalType: "contract IOwnerVerifier",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "swapRouter",
    outputs: [
      {
        internalType: "contract ISwapRouter",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051610bca380380610bca83398101604081905261002f91610068565b6001600081905580546001600160a01b039283166001600160a01b031991821617909155600280549390921692169190911790556100b9565b6000806040838503121561007a578182fd5b8251610085816100a1565b6020840151909250610096816100a1565b809150509250929050565b6001600160a01b03811681146100b657600080fd5b50565b610b02806100c86000396000f3fe608060405234801561001057600080fd5b50600436106100675760003560e01c80635e45180d116100505780635e45180d146100c5578063bcab227e146100f0578063c31c9c071461010357600080fd5b806317cc915c1461006c5780633aa311e6146100a4575b600080fd5b61008f61007a36600461086c565b60036020526000908152604090205460ff1681565b60405190151581526020015b60405180910390f35b6100b76100b2366004610884565b610116565b60405190815260200161009b565b6002546100d8906001600160a01b031681565b6040516001600160a01b03909116815260200161009b565b6100b76100fe366004610884565b6101a0565b6001546100d8906001600160a01b031681565b6000610100850135610180860135610131602087018761082b565b610141604088016020890161082b565b6101516060890160408a0161082b565b61016160808a0160608b0161082b565b604051610180969594939291908a35906020808d0135918c910161090c565b604051602081830303815290604052805190602001209050949350505050565b6000600260005414156101fa5760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064015b60405180910390fd5b60026000556102116101408601610120870161082b565b6001600160a01b03166320ba338c866040518263ffffffff1660e01b815260040161023c9190610a64565b602060405180830381600087803b15801561025657600080fd5b505af115801561026a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061028e919061084c565b6102da5760405162461bcd60e51b815260206004820152600f60248201527f496e76616c6964207a6b4f776e6572000000000000000000000000000000000060448201526064016101f1565b336102ed6101608701610140880161082b565b6001600160a01b0316146103435760405162461bcd60e51b815260206004820152600f60248201527f496e76616c69642052656c61796572000000000000000000000000000000000060448201526064016101f1565b61034f85858585610116565b856101600135146103a25760405162461bcd60e51b815260206004820152600e60248201527f496e76616c696420506172616d7300000000000000000000000000000000000060448201526064016101f1565b6103df6103b2602086018661082b565b6103c2604087016020880161082b565b853560208701356103d960608a0160408b0161082b565b87610463565b90507f21048b6ab06e762c32e3cd4a9ffdb9dab444b73485b00286c40acc1b9fdbcefe61040f602086018661082b565b61041f604087016020880161082b565b604080516001600160a01b03938416815291909216602080830191909152863582840152860135606082015290519081900360800190a16001600055949350505050565b600061047187333088610574565b6001546104899088906001600160a01b0316876106c6565b60408051610100810182526001600160a01b03808a168252888116602083015262ffffff851682840152858116606083015242608083015260a0820188905260c08201879052600060e083015260015492517f414bf3890000000000000000000000000000000000000000000000000000000081529192169063414bf389906105169084906004016109e6565b602060405180830381600087803b15801561053057600080fd5b505af1158015610544573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061056891906108f4565b98975050505050505050565b604080516001600160a01b0385811660248301528481166044830152606480830185905283518084039091018152608490920183526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f23b872dd00000000000000000000000000000000000000000000000000000000179052915160009283929088169161060691906109ad565b6000604051808303816000865af19150503d8060008114610643576040519150601f19603f3d011682016040523d82523d6000602084013e610648565b606091505b5091509150818015610672575080511580610672575080806020019051810190610672919061084c565b6106be5760405162461bcd60e51b815260206004820152600360248201527f535446000000000000000000000000000000000000000000000000000000000060448201526064016101f1565b505050505050565b604080516001600160a01b038481166024830152604480830185905283518084039091018152606490920183526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f095ea7b300000000000000000000000000000000000000000000000000000000179052915160009283929087169161075091906109ad565b6000604051808303816000865af19150503d806000811461078d576040519150601f19603f3d011682016040523d82523d6000602084013e610792565b606091505b50915091508180156107bc5750805115806107bc5750808060200190518101906107bc919061084c565b6108085760405162461bcd60e51b815260206004820152600260248201527f534100000000000000000000000000000000000000000000000000000000000060448201526064016101f1565b5050505050565b80356001600160a01b038116811461082657600080fd5b919050565b60006020828403121561083c578081fd5b6108458261080f565b9392505050565b60006020828403121561085d578081fd5b81518015158114610845578182fd5b60006020828403121561087d578081fd5b5035919050565b60008060008084860361028081121561089b578384fd5b6101a0808212156108aa578485fd5b86955061022087019150878211156108c0578485fd5b860193506102608601878111156108d5578384fd5b9092503562ffffff811681146108e9578182fd5b939692955090935050565b600060208284031215610905578081fd5b5051919050565b89815288602082015260006bffffffffffffffffffffffff19808a60601b166040840152808960601b166054840152808860601b16606884015250610965607c83018760601b6bffffffffffffffffffffffff19169052565b50609081019390935260b083019190915260e81b7fffffff00000000000000000000000000000000000000000000000000000000001660d082015260d3019695505050505050565b60008251815b818110156109cd57602081860181015185830152016109b3565b818111156109db5782828501525b509190910192915050565b6000610100820190506001600160a01b0380845116835280602085015116602084015262ffffff6040850151166040840152806060850151166060840152506080830151608083015260a083015160a083015260c083015160c083015260e0830151610a5d60e08401826001600160a01b03169052565b5092915050565b6101a08101610100808484378381013590830152610120610a8681850161080f565b6001600160a01b0380821683860152610140925080610aa684880161080f565b16838601525050506101608084013581840152506101808084013581840152509291505056fea2646970667358221220d032112d6eec3bc3e72389c8ce296adb1a651839edc18b972047497a9c8fa60664736f6c63430008040033";

export class SwapTokens__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    _isOwnerVerifier: string,
    _swapRouter: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<SwapTokens> {
    return super.deploy(
      _isOwnerVerifier,
      _swapRouter,
      overrides || {}
    ) as Promise<SwapTokens>;
  }
  getDeployTransaction(
    _isOwnerVerifier: string,
    _swapRouter: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _isOwnerVerifier,
      _swapRouter,
      overrides || {}
    );
  }
  attach(address: string): SwapTokens {
    return super.attach(address) as SwapTokens;
  }
  connect(signer: Signer): SwapTokens__factory {
    return super.connect(signer) as SwapTokens__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SwapTokensInterface {
    return new utils.Interface(_abi) as SwapTokensInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SwapTokens {
    return new Contract(address, _abi, signerOrProvider) as SwapTokens;
  }
}
