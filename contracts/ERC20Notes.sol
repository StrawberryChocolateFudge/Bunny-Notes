// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "./BunnyNotes.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract ERC20Notes is BunnyNotes {
    using SafeERC20 for IERC20;
    IERC20 public token;

    constructor(
        IVerifier _verifier,
        uint256 _denomination,
        uint8 _feeDivider,
        IERC20 _token,
        address _relayer
    ) BunnyNotes(_verifier, _denomination, _feeDivider, _relayer) {
        token = _token;
    }

    function _processDeposit(address depositFor) internal override {
        require(
            msg.value == 0,
            "ETH value is supposed to be 0 for ERC20 instance"
        );

        // If the msg.sender is not the account we deposit for, then we use the relayer who can deposit on behalf of another user!
        // This will allow the relayer to take a credit card payment and create the note on behalf of somebody else and pay for it!

        if (msg.sender == relayer) {
            // the relayer pays no fees, the fees are charged off-chain!
            token.safeTransferFrom(relayer, address(this), denomination);
        } else {
            require(msg.sender == depositFor, "You must deposit for yourself!");
            // Else if the sender is the address that wants to deposit
            // E.g Alice is depositing for herself
            // I need to transfer the Denomination + the Fee for deposits!
            token.safeTransferFrom(msg.sender, address(this), denomination);

            // Send the owner the fee
            token.safeTransferFrom(msg.sender, _owner, fee);
        }
    }

    function _processWithdrawGiftCard(address payable _recipient)
        internal
        override
    {
        token.safeTransfer(_recipient, denomination);
    }

    function _processWithdrawCashNote(
        address payable _recipient,
        address payable creator,
        uint256 _price,
        uint256 _change
    ) internal override {
        token.safeTransfer(_recipient, _price);
        if (_change > 0) {
            token.safeTransfer(creator, _change);
        }
    }
}
