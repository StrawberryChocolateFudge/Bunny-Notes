//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "./BunnyWallet.sol";

//TODO: TEST THIS CONTRACT!!
// Implemented based on https://docs.uniswap.org/contracts/v3/guides/swaps/single-swaps

contract SwapTokens is ReentrancyGuard {
    ISwapRouter public swapRouter;
    IOwnerVerifier public ownerVerifier;

    mapping(bytes32 => bool) public nullifierHashes;

    constructor(IOwnerVerifier _isOwnerVerifier, ISwapRouter _swapRouter) {
        swapRouter = _swapRouter;
        ownerVerifier = _isOwnerVerifier;
    }

    event SwapRelayed(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin
    );

    function exactInputSingleSwap(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        uint256 _amountOutMin,
        address _recipient,
        uint24 _fee
    ) internal returns (uint256) {
        // Transfer the specified amount of tokens to this contract.
        // The caller address must approve it first!
        TransferHelper.safeTransferFrom(
            _tokenIn,
            msg.sender,
            address(this),
            _amountIn
        );

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
    ) external nonReentrant returns (uint256 amountOut) {
        require(
            BunnyWallet(payable(_zkOwner.smartContract)).ownerValid(_zkOwner),
            "Invalid zkOwner"
        );
        require(_zkOwner.relayer == msg.sender, "Invalid Relayer");
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
