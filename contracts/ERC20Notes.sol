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
        IERC20 _token
    ) BunnyNotes(_verifier, _denomination) {
        token = _token;
    }

    function _processDeposit() internal override {
        require(
            msg.value == 0,
            "ETH valie is supposed to be 0 for ERC20 instance"
        );
        token.safeTransferFrom(msg.sender, address(this), denomination);
    }

    function _processWithdrawGiftCard(address payable _recipient, uint256 _fee)
        internal
        override
    {
        token.safeTransfer(_recipient, denomination - _fee);

        if (_fee > 0) {
            token.safeTransfer(_owner, _fee);
        }
    }

    function _processWithdrawCashNote(
        address payable _recipient,
        address payable creator,
        uint256 _price,
        uint256 _fee
    ) internal override {
        uint256 withoutFee = denomination - _fee;
        uint256 utxo = withoutFee - _price;

        token.safeTransfer(_recipient, _price);

        if (_fee > 0) {
            token.safeTransfer(_owner, _fee);
        }

        if (utxo > 0) {
            token.safeTransfer(creator, utxo);
        }
    }
}
