/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BytesLike,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { ZKNFT, ZKNFTInterface } from "../ZKNFT";

const _abi = [
  {
    inputs: [
      {
        internalType: "string[3]",
        name: "params",
        type: "string[3]",
      },
      {
        internalType: "contract IVerifier",
        name: "verifier_",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "root_",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "size_",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "Redeemed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bundleSize",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
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
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "notesLeft",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
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
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[8]",
        name: "_proof",
        type: "uint256[8]",
      },
      {
        internalType: "bytes32",
        name: "_nullifierHash",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_commitment",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_root",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
    ],
    name: "redeemToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "root",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
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
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "verifier",
    outputs: [
      {
        internalType: "contract IVerifier",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60e06040523480156200001157600080fd5b5060405162001f1438038062001f14833981016040819052620000349162000173565b8351602080860151825190916200005191600091850190620000b0565b50805162000067906001906020840190620000b0565b5050600160065550604084015180516200008a91600891602090910190620000b0565b5060609290921b6001600160601b03191660805260a05260c08190526007555062000360565b828054620000be906200030d565b90600052602060002090601f016020900481019282620000e257600085556200012d565b82601f10620000fd57805160ff19168380011785556200012d565b828001600101855582156200012d579182015b828111156200012d57825182559160200191906001019062000110565b506200013b9291506200013f565b5090565b5b808211156200013b576000815560010162000140565b80516001600160a01b03811681146200016e57600080fd5b919050565b6000806000806080858703121562000189578384fd5b84516001600160401b0380821115620001a0578586fd5b818701915087601f830112620001b4578586fd5b620001be620002af565b80838a606086011115620001d0578889fd5b885b60038110156200028257815185811115620001eb578a8bfd5b8601601f81018d13620001fc578a8bfd5b8051868111156200021157620002116200034a565b602062000227601f8301601f19168201620002da565b8281528f828486010111156200023b578d8efd5b8d5b838110156200025a5784810183015182820184015282016200023d565b838111156200026b578e8385840101525b5087529586019593909301925050600101620001d2565b505080975050505050620002996020860162000156565b6040860151606090960151949790965092505050565b604051606081016001600160401b0381118282101715620002d457620002d46200034a565b60405290565b604051601f8201601f191681016001600160401b03811182821017156200030557620003056200034a565b604052919050565b600181811c908216806200032257607f821691505b602082108114156200034457634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b60805160601c60a05160c051611b7a6200039a60003960006102d90152600061033c01526000818161020e015261093a0152611b7a6000f3fe608060405234801561001057600080fd5b50600436106101515760003560e01c806370a08231116100cd578063c87b56dd11610081578063d4e5c6b811610066578063d4e5c6b8146102d4578063e985e9c5146102fb578063ebf0c7171461033757600080fd5b8063c87b56dd146102ae578063ce0962b5146102c157600080fd5b806395d89b41116100b257806395d89b4114610280578063a22cb46514610288578063b88d4fde1461029b57600080fd5b806370a08231146102565780638a949df81461027757600080fd5b806317cc915c116101245780632b7ac3f3116101095780632b7ac3f31461020957806342842e0e146102305780636352211e1461024357600080fd5b806317cc915c146101d357806323b872dd146101f657600080fd5b806301ffc9a71461015657806306fdde031461017e578063081812fc14610193578063095ea7b3146101be575b600080fd5b6101696101643660046118d5565b61035e565b60405190151581526020015b60405180910390f35b6101866103fb565b6040516101759190611a4b565b6101a66101a13660046118bd565b61048d565b6040516001600160a01b039091168152602001610175565b6101d16101cc366004611820565b6104b4565b005b6101696101e13660046118bd565b60096020526000908152604090205460ff1681565b6101d16102043660046116da565b6105eb565b6101a67f000000000000000000000000000000000000000000000000000000000000000081565b6101d161023e3660046116da565b610662565b6101a66102513660046118bd565b61067d565b61026961026436600461168e565b6106e2565b604051908152602001610175565b61026960075481565b61018661077c565b6101d16102963660046117ea565b61078b565b6101d16102a9366004611715565b61079a565b6101866102bc3660046118bd565b610818565b6101d16102cf366004611849565b61087f565b6102697f000000000000000000000000000000000000000000000000000000000000000081565b6101696103093660046116a8565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b6102697f000000000000000000000000000000000000000000000000000000000000000081565b60006001600160e01b031982167f80ac58cd0000000000000000000000000000000000000000000000000000000014806103c157506001600160e01b031982167f5b5e139f00000000000000000000000000000000000000000000000000000000145b806103f557507f01ffc9a7000000000000000000000000000000000000000000000000000000006001600160e01b03198316145b92915050565b60606000805461040a90611ab9565b80601f016020809104026020016040519081016040528092919081815260200182805461043690611ab9565b80156104835780601f1061045857610100808354040283529160200191610483565b820191906000526020600020905b81548152906001019060200180831161046657829003601f168201915b5050505050905090565b600061049882610c12565b506000908152600460205260409020546001600160a01b031690565b60006104bf8261067d565b9050806001600160a01b0316836001600160a01b0316141561054e5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560448201527f720000000000000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b336001600160a01b038216148061056a575061056a8133610309565b6105dc5760405162461bcd60e51b815260206004820152603d60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206f7220617070726f76656420666f7220616c6c0000006064820152608401610545565b6105e68383610c79565b505050565b6105f53382610cf4565b6106575760405162461bcd60e51b815260206004820152602d60248201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560448201526c1c881bdc88185c1c1c9bdd9959609a1b6064820152608401610545565b6105e6838383610d73565b6105e68383836040518060200160405280600081525061079a565b6000818152600260205260408120546001600160a01b0316806103f55760405162461bcd60e51b815260206004820152601860248201527f4552433732313a20696e76616c696420746f6b656e20494400000000000000006044820152606401610545565b60006001600160a01b0382166107605760405162461bcd60e51b815260206004820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f74206120766160448201527f6c6964206f776e657200000000000000000000000000000000000000000000006064820152608401610545565b506001600160a01b031660009081526003602052604090205490565b60606001805461040a90611ab9565b610796338383610f86565b5050565b6107a43383610cf4565b6108065760405162461bcd60e51b815260206004820152602d60248201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560448201526c1c881bdc88185c1c1c9bdd9959609a1b6064820152608401610545565b61081284848484611055565b50505050565b606061082382610c12565b600061082d6110de565b9050600081511161084d5760405180602001604052806000815250610878565b80610857846110ed565b60405160200161086892919061195c565b6040516020818303038152906040525b9392505050565b6108876111a5565b60008481526009602052604090205460ff16156108e65760405162461bcd60e51b815260206004820152601160248201527f416c72656164792072656465656d6564210000000000000000000000000000006044820152606401610545565b6000600754116109385760405162461bcd60e51b815260206004820152601160248201527f43616e27742072656465656d206d6f72650000000000000000000000000000006044820152606401610545565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316635fe8c13b60405180604001604052808860006008811061099357634e487b7160e01b600052603260045260246000fd5b60200201358152602001886001600881106109be57634e487b7160e01b600052603260045260246000fd5b602002013590526040805160808101825289820135918101918252908190606082018b60036020020135815250815260200160405180604001604052808b600460088110610a1c57634e487b7160e01b600052603260045260246000fd5b602002013581526020018b600560088110610a4757634e487b7160e01b600052603260045260246000fd5b60200201359052905260408051808201909152808a6006602002013581526020018a600760088110610a8957634e487b7160e01b600052603260045260246000fd5b602002013581525060405180608001604052808a60001c81526020018960001c8152602001876001600160a01b031681526020018860001c8152506040518563ffffffff1660e01b8152600401610ae394939291906119c7565b602060405180830381600087803b158015610afd57600080fd5b505af1158015610b11573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b3591906118a1565b610b815760405162461bcd60e51b815260206004820152600d60248201527f496e76616c69642070726f6f66000000000000000000000000000000000000006044820152606401610545565b6000848152600960205260408120805460ff191660019081179091556007805491929091610bb0908490611a76565b90915550610bc0905081846111ff565b604080518481526001600160a01b03831660208201527fc5fcfb68332ef11d542d4ab7e75045a5e4d66eb2d8f846f13a48356b32e534db910160405180910390a1610c0b6001600655565b5050505050565b6000818152600260205260409020546001600160a01b0316610c765760405162461bcd60e51b815260206004820152601860248201527f4552433732313a20696e76616c696420746f6b656e20494400000000000000006044820152606401610545565b50565b6000818152600460205260409020805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0384169081179091558190610cbb8261067d565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b600080610d008361067d565b9050806001600160a01b0316846001600160a01b03161480610d4757506001600160a01b0380821660009081526005602090815260408083209388168352929052205460ff165b80610d6b5750836001600160a01b0316610d608461048d565b6001600160a01b0316145b949350505050565b826001600160a01b0316610d868261067d565b6001600160a01b031614610dea5760405162461bcd60e51b815260206004820152602560248201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060448201526437bbb732b960d91b6064820152608401610545565b6001600160a01b038216610e655760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f2061646460448201527f72657373000000000000000000000000000000000000000000000000000000006064820152608401610545565b610e7283838360016113a5565b826001600160a01b0316610e858261067d565b6001600160a01b031614610ee95760405162461bcd60e51b815260206004820152602560248201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060448201526437bbb732b960d91b6064820152608401610545565b6000818152600460209081526040808320805473ffffffffffffffffffffffffffffffffffffffff199081169091556001600160a01b0387811680865260038552838620805460001901905590871680865283862080546001019055868652600290945282852080549092168417909155905184937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b816001600160a01b0316836001600160a01b03161415610fe85760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610545565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b611060848484610d73565b61106c8484848461142d565b6108125760405162461bcd60e51b815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527f63656976657220696d706c656d656e74657200000000000000000000000000006064820152608401610545565b60606008805461040a90611ab9565b606060006110fa83611590565b600101905060008167ffffffffffffffff81111561112857634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015611152576020820181803683370190505b5090508181016020015b600019017f3031323334353637383961626364656600000000000000000000000000000000600a86061a8153600a85049450846111985761119d565b61115c565b509392505050565b600260065414156111f85760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606401610545565b6002600655565b6001600160a01b0382166112555760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610545565b6000818152600260205260409020546001600160a01b0316156112ba5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610545565b6112c86000838360016113a5565b6000818152600260205260409020546001600160a01b03161561132d5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610545565b6001600160a01b0382166000818152600360209081526040808320805460010190558483526002909152808220805473ffffffffffffffffffffffffffffffffffffffff19168417905551839291907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b6001811115610812576001600160a01b038416156113eb576001600160a01b038416600090815260036020526040812080548392906113e5908490611a76565b90915550505b6001600160a01b03831615610812576001600160a01b03831660009081526003602052604081208054839290611422908490611a5e565b909155505050505050565b60006001600160a01b0384163b1561158557604051630a85bd0160e11b81526001600160a01b0385169063150b7a029061147190339089908890889060040161198b565b602060405180830381600087803b15801561148b57600080fd5b505af19250505080156114bb575060408051601f3d908101601f191682019092526114b8918101906118f1565b60015b61156b573d8080156114e9576040519150601f19603f3d011682016040523d82523d6000602084013e6114ee565b606091505b5080516115635760405162461bcd60e51b815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527f63656976657220696d706c656d656e74657200000000000000000000000000006064820152608401610545565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610d6b565b506001949350505050565b6000807a184f03e93ff9f4daa797ed6e38ed64bf6a1f01000000000000000083106115d9577a184f03e93ff9f4daa797ed6e38ed64bf6a1f010000000000000000830492506040015b6d04ee2d6d415b85acef81000000008310611605576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc10000831061162357662386f26fc10000830492506010015b6305f5e100831061163b576305f5e100830492506008015b612710831061164f57612710830492506004015b60648310611661576064830492506002015b600a83106103f55760010192915050565b80356001600160a01b038116811461168957600080fd5b919050565b60006020828403121561169f578081fd5b61087882611672565b600080604083850312156116ba578081fd5b6116c383611672565b91506116d160208401611672565b90509250929050565b6000806000606084860312156116ee578081fd5b6116f784611672565b925061170560208501611672565b9150604084013590509250925092565b6000806000806080858703121561172a578081fd5b61173385611672565b935061174160208601611672565b925060408501359150606085013567ffffffffffffffff80821115611764578283fd5b818701915087601f830112611777578283fd5b81358181111561178957611789611b0a565b604051601f8201601f19908116603f011681019083821181831017156117b1576117b1611b0a565b816040528281528a60208487010111156117c9578586fd5b82602086016020830137918201602001949094529598949750929550505050565b600080604083850312156117fc578182fd5b61180583611672565b9150602083013561181581611b20565b809150509250929050565b60008060408385031215611832578182fd5b61183b83611672565b946020939093013593505050565b60008060008060006101808688031215611861578081fd5b610100860187811115611872578182fd5b869550359350610120850135925061014085013591506118956101608601611672565b90509295509295909350565b6000602082840312156118b2578081fd5b815161087881611b20565b6000602082840312156118ce578081fd5b5035919050565b6000602082840312156118e6578081fd5b813561087881611b2e565b600060208284031215611902578081fd5b815161087881611b2e565b8060005b6002811015610812578151845260209384019390910190600101611911565b60008151808452611948816020860160208601611a8d565b601f01601f19169290920160200192915050565b6000835161196e818460208801611a8d565b835190830190611982818360208801611a8d565b01949350505050565b60006001600160a01b038087168352808616602084015250836040830152608060608301526119bd6080830184611930565b9695505050505050565b61018081016119d6828761190d565b60408083018660005b6002811015611a06576119f383835161190d565b91830191602091909101906001016119df565b50505050611a1760c083018561190d565b61010082018360005b6004811015611a3f578151835260209283019290910190600101611a20565b50505095945050505050565b6020815260006108786020830184611930565b60008219821115611a7157611a71611af4565b500190565b600082821015611a8857611a88611af4565b500390565b60005b83811015611aa8578181015183820152602001611a90565b838111156108125750506000910152565b600181811c90821680611acd57607f821691505b60208210811415611aee57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b8015158114610c7657600080fd5b6001600160e01b031981168114610c7657600080fdfea2646970667358221220a7dc1a35f513743e38010e5bf576ef326e18179ef791e71f9ef2a268fac0a71364736f6c63430008040033";

export class ZKNFT__factory extends ContractFactory {
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
    params: [string, string, string],
    verifier_: string,
    root_: BytesLike,
    size_: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ZKNFT> {
    return super.deploy(
      params,
      verifier_,
      root_,
      size_,
      overrides || {}
    ) as Promise<ZKNFT>;
  }
  getDeployTransaction(
    params: [string, string, string],
    verifier_: string,
    root_: BytesLike,
    size_: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      params,
      verifier_,
      root_,
      size_,
      overrides || {}
    );
  }
  attach(address: string): ZKNFT {
    return super.attach(address) as ZKNFT;
  }
  connect(signer: Signer): ZKNFT__factory {
    return super.connect(signer) as ZKNFT__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ZKNFTInterface {
    return new utils.Interface(_abi) as ZKNFTInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): ZKNFT {
    return new Contract(address, _abi, signerOrProvider) as ZKNFT;
  }
}
