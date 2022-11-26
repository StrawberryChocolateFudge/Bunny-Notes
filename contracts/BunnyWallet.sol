//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "./ERC20Notes.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
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
    ISwapRouter public swapRouter;
    bytes32 public commitment;
    address public owner; // The Owner of this Wallet, he can add more tokens
    bool public paused; // The wallet contract can be paused by the owner

    uint256 public totalWeiReceived;

    string public constant walletPausedError = "Wallet Paused";

    mapping(bytes32 => bool) public nullifierHashes;
    event InitializedContract(
        address _ownerVerifier,
        address _swapRouter,
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
        ERC20Notes _notesContract,
        IERC20 token,
        bytes32 commitment
    );
    event DepositBunnyNoteRelayed(
        ERC20Notes _notesContract,
        address token,
        bytes32 commitment
    );

    event SwapByOwner(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin
    );
    event SwapRelayed(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin
    );

    modifier ZkOwnerCheck(ZkOwner calldata _zkOwner) {
        require(!nullifierHashes[_zkOwner.nullifierHash], "Proof used!");
        require(_zkOwner.smartContract == address(this), "Invalid contract");
        require(_zkOwner.commitment == commitment, "Invalid commitment");
        require(msg.sender == _zkOwner.relayer, "Invalid Relayer");
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
        ISwapRouter _swapRouter,
        bytes32 _commitment,
        address _owner
    ) public initializer {
        ownerVerifier = _ownerVerifier;
        commitment = _commitment;
        owner = _owner;
        swapRouter = _swapRouter;
        paused = false;
        emit InitializedContract(
            address(_ownerVerifier),
            address(_swapRouter),
            _commitment,
            _owner
        );
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

    // The tokens are passed in >per function, so I don't store all the available tokens
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
    ) external nonReentrant ZkOwnerCheck(_zkOwner) {
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
    ) external nonReentrant ZkOwnerCheck(_zkOwner) {
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
    ) external nonReentrant ZkOwnerCheck(_zkOwner) {
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
    ) external nonReentrant ZkOwnerCheck(_zkOwner) {
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

    function approveERC721ByOwner(
        address _token,
        address _to,
        uint256 _tokenId,
        bool _forAll,
        bool _approved
    ) external nonReentrant {
        require(msg.sender == owner, "Only owner!");
        require(!paused, walletPausedError);

        if (_forAll) {
            IERC721(_token).setApprovalForAll(_to, _approved);
        } else {
            IERC721(_token).approve(_to, _tokenId);
        }

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
    ) external nonReentrant ZkOwnerCheck(_zkOwner) {
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

        if (_forAll) {
            IERC721(_token).setApprovalForAll(_to, _approved);
        } else {
            IERC721(_token).approve(_to, _tokenId);
        }

        emit ApproveERC721Relayed(_token, _to, _tokenId, _forAll, _approved);
    }

    //TODO: Refactor this to use also ETHNotes!
    function depositToBunnyNoteByOwner(
        ERC20Notes _notesContract,
        IERC20 _token,
        bytes32 _newCommitment,
        bool _cashNote
    ) external payable nonReentrant {
        require(!paused, "Wallet paused");
        require(msg.sender == owner, "Only owner!");
        require(
            address(_notesContract.token()) == address(_token),
            "Invalid token"
        );
        // The smart contract must have enough balance to deposit the tokens for the bunny note!

        uint256 denomination = _notesContract.denomination();
        uint256 fee = _notesContract.fee();
        uint256 amount = denomination + fee;
        require(
            amount <= _token.balanceOf(address(this)),
            "Invalid token balance!"
        );
        // Approve the spending of tokens for the Bunny Note contract
        _token.approve(address(_notesContract), amount);

        //The smart contract wallet will deposit for itself: address(this)
        _notesContract.deposit(_newCommitment, _cashNote, address(this));

        emit DepositBunnyNoteByOwner(_notesContract, _token, commitment);
    }

    function depositToBunnyNoteParamsHash(
        ZkOwner calldata _zkOwner,
        address _token,
        address _transferTo,
        uint256 _transferAmount,
        bytes32 _newCommitment,
        bool _cashNote
    ) public pure returns (bytes32 h) {
        h = keccak256(
            abi.encodePacked(
                _zkOwner.commitment,
                _zkOwner.nullifierHash,
                _token,
                _transferTo,
                _transferAmount,
                _newCommitment,
                _cashNote
            )
        );
    }

    function depositToBunnyNoteRelayed(
        ZkOwner calldata _zkOwner,
        address _token, // the token used by the bunny note
        address _transferTo, // the address of the bunny note contract
        uint256 _transferAmount, // the denomination of the bunny note
        bytes32 _newCommitment, // the new commitment used for generating the bunny note
        bool _cashNote
    ) external nonReentrant ZkOwnerCheck(_zkOwner) {
        require(!paused, "Wallet paused");
        require(
            _zkOwner.paramsHash ==
                depositToBunnyNoteParamsHash(
                    _zkOwner,
                    _token,
                    _transferTo,
                    _transferAmount,
                    _newCommitment,
                    _cashNote
                ),
            "Invalid ParamHash"
        );
        //
        ERC20Notes notesContract = ERC20Notes(_transferTo);
        // Verify that the transfer amount is the same as the denomination!
        uint256 denomination = notesContract.denomination();
        uint256 fee = notesContract.fee();
        uint256 amount = denomination + fee;
        require(amount == _transferAmount, "Invalid transfer amount!");
        // the bunny note must use the same token as passed into the contract
        require(address(notesContract.token()) == _token, "Invalid ERC20!");
        // approve the spend
        IERC20(_token).approve(_transferTo, amount);
        // now the Smart Contract deposits the tokens
        notesContract.deposit(_newCommitment, _cashNote, address(this));
        emit DepositBunnyNoteRelayed(notesContract, _token, _newCommitment);
    }

    function exactInputSingleSwap(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        uint256 _amountOutMin,
        address _recipient,
        uint24 _fee
    ) internal returns (uint256) {
        TransferHelper.safeApprove(_tokenIn, address(swapRouter), _amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: _tokenIn,
                tokenOut: _tokenOut,
                fee: _fee,
                recipient: _recipient,
                deadline: block.timestamp,
                amountIn: _amountIn,
                amountOutMinimum: _amountOutMin,
                sqrtPriceLimitX96: 0
            });

        return swapRouter.exactInputSingle(params);
    }

    function exactInputSingleSwapByOwner(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        uint256 _amountOutMin,
        address _recipient,
        uint24 _fee
    ) external nonReentrant returns (uint256 amountOut) {
        require(!paused, "Wallet paused");
        require(msg.sender == owner, "Only owner!");
        amountOut = exactInputSingleSwap(
            _tokenIn,
            _tokenOut,
            _amountIn,
            _amountOutMin,
            _recipient,
            _fee
        );
        emit SwapByOwner(_tokenIn, _tokenOut, _amountIn, _amountOutMin);
    }

    function exactInputSingleSwapParamsHash(
        ZkOwner calldata _zkOwner,
        address[4] calldata _addressParams,
        uint256[2] calldata _amounts,
        uint24 _fee
    ) public pure returns (bytes32 h) {
        h = keccak256(
            abi.encodePacked(
                _zkOwner.commitment,
                _zkOwner.nullifierHash,
                _addressParams[0],
                _addressParams[1],
                _addressParams[2],
                _addressParams[3],
                _amounts[0],
                _amounts[1],
                _fee
            )
        );
    }

    function exactInputSingleSwapRelayed(
        ZkOwner calldata _zkOwner,
        address[4] calldata _addressParams, // [0] = tokenId, [1] = tokenOut,[2] = recipient
        uint256[2] calldata _amounts, //[0]= _amountIn,[1] = __amountOutMin,
        uint24 _fee
    ) external nonReentrant ZkOwnerCheck(_zkOwner) returns (uint256 amountOut) {
        require(!paused, "Wallet paused");
        require(
            _zkOwner.paramsHash ==
                exactInputSingleSwapParamsHash(
                    _zkOwner,
                    _addressParams,
                    _amounts,
                    _fee
                ),
            "Invalid Params"
        );
        amountOut = exactInputSingleSwap(
            _addressParams[0],
            _addressParams[1],
            _amounts[0],
            _amounts[1],
            _addressParams[2],
            _fee
        );
        emit SwapRelayed(
            _addressParams[0],
            _addressParams[1],
            _amounts[0],
            _amounts[1]
        );
    }
}
