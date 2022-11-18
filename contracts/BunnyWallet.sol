//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ERC20Notes.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@openzeppelin/contracts/utils/Address.sol";

interface IOwnerVerifier {
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[6] memory _input
    ) external returns (bool);
}

interface ISwapVerifier {
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[9] memory _input
    ) external returns (bool);
}

// A Bunny wallet that needs to be deployed per user!

contract BunnyWallet is ReentrancyGuard {
    using SafeMath for uint256;
    // The bunny wallet has wallet deposit and withdraw feature.
    // users can deposit into the bunny wallet tokens,eth or interact with bunny notes

    IOwnerVerifier public immutable ownerVerifier;
    ISwapVerifier public immutable swapVerifier;
    ISwapRouter public immutable swapRouter;
    bytes32 public commitment;
    address public owner; // The Owner of this Wallet, he can add more tokens
    bool public paused; // The wallet contract can be paused by the owner

    event Received(address from, uint256 amount);
    event CommitmentReset(bytes32 oldCommitment, bytes32 newCommitment);
    event TransferEthByOwner(address to, uint256 amount);
    event TransferEthRelayed(address to, uint256 amount);
    event TransferTokenByOwner(address to, uint256 amount);
    event TransferTokenByRelayer(address to, uint256 amount);
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

    constructor(
        IOwnerVerifier _ownerVerifier,
        ISwapVerifier _swapVerifier,
        ISwapRouter _swapRouter,
        bytes32 _commitment,
        address _owner
    ) {
        ownerVerifier = _ownerVerifier;
        swapVerifier = _swapVerifier;
        commitment = _commitment;
        owner = _owner;
        swapRouter = _swapRouter;
        paused = false;
    }

    // The owner can reset the commitment to create a new note!

    function resetCommitment(bytes32 newCommitment) external {
        require(msg.sender == owner, "Only owner");
        emit CommitmentReset(commitment, newCommitment);
        commitment = newCommitment;
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
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
        require(!paused, "Wallet paused");

        Address.sendValue(payable(_to), _amount);
        emit TransferEthByOwner(_to, _amount);
    }

    function transferETHRelayed(
        uint256[8] calldata _proof, //The zkp
        bytes32 _commitment, // The commitment of this contract
        address _smartContract, // The address of this smart contract
        address _token, // must be zero address for eth transfer
        address _transferTo, // the address to transfer to
        uint256 _transferAmount, // the amount of eth transferred,
        address _relayer // The address of the relayer
    ) external nonReentrant {
        require(msg.sender == _relayer, "Invalid sender");
        require(!paused, "Wallet paused");
        require(_smartContract == address(this), "Invalid contract");
        require(_commitment == commitment, "Invalid commitment");
        require(
            ownerVerifier.verifyProof(
                [_proof[0], _proof[1]],
                [[_proof[2], _proof[3]], [_proof[4], _proof[5]]],
                [_proof[6], _proof[7]],
                [
                    uint256(_commitment),
                    uint256(uint160(_smartContract)),
                    uint256((uint160(_token))),
                    uint256(uint160(_transferTo)),
                    uint256(_transferAmount),
                    uint256(uint160(_relayer))
                ]
            ),
            "Invalid proof"
        );
        Address.sendValue(payable(_transferTo), _transferAmount);
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
        emit TransferTokenByOwner(_to, _amount);
    }

    function transferTokenRelayed(
        uint256[8] calldata _proof, // the zkp
        bytes32 _commitment, // the commitment of this contract
        address _smartContract, // the address of this smart contract
        address _token, // the token to transfer
        address _transferTo, // the addres to transfer to
        uint256 _transferAmount, // the amount of tokens transfered!
        address _relayer // The address of the relayer
    ) external nonReentrant {
        require(!paused, "Wallet paused");
        require(msg.sender == _relayer, "Invalid relayer");
        require(_smartContract == address(this), "Invalid Contract address");
        require(_commitment == commitment, "Invalid Commitment!");
        require(
            ownerVerifier.verifyProof(
                [_proof[0], _proof[1]],
                [[_proof[2], _proof[3]], [_proof[4], _proof[5]]],
                [_proof[6], _proof[7]],
                [
                    uint256(_commitment),
                    uint256(uint160(_smartContract)),
                    uint256((uint160(_token))),
                    uint256(uint160(_transferTo)),
                    uint256(_transferAmount),
                    uint256(uint160(_relayer))
                ]
            ),
            "Invalid proof"
        );
        IERC20(_token).transfer(_transferTo, _transferAmount);
        emit TransferTokenByRelayer(_transferTo, _transferAmount);
    }

    function depositToBunnyNoteByOwner(
        ERC20Notes _notesContract,
        IERC20 _token,
        bytes32 newCommitment
    ) external nonReentrant {
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
        _notesContract.deposit(newCommitment, address(this));

        emit DepositBunnyNoteByOwner(_notesContract, _token, commitment);
    }

    function depositToBunnyNoteRelayed(
        uint256[8] calldata _proof, // the zkp
        bytes32 _commitment, // the commitment of this smart contract
        address _smartContract, // the address of this smart contract
        address _token, // the token used by the bunny note
        address _transferTo, // the address of the bunny note contract
        uint256 _transferAmount, // the denomination of the bunny note
        bytes32 newCommitment, // the new commitment used for generating the bunny note
        address _relayer
    ) external nonReentrant {
        require(!paused, "Wallet paused");
        //The transaction is relayed but the contract is depositing for itself!
        require(msg.sender == _relayer, "Invalid Relayer!");
        require(_smartContract == address(this), "Invalid contract address");
        require(_commitment == commitment, "Invalid Commitment");
        require(
            ownerVerifier.verifyProof(
                [_proof[0], _proof[1]],
                [[_proof[2], _proof[3]], [_proof[4], _proof[5]]],
                [_proof[6], _proof[7]],
                [
                    uint256(_commitment),
                    uint256(uint160(_smartContract)),
                    uint256((uint160(_token))),
                    uint256(uint160(_transferTo)),
                    uint256(_transferAmount),
                    uint256(uint160(_relayer))
                ]
            ),
            "Invalid withdraw proof"
        );
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
        notesContract.deposit(newCommitment, address(this));
        emit DepositBunnyNoteRelayed(notesContract, _token, newCommitment);
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

    function exactInputSingleSwapRelayed(
        uint256[8] calldata _proof, // the zkp
        bytes32 _commitment,
        address _smartContract,
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        uint256 _amountOutMin,
        address _recipient,
        address _relayer,
        uint24 _fee
    ) external nonReentrant returns (uint256 amountOut) {
        require(!paused, "Wallet paused");
        //The transaction is relayed but the contract is depositing for itself!
        require(msg.sender == _relayer, "Invalid Relayer!");
        require(_smartContract == address(this), "Invalid contract address");
        require(_commitment == commitment, "Invalid Commitment");
        require(
            swapVerifier.verifyProof(
                [_proof[0], _proof[1]],
                [[_proof[2], _proof[3]], [_proof[4], _proof[5]]],
                [_proof[6], _proof[7]],
                [
                    uint256(_commitment),
                    uint256(uint160(_smartContract)),
                    uint256(uint160(_tokenIn)),
                    uint256(uint160(_tokenOut)),
                    uint256(_amountIn),
                    uint256(uint160(_recipient)),
                    uint256(_amountOutMin),
                    uint256(uint160(_relayer)),
                    uint256(_fee)
                ]
            ),
            "Invalid withdraw proof"
        );
        amountOut = exactInputSingleSwap(
            _tokenIn,
            _tokenOut,
            _amountIn,
            _amountOutMin,
            _recipient,
            _fee
        );
        emit SwapRelayed(_tokenIn, _tokenOut, _amountIn, _amountOutMin);
    }
}
