/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { ETHNotes, ETHNotesInterface } from "../ETHNotes";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IVerifier",
        name: "_verifier",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_denomination",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "_feeDivider",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_relayer",
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
        indexed: true,
        internalType: "bytes32",
        name: "commitment",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "depositedBy",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "nullifierHashes",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "change",
        type: "uint256",
      },
    ],
    name: "WithdrawCashNote",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "nullifierHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
    ],
    name: "WithdrawGiftCard",
    type: "event",
  },
  {
    inputs: [],
    name: "NOTE_TYPE",
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
    name: "_owner",
    outputs: [
      {
        internalType: "address payable",
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
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "commitments",
    outputs: [
      {
        internalType: "bool",
        name: "used",
        type: "bool",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "bool",
        name: "cashNote",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "createdDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "spentDate",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "denomination",
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
        name: "_commitment",
        type: "bytes32",
      },
      {
        internalType: "bool",
        name: "cashNote",
        type: "bool",
      },
      {
        internalType: "address",
        name: "depositFor",
        type: "address",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "fee",
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
        name: "_nullifierHash",
        type: "bytes32",
      },
    ],
    name: "isSpent",
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
        internalType: "bytes32[]",
        name: "_nullifierHashes",
        type: "bytes32[]",
      },
    ],
    name: "isSpentArray",
    outputs: [
      {
        internalType: "bool[]",
        name: "spent",
        type: "bool[]",
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
    inputs: [],
    name: "relayer",
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
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_change",
        type: "uint256",
      },
    ],
    name: "withdrawCashNote",
    outputs: [],
    stateMutability: "payable",
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
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_change",
        type: "uint256",
      },
    ],
    name: "withdrawGiftCard",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60a06040523480156200001157600080fd5b506040516200173738038062001737833981016040819052620000349162000102565b600160005583838383826200009d5760405162461bcd60e51b815260206004820152602560248201527f44656e6f6d696e6174696f6e2073686f756c6420626520677265617465722074604482015264068616e20360dc1b606482015260840160405180910390fd5b6001600160601b0319606085901b166080526001839055620000c360ff83168462000161565b60045560028054336001600160a01b031991821617909155600380549091166001600160a01b0392909216919091179055506200019b95505050505050565b6000806000806080858703121562000118578384fd5b8451620001258162000182565b60208601516040870151919550935060ff8116811462000143578283fd5b6060860151909250620001568162000182565b939692955090935050565b6000826200017d57634e487b7160e01b81526012600452602481fd5b500490565b6001600160a01b03811681146200019857600080fd5b50565b60805160601c61156f620001c860003960008181610142015281816106a40152610c48015261156f6000f3fe6080604052600436106100d15760003560e01c80638bca6d161161007f578063af120ffa11610059578063af120ffa14610303578063b2bdfa7b14610316578063ddca3f4314610336578063e5285dcc1461034c57600080fd5b80638bca6d161461029257806393f40b6c146102b65780639fa12d0b146102d657600080fd5b806346b99ce6116100b057806346b99ce61461017c578063839df945146101d25780638406c0791461027257600080fd5b8062f5f984146100d657806317cc915c146100eb5780632b7ac3f314610130575b600080fd5b6100e96100e436600461134e565b61037c565b005b3480156100f757600080fd5b5061011b610106366004611336565b60056020526000908152604090205460ff1681565b60405190151581526020015b60405180910390f35b34801561013c57600080fd5b506101647f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b039091168152602001610127565b34801561018857600080fd5b506101c56040518060400160405280600381526020017f455448000000000000000000000000000000000000000000000000000000000081525081565b6040516101279190611478565b3480156101de57600080fd5b506102356101ed366004611336565b600660205260009081526040902080546001820154600283015460039093015460ff808416946001600160a01b03610100909504851694841693600160a01b90049091169186565b6040805196151587526001600160a01b039586166020880152939094169285019290925215156060840152608083015260a082015260c001610127565b34801561027e57600080fd5b50600354610164906001600160a01b031681565b34801561029e57600080fd5b506102a860015481565b604051908152602001610127565b3480156102c257600080fd5b506100e96102d13660046112c4565b610536565b3480156102e257600080fd5b506102f66102f1366004611254565b610958565b60405161012791906113ae565b6100e96103113660046112c4565b610a48565b34801561032257600080fd5b50600254610164906001600160a01b031681565b34801561034257600080fd5b506102a860045481565b34801561035857600080fd5b5061011b610367366004611336565b60009081526005602052604090205460ff1690565b600260005414156103d45760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064015b60405180910390fd5b600260009081558381526006602052604090205460ff161561045e5760405162461bcd60e51b815260206004820152602160248201527f54686520636f6d6d69746d656e7420686173206265656e207375626d6974746560448201527f640000000000000000000000000000000000000000000000000000000000000060648201526084016103cb565b6000838152600660205260409020805460017fffffffffffffffffffffff0000000000000000000000000000000000000000009091166101006001600160a01b038516021781178255810180547fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff16600160a01b85151502179055426002909101556104e981610f7f565b604080516001600160a01b038316815242602082015284917f182fa52899142d44ff5c45a6354d3b3e868d5b07db6a65580b39bd321bdaf8ac910160405180910390a25050600160005550565b600260005414156105895760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064016103cb565b600260009081558481526005602052604090205460ff16156106135760405162461bcd60e51b815260206004820152602360248201527f5468652067696674636172642068617320616c7265616479206265656e20737060448201527f656e74000000000000000000000000000000000000000000000000000000000060648201526084016103cb565b600083815260066020526040902060010154600160a01b900460ff16156106a25760405162461bcd60e51b815260206004820152602160248201527f596f752063616e206f6e6c79207769746864726177206769667420636172647360448201527f2e0000000000000000000000000000000000000000000000000000000000000060648201526084016103cb565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316635fe8c13b6040518060400160405280886000600881106106fd57634e487b7160e01b600052603260045260246000fd5b602002013581526020018860016008811061072857634e487b7160e01b600052603260045260246000fd5b602002013590526040805160808101825289820135918101918252908190606082018b60036020020135815250815260200160405180604001604052808b60046008811061078657634e487b7160e01b600052603260045260246000fd5b602002013581526020018b6005600881106107b157634e487b7160e01b600052603260045260246000fd5b60200201359052905260408051808201909152808a6006602002013581526020018a6007600881106107f357634e487b7160e01b600052603260045260246000fd5b602002013581525060405180608001604052808a60001c81526020018960001c8152602001886001600160a01b03168152602001878152506040518563ffffffff1660e01b815260040161084a94939291906113f4565b602060405180830381600087803b15801561086457600080fd5b505af1158015610878573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061089c919061131a565b6108e85760405162461bcd60e51b815260206004820152601660248201527f496e76616c69642057697468647261772070726f6f660000000000000000000060448201526064016103cb565b60008481526005602090815260408083208054600160ff1990911681179091558684526006909252909120908101805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0385161790554260039091015561094c826110db565b50506001600055505050565b60608167ffffffffffffffff81111561098157634e487b7160e01b600052604160045260246000fd5b6040519080825280602002602001820160405280156109aa578160200160208202803683370190505b50905060005b82811015610a41576109f78484838181106109db57634e487b7160e01b600052603260045260246000fd5b9050602002013560009081526005602052604090205460ff1690565b15610a2f576001828281518110610a1e57634e487b7160e01b600052603260045260246000fd5b911515602092830291909101909101525b80610a39816114fa565b9150506109b0565b5092915050565b60026000541415610a9b5760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064016103cb565b600260009081558481526005602052604090205460ff1615610aff5760405162461bcd60e51b815260206004820152601f60248201527f546865206e6f74652068617320616c7265616479206265656e207370656e740060448201526064016103cb565b6000838152600660205260409020600190810154600160a01b900460ff16151514610b6c5760405162461bcd60e51b815260206004820152601e60248201527f596f752063616e206f6e6c79207370656e642043617368206e6f7465732e000060448201526064016103cb565b600154811115610be45760405162461bcd60e51b815260206004820152602160248201527f54686520726571756573746564206368616e676520697320746f6f206869676860448201527f210000000000000000000000000000000000000000000000000000000000000060648201526084016103cb565b600154600090610bf490836110e7565b905060008111610c465760405162461bcd60e51b815260206004820152601f60248201527f30205072696365205061796d656e74206973206e6f7420616c6c6f776564210060448201526064016103cb565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316635fe8c13b604051806040016040528089600060088110610ca157634e487b7160e01b600052603260045260246000fd5b6020020135815260200189600160088110610ccc57634e487b7160e01b600052603260045260246000fd5b60200201359052604080516080810182528a820135918101918252908190606082018c60036020020135815250815260200160405180604001604052808c600460088110610d2a57634e487b7160e01b600052603260045260246000fd5b602002013581526020018c600560088110610d5557634e487b7160e01b600052603260045260246000fd5b60200201359052905260408051808201909152808b6006602002013581526020018b600760088110610d9757634e487b7160e01b600052603260045260246000fd5b602002013581525060405180608001604052808b60001c81526020018a60001c8152602001896001600160a01b03168152602001888152506040518563ffffffff1660e01b8152600401610dee94939291906113f4565b602060405180830381600087803b158015610e0857600080fd5b505af1158015610e1c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e40919061131a565b610e8c5760405162461bcd60e51b815260206004820152601660248201527f496e76616c69642057697468647261772070726f6f660000000000000000000060448201526064016103cb565b60008581526005602090815260408083208054600160ff1990911681179091558784526006909252909120908101805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b03868116919091179091554260038301559054610f0091859161010090041683856110fa565b6000848152600660209081526040918290205482516101009091046001600160a01b03908116825286169181019190915290810186905260608101829052608081018390527f253abeab19dd586b46f06c3da05002a8e2360aa8b1f9c44bfeaad3ed52e185099060a00160405180910390a15050600160005550505050565b6003546001600160a01b0316331415610fe6576001543414610fe35760405162461bcd60e51b815260206004820152601960248201527f506c656173652073656e6420636f72726563742076616c75650000000000000060448201526064016103cb565b50565b336001600160a01b0382161461103e5760405162461bcd60e51b815260206004820152601d60248201527f596f75206d757374206465706f73697420666f7220796f757273656c6600000060448201526064016103cb565b60045460015461104e91906114cb565b34146110c25760405162461bcd60e51b815260206004820152602260248201527f506c656173652073656e6420636f72726563742076616c75652077697468206660448201527f656500000000000000000000000000000000000000000000000000000000000060648201526084016103cb565b600254600454610fe3916001600160a01b03169061111a565b610fe38160015461111a565b60006110f382846114e3565b9392505050565b611104848361111a565b801561111457611114838261111a565b50505050565b8047101561116a5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a20696e73756666696369656e742062616c616e636500000060448201526064016103cb565b6000826001600160a01b03168260405160006040518083038185875af1925050503d80600081146111b7576040519150601f19603f3d011682016040523d82523d6000602084013e6111bc565b606091505b50509050806112335760405162461bcd60e51b815260206004820152603a60248201527f416464726573733a20756e61626c6520746f2073656e642076616c75652c207260448201527f6563697069656e74206d6179206861766520726576657274656400000000000060648201526084016103cb565b505050565b80356001600160a01b038116811461124f57600080fd5b919050565b60008060208385031215611266578182fd5b823567ffffffffffffffff8082111561127d578384fd5b818501915085601f830112611290578384fd5b81358181111561129e578485fd5b8660208260051b85010111156112b2578485fd5b60209290920196919550909350505050565b600080600080600061018086880312156112dc578081fd5b6101008601878111156112ed578182fd5b86955035935061012085013592506113086101408601611238565b94979396509194610160013592915050565b60006020828403121561132b578081fd5b81516110f38161152b565b600060208284031215611347578081fd5b5035919050565b600080600060608486031215611362578283fd5b8335925060208401356113748161152b565b915061138260408501611238565b90509250925092565b8060005b600281101561111457815184526020938401939091019060010161138f565b6020808252825182820181905260009190848201906040850190845b818110156113e85783511515835292840192918401916001016113ca565b50909695505050505050565b6101808101611403828761138b565b60408083018660005b60028110156114335761142083835161138b565b918301916020919091019060010161140c565b5050505061144460c083018561138b565b61010082018360005b600481101561146c57815183526020928301929091019060010161144d565b50505095945050505050565b6000602080835283518082850152825b818110156114a457858101830151858201604001528201611488565b818111156114b55783604083870101525b50601f01601f1916929092016040019392505050565b600082198211156114de576114de611515565b500190565b6000828210156114f5576114f5611515565b500390565b600060001982141561150e5761150e611515565b5060010190565b634e487b7160e01b600052601160045260246000fd5b8015158114610fe357600080fdfea26469706673582212201bdf382eeafe73f01ccf93fad44c80ef24ce2bb1f846c87a95b7faf753708fe264736f6c63430008040033";

export class ETHNotes__factory extends ContractFactory {
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
    _verifier: string,
    _denomination: BigNumberish,
    _feeDivider: BigNumberish,
    _relayer: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ETHNotes> {
    return super.deploy(
      _verifier,
      _denomination,
      _feeDivider,
      _relayer,
      overrides || {}
    ) as Promise<ETHNotes>;
  }
  getDeployTransaction(
    _verifier: string,
    _denomination: BigNumberish,
    _feeDivider: BigNumberish,
    _relayer: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _verifier,
      _denomination,
      _feeDivider,
      _relayer,
      overrides || {}
    );
  }
  attach(address: string): ETHNotes {
    return super.attach(address) as ETHNotes;
  }
  connect(signer: Signer): ETHNotes__factory {
    return super.connect(signer) as ETHNotes__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ETHNotesInterface {
    return new utils.Interface(_abi) as ETHNotesInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ETHNotes {
    return new Contract(address, _abi, signerOrProvider) as ETHNotes;
  }
}
