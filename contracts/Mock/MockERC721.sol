// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MOCKERC721 is ERC721 {
    constructor() ERC721("MOCKERC721", "MOCK") {}

    function mintUniqueTokenTo(address _to, uint256 _tokenId) public {
        super._mint(_to, _tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        super.safeTransferFrom(from, to, tokenId);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "http://localhost:1234/";
    }
}
