
 // SPDX-License-Identifire: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ZKBToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("ZKB", "ZKB") {
        _mint(msg.sender, initialSupply);
    }
}