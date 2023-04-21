// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IVerifier {
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[3] memory _input
    ) external returns (bool);
}

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

    IVerifier public immutable verifier;

    address payable public _owner;

    uint256 public constant feeDivider = 100; // 1% fee will be used. This is the amount to divide the denomination to calculate the fee

    mapping(bytes32 => bool) public nullifierHashes;
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

    constructor(IVerifier _verifier) {
        verifier = _verifier;
        _owner = payable(msg.sender);
    }

    function depositEth(
        bytes32 _commitment,
        uint256 denomination
    ) external payable nonReentrant {
        require(!commitments[_commitment].used, "Used commitment");
        require(denomination > 0, "Invalid denomination");
        uint256 fee = calculateFee(denomination);
        require(msg.value == denomination + fee, "Invalid Value");

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
        // Send the owner the fee
        IERC20(token).safeTransferFrom(msg.sender, _owner, fee);

        emit DepositToken(
            _commitment,
            msg.sender,
            block.timestamp,
            denomination,
            fee,
            token
        );
    }

    function calculateFee(
        uint256 denomination
    ) public pure returns (uint256 fee) {
        fee = denomination.div(feeDivider);
    }

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

        nullifierHashes[_nullifierHash] = true;
        commitments[_commitment].recipient = _recipient;
        commitments[_commitment].spentDate = block.timestamp;

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

    /** @dev whether a BunnyNote is already spent */

    function isSpent(bytes32 _nullifierHash) public view returns (bool) {
        return nullifierHashes[_nullifierHash];
    }

    /** Whether an array of BunnyNotes is already spent */
    function isSpentArray(
        bytes32[] calldata _nullifierHashes
    ) external view returns (bool[] memory spent) {
        spent = new bool[](_nullifierHashes.length);
        for (uint256 i = 0; i < _nullifierHashes.length; i++) {
            if (isSpent(_nullifierHashes[i])) {
                spent[i] = true;
            }
        }
    }
}
