//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./ERC20Notes.sol";
import "./ETHNotes.sol";
import "./BunnyNotes.sol";

interface IOwnerVerifier {
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[4] memory _input
    ) external returns (bool);
}

struct ZkOwner {
    uint256[8] proof;
    bytes32 commitment;
    address smartContract;
    address relayer;
    bytes32 paramsHash;
    bytes32 nullifierHash;
}

// A Bunny wallet that needs to be deployed per user!
contract BunnyWallet is ReentrancyGuardUpgradeable, IERC721Receiver {
    using SafeMath for uint256;
    // Users can deposit into the bunny wallet tokens, eth or interact with bunny notes

    IOwnerVerifier public ownerVerifier;
    bytes32 public commitment;
    address public owner; // The Owner of this Wallet, he can add more tokens
    bool public paused; // The wallet contract can be paused by the owner

    uint256 public totalWeiReceived;

    string public constant walletPausedError = "Wallet Paused";

    mapping(bytes32 => bool) public nullifierHashes;
    event InitializedContract(
        address _ownerVerifier,
        bytes32 _commitment,
        address _owner
    );
    event Received(address from, uint256 amount);
    event CommitmentReset(bytes32 oldCommitment, bytes32 newCommitment);
    event TransferEthByOwner(address to, uint256 amount);
    event TransferEthRelayed(address to, uint256 amount);
    event TransferTokenByOwner(address token, address to, uint256 amount);
    event TransferTokenByRelayer(address token, address to, uint256 amount);
    event ApproveSpendByOwner(address token, address spender, uint256 amount);
    event ApproveSpendRelayed(address token, address spender, uint256 amount);
    event TransferERC721ByOwner(
        address token,
        address from,
        address to,
        uint256 tokenId
    );
    event TransferERC721Relayed(
        address token,
        address from,
        address to,
        uint256 tokenId
    );
    event ApproveERC721ByOwner(
        address token,
        address to,
        uint256 tokenId,
        bool forAll,
        bool approved
    );

    event ApproveERC721Relayed(
        address token,
        address to,
        uint256 tokenId,
        bool forAll,
        bool approved
    );

    event ERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes data
    );

    event DepositBunnyNoteByOwner(
        address _notesContract,
        address token,
        bytes32 commitment,
        bool cashNote,
        bool isERC20
    );
    event DepositBunnyNoteRelayed(
        address _notesContract,
        address token,
        bytes32 commitment,
        bool cashNote,
        bool isERC20
    );

    modifier ZkOwnerCheck(ZkOwner calldata _zkOwner, bool checkRelayer) {
        require(!nullifierHashes[_zkOwner.nullifierHash], "Proof used!");
        require(_zkOwner.smartContract == address(this), "Invalid contract");
        require(_zkOwner.commitment == commitment, "Invalid commitment");
        if (checkRelayer) {
            require(msg.sender == _zkOwner.relayer, "Invalid Relayer");
        }
        require(
            ownerVerifier.verifyProof(
                [_zkOwner.proof[0], _zkOwner.proof[1]],
                [
                    [_zkOwner.proof[2], _zkOwner.proof[3]],
                    [_zkOwner.proof[4], _zkOwner.proof[5]]
                ],
                [_zkOwner.proof[6], _zkOwner.proof[7]],
                [
                    uint256(_zkOwner.commitment),
                    uint256(uint160(_zkOwner.smartContract)),
                    uint256(uint160(_zkOwner.relayer)),
                    uint256(_zkOwner.nullifierHash)
                ]
            ),
            "Invalid proof"
        );
        nullifierHashes[_zkOwner.nullifierHash] = true;
        _;
    }

    function initialize(
        IOwnerVerifier _ownerVerifier,
        bytes32 _commitment,
        address _owner
    ) public initializer {
        ownerVerifier = _ownerVerifier;
        commitment = _commitment;
        owner = _owner;
        paused = false;
        emit InitializedContract(address(_ownerVerifier), _commitment, _owner);
    }

    // The owner can reset the commitment to create a new note!

    function resetCommitment(bytes32 newCommitment) external {
        require(msg.sender == owner, "Only owner");
        emit CommitmentReset(commitment, newCommitment);
        commitment = newCommitment;
    }

    receive() external payable {
        totalWeiReceived += msg.value;
        emit Received(msg.sender, msg.value);
    }

    function transferParamsHash(
        ZkOwner calldata _zkOwner,
        address _token,
        address _transferTo,
        uint256 _transferAmount
    ) public pure returns (bytes32 h) {
        h = keccak256(
            abi.encodePacked(
                _zkOwner.commitment,
                _zkOwner.nullifierHash,
                _token,
                _transferTo,
                _transferAmount
            )
        );
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        emit ERC721Received(operator, from, tokenId, data);
        return
            bytes4(
                keccak256("onERC721Received(address,address,uint256,bytes)")
            );
    }

    // The tokens are passed in per function, so I don't store all the available tokens
    function getTokenBalance(IERC20 token)
        public
        view
        returns (uint256 balance)
    {
        return token.balanceOf(address(this));
    }

    function transferETHByOwner(address _to, uint256 _amount)
        external
        nonReentrant
    {
        require(msg.sender == owner, "Only owner");
        require(!paused, walletPausedError);

        AddressUpgradeable.sendValue(payable(_to), _amount);
        emit TransferEthByOwner(_to, _amount);
    }

    function transferETHRelayed(
        ZkOwner calldata _zkOwner,
        address _token, // must be zero address for eth transfer
        address _transferTo, // the address to transfer to
        uint256 _transferAmount // the amount of eth transferred,
    ) external nonReentrant ZkOwnerCheck(_zkOwner, true) {
        require(!paused, "Wallet paused");
        require(
            _zkOwner.paramsHash ==
                transferParamsHash(
                    _zkOwner,
                    _token,
                    _transferTo,
                    _transferAmount
                ),
            "Invalid Params"
        );

        AddressUpgradeable.sendValue(payable(_transferTo), _transferAmount);
        emit TransferEthRelayed(_transferTo, _transferAmount);
    }

    // the owner can transfer the tokens out
    function transferTokenByOwner(
        IERC20 _token,
        address _to,
        uint256 _amount
    ) external nonReentrant {
        require(!paused, "Wallet paused");
        require(msg.sender == owner, "Only owner");
        _token.transfer(_to, _amount);
        emit TransferTokenByOwner(address(_token), _to, _amount);
    }

    function transferTokenRelayed(
        ZkOwner calldata _zkOwner,
        address _token, // the token to transfer
        address _transferTo, // the addres to transfer to
        uint256 _transferAmount // the amount of tokens transfered!
    ) external nonReentrant ZkOwnerCheck(_zkOwner, true) {
        require(!paused, "Wallet paused");
        require(
            _zkOwner.paramsHash ==
                transferParamsHash(
                    _zkOwner,
                    _token,
                    _transferTo,
                    _transferAmount
                ),
            "Invalid Params"
        );
        IERC20(_token).transfer(_transferTo, _transferAmount);
        emit TransferTokenByRelayer(_token, _transferTo, _transferAmount);
    }

    // Approve a spend
    function approveERC20SpendByOwner(
        IERC20 _token,
        address _spender,
        uint256 _amount
    ) external {
        require(!paused, "Wallet paused");
        require(msg.sender == owner, "Only owner");
        _token.approve(_spender, _amount);
        emit ApproveSpendByOwner(address(_token), _spender, _amount);
    }

    function approveERC20SpendRelayed(
        ZkOwner calldata _zkOwner,
        address _token, // The ERC20 token address
        address _spender, //In this case (approval) we pass the spender here
        uint256 _amount // And this is the amount that is approved!
    ) external nonReentrant ZkOwnerCheck(_zkOwner, true) {
        require(!paused, "Wallet paused");
        require(
            _zkOwner.paramsHash ==
                transferParamsHash(_zkOwner, _token, _spender, _amount),
            "Invalid params"
        );
        IERC20(_token).approve(_spender, _amount);
        emit ApproveSpendRelayed(_token, _spender, _amount);
    }

    function transferERC721ByOwner(
        IERC721 _token,
        address _from,
        address _to,
        uint256 _tokenId
    ) external {
        require(!paused, "Wallet paused");
        require(msg.sender == owner, "Only owner");
        _token.safeTransferFrom(_from, _to, _tokenId);
        emit TransferERC721ByOwner(address(_token), _from, _to, _tokenId);
    }

    function transferERC721ParamsHash(
        ZkOwner calldata _zkOwner,
        address _token,
        address _transferFrom,
        address _transferTo,
        uint256 _tokenId
    ) public pure returns (bytes32 h) {
        h = keccak256(
            abi.encodePacked(
                _zkOwner.commitment,
                _zkOwner.nullifierHash,
                _token,
                _transferFrom,
                _transferTo,
                _tokenId
            )
        );
    }

    function transferERC721Relayed(
        ZkOwner calldata _zkOwner,
        address _token, // the address of the ERC721 token
        address _transferFrom,
        address _transferTo, // the address to transfer the token to
        uint256 _tokenId // transferAmount from the circuit is tokenId in the case of the NFT standard
    ) external nonReentrant ZkOwnerCheck(_zkOwner, true) {
        require(!paused, "Wallet paused");
        require(
            _zkOwner.paramsHash ==
                transferERC721ParamsHash(
                    _zkOwner,
                    _token,
                    _transferFrom,
                    _transferTo,
                    _tokenId
                ),
            "Invalid Params"
        );
        IERC721(_token).safeTransferFrom(_transferFrom, _transferTo, _tokenId);
        emit TransferERC721Relayed(
            _token,
            _transferFrom,
            _transferTo,
            _tokenId
        );
    }

    function _approveAction(
        address _token,
        address _to,
        uint256 _tokenId,
        bool _forAll,
        bool _approved
    ) internal {
        if (_forAll) {
            IERC721(_token).setApprovalForAll(_to, _approved);
        } else {
            if (_approved) {
                IERC721(_token).approve(_to, _tokenId);
            } else {
                IERC721(_token).approve(address(0), _tokenId);
            }
        }
    }

    function approveERC721ByOwner(
        address _token,
        address _to,
        uint256 _tokenId,
        bool _forAll,
        bool _approved
    ) external nonReentrant {
        require(msg.sender == owner, "Only owner!");
        require(!paused, walletPausedError);

        _approveAction(_token, _to, _tokenId, _forAll, _approved);
        emit ApproveERC721ByOwner(_token, _to, _tokenId, _forAll, _approved);
    }

    function approveERC721ParamsHash(
        ZkOwner calldata _zkOwner,
        address _token,
        address _to,
        uint256 _tokenId,
        bool _forAll,
        bool _approved
    ) public pure returns (bytes32 h) {
        h = keccak256(
            abi.encodePacked(
                _zkOwner.commitment,
                _zkOwner.nullifierHash,
                _token,
                _to,
                _tokenId,
                _forAll,
                _approved
            )
        );
    }

    function approveERC721Relayed(
        ZkOwner calldata _zkOwner,
        address _token,
        address _to,
        uint256 _tokenId,
        bool _forAll,
        bool _approved
    ) external nonReentrant ZkOwnerCheck(_zkOwner, true) {
        require(!paused, walletPausedError);
        require(
            _zkOwner.paramsHash ==
                approveERC721ParamsHash(
                    _zkOwner,
                    _token,
                    _to,
                    _tokenId,
                    _forAll,
                    _approved
                ),
            "Invalid Params"
        );
        _approveAction(_token, _to, _tokenId, _forAll, _approved);
        emit ApproveERC721Relayed(_token, _to, _tokenId, _forAll, _approved);
    }

    function _depositToBunnyNote(
        address _notesContract,
        address _token,
        bytes32 _newCommitment,
        bool _cashNote,
        bool _isERC20Note
    ) internal {
        uint256 denomination = BunnyNotes(_notesContract).denomination();
        uint256 fee = BunnyNotes(_notesContract).fee();
        uint256 amount = denomination + fee;
        if (_isERC20Note) {
            require(
                address(ERC20Notes(_notesContract).token()) == _token,
                "Invalid token"
            );
            require(
                amount <= IERC20(_token).balanceOf(address(this)),
                "Invalid token balance!"
            );
            // Approve the spending of tokens for the Bunny Note contract
            IERC20(_token).approve(address(_notesContract), amount);
            //The smart contract wallet will deposit for itself: address(this)
            ERC20Notes(_notesContract).deposit(
                _newCommitment,
                _cashNote,
                address(this)
            );
        } else {
            require(address(this).balance > amount, "Invalid Balance!");
            //The smart contract wallet will deposit for itself: address(this)
            ETHNotes(_notesContract).deposit{value: amount}(
                _newCommitment,
                _cashNote,
                address(this)
            );
        }
    }

    function depositToBunnyNoteByOwner(
        address _notesContract,
        address _token,
        bytes32 _newCommitment,
        bool _cashNote,
        bool _isERC20Note
    ) external payable nonReentrant {
        require(!paused, "Wallet paused");
        require(msg.sender == owner, "Only owner!");
        _depositToBunnyNote(
            _notesContract,
            _token,
            _newCommitment,
            _cashNote,
            _isERC20Note
        );

        emit DepositBunnyNoteByOwner(
            _notesContract,
            _token,
            _newCommitment,
            _cashNote,
            _isERC20Note
        );
    }

    function depositToBunnyNoteParamsHash(
        ZkOwner calldata _zkOwner,
        address _notesContract,
        address _token,
        bytes32 _newCommitment,
        bool _cashNote,
        bool _isERC20Note
    ) public pure returns (bytes32 h) {
        h = keccak256(
            abi.encodePacked(
                _zkOwner.commitment,
                _zkOwner.nullifierHash,
                _notesContract,
                _token,
                _newCommitment,
                _cashNote,
                _isERC20Note
            )
        );
    }

    function depositToBunnyNoteRelayed(
        ZkOwner calldata _zkOwner,
        address _notesContract, // the address of the bunny note contract
        address _token, // the token used by the bunny note
        bytes32 _newCommitment, // the new commitment used for generating the bunny note
        bool _cashNote,
        bool _isERC20Note
    ) external nonReentrant ZkOwnerCheck(_zkOwner, true) {
        require(!paused, "Wallet paused");
        require(
            _zkOwner.paramsHash ==
                depositToBunnyNoteParamsHash(
                    _zkOwner,
                    _notesContract,
                    _token,
                    _newCommitment,
                    _cashNote,
                    _isERC20Note
                ),
            "Invalid ParamHash"
        );

        _depositToBunnyNote(
            _notesContract,
            _token,
            _newCommitment,
            _cashNote,
            _isERC20Note
        );

        emit DepositBunnyNoteRelayed(
            _notesContract,
            _token,
            _newCommitment,
            _cashNote,
            _isERC20Note
        );
    }

    function ownerValid(ZkOwner calldata _zkOwner)
        external
        ZkOwnerCheck(_zkOwner, false)
        returns (bool)
    {
        // This function is called by external contracts to verify the zkOwner parameter
        // It's needed so the nullifier hashes are only recorded in a single place, here
        // This contract will throw if the ownership check fails, otherwise it returns true!
        return true;
    }
}
