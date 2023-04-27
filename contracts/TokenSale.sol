//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title ZKB Token Sale using the OpenZeppelin Crowdsale contract.
 * The rate calculation makes the assumption that 50 000 000 ZKB tokens will be sold from the total supply of 100 million at the rate of 15000 ZKB for 1 BNB

 * @dev Crowdsale is the base contract for managing this token crowdsale,
 * allowing investors to purchase tokens with ether. This contract implements
 * such functionality in its most fundamental form and can be extended to provide additional
 * functionality and/or custom behavior.
 * The external interface represents the basic interface for purchasing tokens, and conforms
 * the base architecture for crowdsales. It is *not* intended to be modified / overridden.
 * The internal interface conforms the extensible and modifiable surface of crowdsales. Override
 * the methods to add functionality. Consider using 'super' where appropriate to concatenate
 * behavior.
 */

contract TokenSale is Context, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using SafeCast for int256;

    // The token being sold
    IERC20 private _token;

    // Address where funds are collected
    address payable private _wallet;

    // Amount of wei raised
    uint256 private _weiRaised;

    uint256 private tokensSold;

    uint256 public rate = 15000;

    uint256 private maxSold = 50000000e18;

    /**
     * Event for token purchase logging
     * @param purchaser who paid for the tokens
     * @param beneficiary who got the tokens
     * @param value weis paid for purchase
     * @param amount amount of tokens purchased
     */
    event TokensPurchased(
        address indexed purchaser,
        address indexed beneficiary,
        uint256 value,
        uint256 amount
    );

    /**
     * @param _wallet_ Address where collected funds will be forwarded to
     * @param _token_ Address of the token being sold
     */
    constructor(address payable _wallet_, IERC20 _token_) {
        require(_wallet_ != address(0), "948");
        require(address(_token_) != address(0), "948");

        _wallet = _wallet_;
        _token = _token_;
        tokensSold = 0;
    }

    /**
     * @dev fallback function ***DO NOT OVERRIDE***
     * Note that other contracts will transfer funds with a base gas stipend
     * of 2300, which is not enough to call buyTokens. Consider calling
     * buyTokens directly when purchasing tokens from a contract.
     */
    receive() external payable {
        buyTokens();
    }

    /**
     * @return the token being sold.
     */
    function token() public view returns (IERC20) {
        return _token;
    }

    /**
     * @return the address where funds are collected.
     */
    function wallet() public view returns (address payable) {
        return _wallet;
    }

    /**
     * @return the amount of wei raised.
     */
    function weiRaised() public view returns (uint256) {
        return _weiRaised;
    }

    /**
     * @dev low level token purchase ***DO NOT OVERRIDE***
     * This function has a non-reentrancy guard, so it shouldn't be called by
     * another `nonReentrant` function.
     */
    function buyTokens() public payable nonReentrant {
        // How much tokens are sold
        uint256 weiAmount = msg.value;

        _preValidatePurchase(msg.sender, weiAmount);
        // calculate token amount to be created
        uint256 tokens = getTokenAmount(weiAmount);

        require(tokens.add(tokensSold) <= maxSold, "Exceeds allowed limit");

        // Update how many tokens were already sold
        tokensSold = tokensSold.add(tokens);
        // update how much wei was raised
        _weiRaised = _weiRaised.add(weiAmount);
        _processPurchase(msg.sender, tokens);
        emit TokensPurchased(_msgSender(), msg.sender, weiAmount, tokens);
        _forwardFunds();
    }

    /**
     * @dev Validation of an incoming purchase. Use require statements to revert state when conditions are not met.
     * Use `super` in contracts that inherit from Crowdsale to extend their validations.
     * @param beneficiary Address performing the token purchase
     * @param weiAmount Value in wei involved in the purchase
     */
    function _preValidatePurchase(
        address beneficiary,
        uint256 weiAmount
    ) internal pure {
        require(beneficiary != address(0), "Invalid beneficiary");
        require(weiAmount != 0, "Invalid amount");
    }

    /**
     * @dev Source of tokens. Override this method to modify the way in which the crowdsale ultimately gets and sends
     * its tokens.
     * @param beneficiary Address performing the token purchase
     * @param tokenAmount Number of tokens to be emitted
     */
    function _deliverTokens(address beneficiary, uint256 tokenAmount) internal {
        // Token delivery requires allowance
        _token.safeTransferFrom(_wallet, beneficiary, tokenAmount);
    }

    /**
     * @dev Executed when a purchase has been validated and is ready to be executed. Doesn't necessarily emit/send
     * tokens.
     * @param beneficiary Address receiving the tokens
     * @param tokenAmount Number of tokens to be purchased
     */
    function _processPurchase(
        address beneficiary,
        uint256 tokenAmount
    ) internal {
        _deliverTokens(beneficiary, tokenAmount);
    }

    function getTokensSold() external view returns (uint256) {
        return tokensSold;
    }

    function getTokensLeft() external view returns (uint256) {
        return maxSold.sub(tokensSold);
    }

    /**
     * @dev Override to extend the way in which ether is converted to tokens.
     * @param weiAmount Value in wei to be converted into tokens
     * @return Number of tokens that can be purchased with the specified _weiAmount
     */
    function getTokenAmount(uint256 weiAmount) public view returns (uint256) {
        return rate.mul(weiAmount);
    }

    /**
     * @dev Determines how ETH is stored/forwarded on purchases.
     */
    function _forwardFunds() internal {
        _wallet.transfer(msg.value);
    }
}
