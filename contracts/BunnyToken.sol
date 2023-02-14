// SPDX-License-Identifire: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BunnyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("BunnyToken", "ZKB") {
        _mint(msg.sender, initialSupply);
    }
}
