// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// The interface of the WithdrawVerifier contract generated from the circuit
interface IVerifier {
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[4] memory _input
    ) external returns (bool);
}

// The BunnyBundles are stored in structs, similar to the BunnyNotes

struct BundleStore {
    address creator;
    uint256 createdDate;
    uint256 size; // Individual note value is totalValue / size
    uint256 totalValue; // The total value is the deposited value
    uint256 valueLeft;
    uint256 bunnyNotesLeft;
    bool usesToken;
    IERC20 token;
}

contract BunnyBundles is ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IVerifier public immutable verifier; // The verifier address

    address payable public _owner; // The owner of the smart contract

    address public feelessToken; //The token without fees

    uint256 public constant FEE_DIVIDER = 100; //1% fee will be used

    mapping(bytes32 => mapping(bytes32 => bool)) public nullifierHashes; // NullifierHashes per root. These are used to nullify a Bunny Note inside a Bundle!

    mapping(bytes32 => BundleStore) public bundles; // The Bunny Bundles are stored in a struct, accessable with the bundle root hash!

    mapping(bytes32 => address) public recipients; // Storing the recipients of the withdraw txs here nullifierHash ==> address

    event DepositETH(
        bytes32 indexed root,
        address depositFor,
        uint256 timestamp,
        uint256 totalValue,
        uint256 size,
        uint256 fee
    );

    event DepositToken(
        bytes32 indexed root,
        address depositFor,
        uint256 timestamp,
        uint256 totalValue,
        uint256 size,
        uint256 fee,
        address token
    );

    event WithdrawFromBundle(
        address from,
        address to,
        bytes32 root,
        bytes32 commitment
    );

    /**
        @dev : the constructor
        @param _verifier is the address of SNARK verifier contract        
    */

    constructor(IVerifier _verifier, address _feelessToken) {
        verifier = _verifier;
        _owner = payable(msg.sender);
        feelessToken = _feelessToken;
    }

    /**
       @dev : SetFeelessToken sets the token the contract uses without calculating fees
       @param newFeelesstoken is the token to use without fees
     */

    function setFeelessToken(address newFeelesstoken) external {
        require(msg.sender == _owner, "Only owner");
        feelessToken = newFeelesstoken;
    }

    /**
      @dev : Create a BunnyBundle by depositing ETH!
      @param root is the poseidon hash merkle root of the commitments created for this bunny bundle
      @param totalValue that is the value of the whole bundle.The totalValue  argument does not contain the fee
      @param size the size of the Bundle. The Bunny Notes in the bundle are worth totalValue / size
    */

    function depositEth(
        bytes32 root,
        uint256 totalValue,
        uint256 size
    ) external payable nonReentrant {
        require(bundles[root].creator == address(0), "Bundle exists");
        require(totalValue > 0, "Invalid totalValue");
        require(size > 0, "Invalid Size");
        uint256 fee = calculateFee(totalValue);
        require(msg.value == totalValue.add(fee), "Invalid value");

        // Record the BunnyBundle creation
        bundles[root].creator = msg.sender;
        bundles[root].createdDate = block.timestamp;
        bundles[root].size = size;
        bundles[root].bunnyNotesLeft = size;
        bundles[root].totalValue = totalValue;
        bundles[root].valueLeft = totalValue;

        // Forward the fee to the owner

        Address.sendValue(_owner, fee);
        emit DepositETH(
            root,
            msg.sender,
            block.timestamp,
            totalValue,
            size,
            fee
        );
    }

    /**
      @dev : Create a BunnyBundle by depositing ERC20!
      @param root is the poseidon hash merkle root of the commitments created for this bunny bundle
      @param totalValue that is the value of the whole bundle.The totalValue  argument does not contain the fee
      @param size the size of the Bundle. The Bunny Notes in the bundle are worth totalValue / size
    */

    function depositToken(
        bytes32 root,
        uint256 totalValue,
        uint256 size,
        address token
    ) external nonReentrant {
        require(bundles[root].creator == address(0), "Bundle Exists");
        require(totalValue > 0, "Invalid total value");
        require(size > 0, "Invalid size");

        bundles[root].creator = msg.sender;
        bundles[root].createdDate = block.timestamp;
        bundles[root].size = size;
        bundles[root].bunnyNotesLeft = size;
        bundles[root].totalValue = totalValue;
        bundles[root].valueLeft = totalValue;
        bundles[root].usesToken = true;
        bundles[root].token = IERC20(token);
        uint256 fee = calculateFee(totalValue);
        IERC20(token).safeTransferFrom(msg.sender, address(this), totalValue);

        // The owner can set 1 token without fees
        if (token != feelessToken) {
            IERC20(token).safeTransferFrom(msg.sender, _owner, fee);
        }

        emit DepositToken(
            root,
            msg.sender,
            block.timestamp,
            totalValue,
            size,
            fee,
            token
        );
    }

    /**
     @dev calculate the fee used for the denomination
     @param amount is the amount of value transferred to the cotnract to make a deposit and create a bunny note
   */
    function calculateFee(uint256 amount) public pure returns (uint256 fee) {
        fee = amount.div(FEE_DIVIDER);
    }

    /**
    @dev get the value of the note from totalValue and size
    @param totalValue is the totalValue of the bundle
    @param size is the amount of notes in the bundle, the totalValue is divided by the size to get individual note value!
    */

    function getNoteValue(
        uint256 totalValue,
        uint256 size
    ) public pure returns (uint256 value) {
        value = totalValue.div(size);
    }

    /**
    @dev withdraw a single value from the Bunny Bundle that was deposited
    @param _proof is the skSnark generated on the client side
    @param _nullifierHash is the poseidon hash of the nullifier used in the individual Bunny Note that was withdrawn
    @param _commitment is how the bunny note is identified, This commitment must be contained in the merkle tree that has the root has saved in the bundle
    @param _root this is the root hash that was generated from the BunnyBundle client side, The leaves of the tree must contain the commitment and we create a client side proof to verify this
    @param _recipient is the address that withdrew the value of the bundle, this address recieved payment from the bundle creator!
   */

    function withdraw(
        uint256[8] calldata _proof,
        bytes32 _nullifierHash,
        bytes32 _commitment,
        bytes32 _root,
        address _recipient
    ) external nonReentrant {
        require(!nullifierHashes[_root][_nullifierHash], "Invalid note");
        require(bundles[_root].creator != address(0), "Unused root!");

        require(bundles[_root].valueLeft > 0, "No value left");
        require(bundles[_root].bunnyNotesLeft > 0, "No more");
        require(
            verifier.verifyProof(
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
            "Invalid Withdraw proof"
        );
        // Nullify the BunnyBundle, invalidating it!
        nullifierHashes[_root][_nullifierHash] = true;
        bundles[_root].bunnyNotesLeft -= 1;

        uint256 noteValue = getNoteValue(
            bundles[_root].totalValue,
            bundles[_root].size
        );

        // Decrement the value left indicator
        bundles[_root].valueLeft = bundles[_root].valueLeft.sub(noteValue);

        //    Process the withdraw
        if (bundles[_root].usesToken) {
            // Transfer the token
            bundles[_root].token.safeTransfer(_recipient, noteValue);
        } else {
            Address.sendValue(payable(_recipient), noteValue);
        }
        recipients[_nullifierHash] = _recipient;
        emit WithdrawFromBundle(
            bundles[_root].creator,
            _recipient,
            _root,
            _commitment
        );
    }

    /**
    @dev whether a BunnyNote is already spent from a Bundle
    @param _nullifierHash is used to check if an individual note has been spent
    @param _root is used to check for a nullifierHashes per bundle
     */

    function isSpent(
        bytes32 _nullifierHash,
        bytes32 _root
    ) public view returns (bool) {
        return nullifierHashes[_root][_nullifierHash];
    }
}
