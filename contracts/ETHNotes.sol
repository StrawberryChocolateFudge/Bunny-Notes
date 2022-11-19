//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./BunnyNotes.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract ETHNotes is BunnyNotes {
    constructor(
        IVerifier _verifier,
        uint256 _denomination,
        uint8 _feeDivider,
        address _relayer
    ) BunnyNotes(_verifier, _denomination, _feeDivider, _relayer) {}

    function _processDeposit(address depositFor) internal override {
        if (msg.sender == relayer) {
            require(msg.value == denomination, "Please send correct value");
            // If the relayer makes this tx, there are no fees
        } else {
            require(msg.sender == depositFor,"You must deposit for yourself");
            require(
                msg.value == denomination + fee,
                "Please send correct value with fee"
            );

            // Forward the fee to the owner
            Address.sendValue(_owner, fee);
        }
    }

    function _processWithdrawGiftCard(address payable _recipient)
        internal
        override
    {
        Address.sendValue(_recipient, denomination);
    }

    function _processWithdrawCashNote(
        address payable _recipient,
        address payable _creator,
        uint256 _price,
        uint256 _change
    ) internal override{
        Address.sendValue(_recipient, _price);

        if(_change > 0){
            Address.sendValue(_creator, _change);
        }
    }
}
