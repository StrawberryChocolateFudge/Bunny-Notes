// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// The interface of the Verifier generated for the Bunny Bundles
interface IBundleVerifier {
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[4] memory _input
    ) external returns (bool);
}

contract ZKNFT is ERC721, ReentrancyGuard {
    IBundleVerifier public immutable bundleVerifier;

    bytes32 public immutable root;

    uint256 public immutable bundleSize;

    uint256 public notesLeft;

    string private baseURI_;

    mapping(bytes32 => bool) public nullifierHashes;

    event Redeemed(uint256 tokenId, address to);

    /**
      @dev The constructor will set the merkle root of the bundle on deploy along with other important variables
      @param params array contains [0]= name, [1] = symbol, [2] = baseURI
      @param verifier_ is the ZKP verifier contract
      @param root_ is the merkle root of the bundle
      @param size_ is the size of the bundle
     */

    constructor(
        string[3] memory params,
        address verifier_,
        bytes32 root_,
        uint256 size_
    ) ERC721(params[0], params[1]) {
        baseURI_ = params[2];
        bundleVerifier = IBundleVerifier(verifier_);
        root = root_;
        bundleSize = size_;
        notesLeft = size_;
    }

    function redeemToken(
        uint256[8] calldata _proof,
        bytes32 _nullifierHash,
        bytes32 _commitment,
        bytes32 _root,
        address _recipient
    ) public nonReentrant {
        require(!nullifierHashes[_nullifierHash], "Already redeemed!");
        require(notesLeft > 0, "Can't redeem more");
        require(
            bundleVerifier.verifyProof(
                [_proof[0], _proof[1]],
                [[_proof[2], _proof[3]], [_proof[4], _proof[5]]],
                [_proof[6], _proof[7]],
                [
                    uint256(_nullifierHash),
                    uint256(_commitment),
                    uint256(uint160(_recipient)),
                    uint256(_root)
                ]
            ),
            "Invalid proof"
        );
        // Nullify the note so it can't be used again
        nullifierHashes[_nullifierHash] = true;
        notesLeft -= 1;

        super._mint(_recipient, uint256(_commitment));
        emit Redeemed(uint256(_commitment), _recipient);
    }

    // Overriding _baseURI to use the value passed in through the constructor
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI_;
    }
}
