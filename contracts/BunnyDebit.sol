// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// This contract is basicly a reusable bunny note that has direct debit functionality
// The user can create a ZKP that contains the parameters of the payee who has access to the direct debit with it!

// The datar elated to the notes are stored in this struct
struct AccountData {
    bool used;
    address creator;
    uint256 createdDate;
    bool usesToken;
    IERC20 token;
    uint256 balance;
}

/*
  The nullifier is the debit history,
  it tracks withdrawalCount and the lastDate the proof was used for withdrawing value
*/
struct DebitHistory {
    bool isNullified;
    uint256 withdrawalCount;
    uint256 lastDate;
}

// The interface of the Verifier contract generated from the circuit
interface IVerifier {
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[6] memory _input
    ) external returns (bool);
}

/*
  bunnyDebit is inspired by the CashNote functionality implemented from the MVP, it works like single use virtual credit cards
  The commitments are deposits that can be topped up, while custom proofs can be given to payees who can direct debit from the account 
*/
contract BunnyDebit is ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    event DepositETH(
        bytes32 indexed commitment,
        address depositFor,
        uint256 timestamp,
        uint256 balance
    );
    event TopUpETH(
        bytes32 indexed commitment,
        uint256 timestamp,
        uint256 balance
    );

    event DepositToken(
        bytes32 indexed commitment,
        address depositFor,
        uint256 timestamp,
        uint256 amount,
        address token
    );
    event TopUpToken(
        bytes32 indexed commitment,
        uint256 timestamp,
        uint256 amount,
        address token
    );

    event DirectDebit(
        bytes32 indexed commitment,
        bytes32 nullifierHash,
        address payee,
        uint256 debitAmount,
        uint256 debitTimesLeft,
        uint256 feePaid
    );

    event CancelDirectDebit(
        bytes32 indexed commitment,
        bytes32 nullifierHash,
        address payee
    );

    event BunnyDebitCancelled(
        bytes32 indexed commitment,
        address tokenAddress,
        uint256 withdrawn
    );

    IVerifier public immutable verifier; // The verifier address

    address payable public _owner; // The owner of the contract that can update the feeless token's address

    address public feelessToken; // The owner can specify one token that has no fees!

    uint256 public constant feeDivider = 100; // 1% fee will be used. This is the amount to divide the denomination to calculate the fee

    /* Nuffifier Hashes are keys to how many times the debiting occured!
     Each payee has a unique nullifier hash thanks to the salt added to the nullifier
     The mapping tracks how many times they have withdrawn value from the account and will nullify future withdrawals after a point
     */
    mapping(bytes32 => DebitHistory) public nullifiers;

    /*
       Commitments are keys to Account data
    */
    mapping(bytes32 => AccountData) public commitments;

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
     @dev calculate the fee used for the denomination
     @param denomination is the amount of value transferred to the cotnract to make a deposit and create a bunny note
   */
    function calculateFee(
        uint256 denomination
    ) public pure returns (uint256 fee) {
        fee = denomination.div(feeDivider);
    }

    /**
      @dev : Create a BunnyNote by depositing ETH
      @param _commitment is the poseidon hash created for the note on client side
      @param balance that is the value of the note. 
    */

    function depositEth(
        bytes32 _commitment,
        uint256 balance
    ) external payable nonReentrant {
        require(!commitments[_commitment].used, "Used commitment");
        // When cancelling a commitment and withdrawing, commitments.used will be set to false, but the creator address won't be zero!
        require(commitments[_commitment].creator != address(0), "Not created");
        require(balance > 0, "Invalid balance");

        // Record the BunnyNote and the value that was deposited into the contract
        commitments[_commitment].used = true;
        commitments[_commitment].creator = msg.sender;
        commitments[_commitment].createdDate = block.timestamp;
        commitments[_commitment].usesToken = false;
        commitments[_commitment].balance = balance;
        // Forward the fee to the owner
        emit DepositETH(_commitment, msg.sender, block.timestamp, balance);
    }

    /**
   @dev : depositToken is for creating a bunnyNote by depositing tokens, the wallet calling this function must approve ERC20 spend first
   @param _commitment is the poseidon hash of the note
   @param balance is the amount of token transferred to the contract that represents the note's value. balance does not contain the fee
   @param token is the ERC20 token that is used for this deposits  
    */
    function depositToken(
        bytes32 _commitment,
        uint256 balance,
        address token
    ) external nonReentrant {
        require(!commitments[_commitment].used, "Used commitment");
        require(balance > 0, "Invalid balance");
        // When cancelling a commitment and withdrawing, used will be set back to false, but the creator address won't be zero!
        require(commitments[_commitment].creator != address(0), "Not created");
        commitments[_commitment].used = true;
        commitments[_commitment].creator = msg.sender;
        commitments[_commitment].createdDate = block.timestamp;
        commitments[_commitment].usesToken = true;
        commitments[_commitment].balance = balance;
        commitments[_commitment].token = IERC20(token);
        IERC20(token).safeTransferFrom(msg.sender, address(this), balance);

        emit DepositToken(
            _commitment,
            msg.sender,
            block.timestamp,
            balance,
            token
        );
    }

    function topUpETH(
        bytes32 _commitment,
        uint256 balance
    ) external payable nonReentrant {
        require(commitments[_commitment].used, "Must exist!");
        require(balance > 0, "Invalid balance");
        commitments[_commitment].balance = balance;
        emit TopUpETH(_commitment, block.timestamp, balance);
    }

    function topUpTokens(
        bytes32 _commitment,
        uint256 balance
    ) external nonReentrant {
        require(commitments[_commitment].used, "Must exist!");
        require(balance > 0, "Invalid balance");
        commitments[_commitment].balance = balance;
        IERC20(commitments[_commitment].token).safeTransferFrom(
            msg.sender,
            address(this),
            balance
        );

        emit TopUpToken(
            _commitment,
            block.timestamp,
            balance,
            address(commitments[_commitment].token)
        );
    }

    /*
      @Dev:
      A function that allows direct debit with a reusable proof, 
      N times to M address with L amount that can be withdrawn
      @param _proof contains the zkSnark
      @param hashes are [0] = nullifierHash [1] = commitment
      @param debit[3] are [0] = debit amount, [1] = debitTimes, [2] = debitInterval
    */
    function directdebit(
        uint256[8] calldata _proof,
        bytes32[2] calldata hashes,
        address payee,
        uint256[3] calldata debit
    ) external nonReentrant {
        require(!nullifiers[hashes[0]].isNullified, "Unavailable");
        require(
            nullifiers[hashes[0]].withdrawalCount < debit[1],
            "The allowed balance was already debitted"
        );
        require(commitments[hashes[1]].used, "Unused Note!");
        require(
            debit[0] < commitments[hashes[1]].balance,
            "Not enough balance"
        );
        require(
            verifier.verifyProof(
                [_proof[0], _proof[1]],
                [[_proof[2], _proof[3]], [_proof[4], _proof[5]]],
                [_proof[6], _proof[7]],
                [
                    uint256(hashes[0]),
                    uint256(hashes[1]),
                    uint256(uint160(payee)),
                    uint256(debit[0]),
                    uint256(debit[1]),
                    uint256(debit[2])
                ]
            ),
            "Invalid Withdraw proof"
        );
        require(
            nullifiers[hashes[0]].lastDate.add(debit[2]) < block.timestamp,
            "Too early"
        );
        // Calculate the fee
        uint256 fee = calculateFee(debit[0]);

        // Add a debit time to the nullifier
        nullifiers[hashes[0]].withdrawalCount += 1;
        nullifiers[hashes[0]].lastDate = block.timestamp;

        // Process the withdraw
        if (commitments[hashes[1]].usesToken) {
            // Transfer the token
            commitments[hashes[1]].token.safeTransfer(
                payable(payee),
                debit[0].sub(fee)
            );

            // The owner can set 1 token to be without fees!
            if (address(commitments[hashes[1]].token) != feelessToken) {
                // Send the owner the fee
                IERC20(commitments[hashes[1]].token).safeTransferFrom(
                    msg.sender,
                    _owner,
                    fee
                );
            }
        } else {
            // Transfer the eth
            Address.sendValue(payable(payee), debit[0].sub(fee));
            // Send the fee to the owner
            Address.sendValue(payable(_owner), fee);
        }

        // Emit how many debits are left with this proof
        emit DirectDebit(
            hashes[1],
            hashes[0],
            payee,
            debit[0],
            debit[1].sub(nullifiers[hashes[0]].withdrawalCount),
            fee
        );
    }

    /*
      Cancels all direct debit to the payee, used with proof. Must be called by commitment creator
      @param _proof contains the zkSnark
      @param hashes are [0] = nullifierHash [1] = commitment
      @param payee is the address that will get the payment
      @param debit[3] are [0] = debit amount, [1] = debitTimes, [2] = debitInterval
     */
    function cancel(
        uint256[8] calldata _proof,
        bytes32[2] calldata hashes,
        address payee,
        uint256[3] calldata debit
    ) external {
        require(commitments[hashes[1]].used, "Unused Note!");
        require(
            verifier.verifyProof(
                [_proof[0], _proof[1]],
                [[_proof[2], _proof[3]], [_proof[4], _proof[5]]],
                [_proof[6], _proof[7]],
                [
                    uint256(hashes[0]),
                    uint256(hashes[1]),
                    uint256(uint160(payee)),
                    uint256(debit[0]),
                    uint256(debit[1]),
                    uint256(debit[2])
                ]
            ),
            "Invalid Withdraw proof"
        );
        require(msg.sender == commitments[hashes[1]].creator, "Only creator");
        nullifiers[hashes[0]].isNullified = true;
        emit CancelDirectDebit(hashes[1], hashes[0], payee);
    }

    //
    // The commitment creator can withdraw the value deposited
    // Any proof will do that passes the verification as we only need to verify we know the secret behind the commitment
    // Can be called only by the commitment creator
    function withdraw(
        uint256[8] calldata _proof,
        bytes32[2] calldata hashes,
        address payee,
        uint256[3] calldata debit
    ) external nonReentrant {
        require(commitments[hashes[1]].used, "Unused Note!");
        require(
            verifier.verifyProof(
                [_proof[0], _proof[1]],
                [[_proof[2], _proof[3]], [_proof[4], _proof[5]]],
                [_proof[6], _proof[7]],
                [
                    uint256(hashes[0]),
                    uint256(hashes[1]),
                    uint256(uint160(payee)),
                    uint256(debit[0]),
                    uint256(debit[1]),
                    uint256(debit[2])
                ]
            ),
            "Invalid Withdraw proof"
        );
        require(msg.sender == commitments[hashes[1]].creator, "Only creator");
        commitments[hashes[1]].used = false;
        uint256 balance = commitments[hashes[1]].balance;

        if (commitments[hashes[1]].usesToken) {
            // Transfer all the token balance
            commitments[hashes[1]].token.safeTransfer(payable(payee), balance);
        } else {
            Address.sendValue(payable(payee), balance);
        }
        commitments[hashes[1]].balance = 0;
        emit BunnyDebitCancelled(
            hashes[1],
            address(commitments[hashes[1]].token),
            balance
        );
    }
}
