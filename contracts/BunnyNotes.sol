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
        uint256[3] memory _input
    ) external returns (bool);
}
// The BunnyNote commitments are stored in this struct
struct CommitmentStore {
    bool used;
    address creator;
    address recipient;
    uint256 createdDate;
    uint256 spentDate;
    bool usesToken;
    IERC20 token;
    uint256 denomination;
}

contract BunnyNotes is ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IVerifier public immutable verifier; // The verifier address

    address payable public _owner; // The owner of the contract that can update the feeless token's address

    address public feelessToken; // The owner can specify one token that has no fees!

    uint256 public constant feeDivider = 100; // 1% fee will be used. This is the amount to divide the denomination to calculate the fee

    mapping(bytes32 => bool) public nullifierHashes; // Nuffifier Hashes are used to nullify a BunnyNote so we know they have been spent
    // We store all the commitments to make sure there are no accidental deposits twice and this allows us to query for transaction details later
    mapping(bytes32 => CommitmentStore) public commitments;

    event DepositETH(
        bytes32 indexed commitment,
        address depositFor,
        uint256 timestamp,
        uint256 denomination,
        uint256 fee
    );

    event DepositToken(
        bytes32 indexed commitment,
        address depositFor,
        uint256 timestamp,
        uint256 amount,
        uint256 fee,
        address token
    );

    event WithdrawBunnyNote(address from, address to, bytes32 commitment);

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
      @dev : Create a BunnyNote by depositing ETH
      @param _commitment is the poseidon hash created for the note on client side
      @param denomination that is the value of the note. Denomination argument does not contain the fee
    */

    function depositEth(
        bytes32 _commitment,
        uint256 denomination
    ) external payable nonReentrant {
        require(!commitments[_commitment].used, "Used commitment");
        require(denomination > 0, "Invalid denomination");
        uint256 fee = calculateFee(denomination);
        require(msg.value == denomination + fee, "Invalid Value");
        // Record the BunnyNote and the value that was deposited into the contract
        commitments[_commitment].used = true;
        commitments[_commitment].creator = msg.sender;
        commitments[_commitment].createdDate = block.timestamp;
        commitments[_commitment].usesToken = false;
        commitments[_commitment].denomination = denomination;
        // Forward the fee to the owner
        Address.sendValue(_owner, fee);
        emit DepositETH(
            _commitment,
            msg.sender,
            block.timestamp,
            denomination,
            fee
        );
    }

    /**
   @dev : depositToken is for creating a bunnyNote by depositing tokens, the wallet calling this function must approve ERC20 spend first
   @param _commitment is the poseidon hash of the note
   @param denomination is the amount of token transferred to the contract that represents the note's value. Deposit does not contain the fee
   @param token is the ERC20 token that is used for this deposits  
    */
    function depositToken(
        bytes32 _commitment,
        uint256 denomination,
        address token
    ) external nonReentrant {
        require(!commitments[_commitment].used, "Used commitment");
        require(denomination > 0, "Invalid denomination");

        commitments[_commitment].used = true;
        commitments[_commitment].creator = msg.sender;
        commitments[_commitment].createdDate = block.timestamp;
        commitments[_commitment].usesToken = true;
        commitments[_commitment].denomination = denomination;
        commitments[_commitment].token = IERC20(token);
        uint256 fee = calculateFee(denomination);
        IERC20(token).safeTransferFrom(msg.sender, address(this), denomination);

        // The owner can set 1 token to be without fees!
        if (token != feelessToken) {
            // Send the owner the fee
            IERC20(token).safeTransferFrom(msg.sender, _owner, fee);
        }

        emit DepositToken(
            _commitment,
            msg.sender,
            block.timestamp,
            denomination,
            fee,
            token
        );
    }

    /**
     @dev calculate the fee used for the denomination
     @param denomination is the amount of value transferred to the cotnract to make a deposit and create a bunny note
   */
    function calculateFee(
        uint256 denomination
    ) public pure returns (uint256 fee) {
        fee = denomination.div(feeDivider);
    }

    /**
       @dev withdraw the value deposited to back the bunny note to withdraw the value
       @param _proof is the zkSnark generated on the clinet side
       @param _nullifierHash is the poseidon hash of the nullifier used for nullifying the note and verifying the secret
       @param _commitment is how the bunnyNote is identified, it's a poseidon hash generated client side from a secret + nullifier;
       @param _recipient is the address that will recieve the withdraw amount. 
       The recipient is incldued in the ZkSnark so a client could create the proof and give it to a third party relayer who could submit it in his behalf to abstract gas costs, but never alter the arguments due to the zkSnark so it is trustless
    */
    function withdraw(
        uint256[8] calldata _proof,
        bytes32 _nullifierHash,
        bytes32 _commitment,
        address _recipient
    ) external nonReentrant {
        require(
            !nullifierHashes[_nullifierHash],
            "The note has already been spent"
        );
        require(commitments[_commitment].used, "Unused Note!");
        require(
            verifier.verifyProof(
                [_proof[0], _proof[1]],
                [[_proof[2], _proof[3]], [_proof[4], _proof[5]]],
                [_proof[6], _proof[7]],
                [
                    uint256(_nullifierHash),
                    uint256(_commitment),
                    uint256(uint160(_recipient))
                ]
            ),
            "Invalid Withdraw proof"
        );
        // Nullify the BunnyNote, invalidating it
        nullifierHashes[_nullifierHash] = true;
        commitments[_commitment].recipient = _recipient;
        commitments[_commitment].spentDate = block.timestamp;

        // Process the withdraw
        if (commitments[_commitment].usesToken) {
            //Transfer the token
            commitments[_commitment].token.safeTransfer(
                _recipient,
                commitments[_commitment].denomination
            );
        } else {
            //Transfer the eth
            Address.sendValue(
                payable(_recipient),
                commitments[_commitment].denomination
            );
        }

        emit WithdrawBunnyNote(
            commitments[_commitment].creator,
            _recipient,
            _commitment
        );
    }

    /** @dev whether a BunnyNote is already spent
        @param _nullifierHash is used to check if a note has been spent
     */

    function isSpent(bytes32 _nullifierHash) public view returns (bool) {
        return nullifierHashes[_nullifierHash];
    }
}
