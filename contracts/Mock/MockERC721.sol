// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MOCKERC721 is ERC721 {
    constructor() ERC721("MOCKERC721", "MOCK") {}

    function mintUniqueTokenTo(address _to, uint256 _tokenId) public {
        super._mint(_to, _tokenId);
    }
}
