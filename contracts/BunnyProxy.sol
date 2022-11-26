// SPDX-License-Identifire: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract BunnyProxy is TransparentUpgradeableProxy {
    event ProxyCreated(address creator, address proxy);

    // This is the Proxy Admin Contract
    constructor(
        address _logic,
        address _admin,
        bytes memory _data
    ) payable TransparentUpgradeableProxy(_logic, _admin, _data) {
        emit ProxyCreated(msg.sender, address(this));
    }
}
