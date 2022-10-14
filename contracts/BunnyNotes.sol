// SPDX-License-Identifire: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IVerifier {
    function verifyProof(bytes memory _proof, uint256[4] memory _input)
        external
        returns (bool);
}

struct CommitmentStore {
    bool used;
    address creator;
    address recipient;
    bool utxoNote;
    uint256 createdDate;
    uint256 spentDate;
}

abstract contract BunnyNotes is ReentrancyGuard {
    IVerifier public immutable verifier;
    uint256 public denomination;

    address payable public _owner;

    mapping(bytes32 => bool) public nullifierHashes;
    // We store all the commitments to make sure there are no accidental deposits twice
    mapping(bytes32 => CommitmentStore) public commitments;

    event Deposit(
        bytes32 indexed commitment,
        address depositedBy,
        uint256 timestamp
    );
    event WithdrawGiftCard(
        address from,
        address to,
        bytes32 nullifierHash,
        uint256 fee
    );

    event WithdrawCashNote(
        address from,
        address to,
        bytes32 nullifierHashes,
        uint256 price,
        uint256 fee,
        uint256 utxo
    );

    /**
        @dev : the constructor
        @param _verifier is the address of SNARK verifier contract
        @param _denomination transfer amount for each deposit
    */

    constructor(IVerifier _verifier, uint256 _denomination) {
        require(_denomination > 0, "Denomination should be greater than 0");
        verifier = _verifier;
        denomination = _denomination;
        _owner = payable(msg.sender);
    }

    function deposit(bytes32 _commitment, bool utxoNote)
        external
        payable
        nonReentrant
    {
        require(
            !commitments[_commitment].used,
            "The commitment has been submitted"
        );
        commitments[_commitment].used = true;
        commitments[_commitment].creator = msg.sender;
        commitments[_commitment].utxoNote = utxoNote;

        _processDeposit();

        emit Deposit(_commitment, msg.sender, block.timestamp);
    }

    /**
     @dev this function is defined in a child contract
    */

    function _processDeposit() internal virtual;

    function withdrawGiftCard(
        bytes calldata _proof,
        bytes32 _nullifierHash,
        bytes32 _commitment,
        address _recipient,
        uint256 _fee
    ) external nonReentrant {
        require(_fee <= denomination, "Fee exceeds transfer value");
        require(
            !nullifierHashes[_nullifierHash],
            "The giftcard has already been spent"
        );
        require(
            commitments[_commitment].utxoNote == false,
            "You can only withdraw gift cards."
        );

        require(
            verifier.verifyProof(
                _proof,
                [
                    uint256(_nullifierHash),
                    uint256(_commitment),
                    uint256(uint160(_recipient)),
                    uint256(_fee)
                ]
            ),
            "Invalid Withdraw proof"
        );

        nullifierHashes[_nullifierHash] = true;
        commitments[_commitment].recipient = msg.sender;
        _processWithdrawGiftCard(payable(_recipient), _fee);
    }

    function withdrawCashNote(
        bytes calldata _proof,
        bytes32 _nullifierHash,
        bytes32 _commitment,
        address _recipient,
        uint256 _price,
        uint256 _fee
    ) external payable {
        require(_fee <= denomination, "Fee exceeds transfer value");
        require(_price <= denomination, "Can't spend more than denomination");
        require(_fee + _price <= denomination, "Fee + Price is to high");
        require(
            !nullifierHashes[_nullifierHash],
            "The note has already been spent"
        );
        require(
            commitments[_commitment].utxoNote == true,
            "You can only spend utxo notes."
        );

        require(
            verifier.verifyProof(
                _proof,
                [
                    uint256(_nullifierHash),
                    uint256(_commitment),
                    uint256(uint160(_recipient)),
                    uint256(_fee)
                ]
            ),
            "Invalid Withdraw proof"
        );

        nullifierHashes[_nullifierHash] = true;
        commitments[_commitment].recipient = msg.sender;
        _processWithdrawCashNote(
            payable(_recipient),
            payable(commitments[_commitment].creator),
            _price,
            _fee
        );

        emit WithdrawCashNote(
            commitments[_commitment].creator,
            _recipient,
            _nullifierHash,
            _price,
            _fee,
            (denomination - _price) - _fee
        );
    }

    /** This is defined in a child contract */
    function _processWithdrawGiftCard(address payable _recipient, uint256 _fee)
        internal
        virtual;

    /** Process spending the UTXO note, this is defined in a child contract */
    function _processWithdrawCashNote(
        address payable _recipient,
        address payable _creator,
        uint256 _price,
        uint256 _fee
    ) internal virtual;

    /** @dev wether a giftcard is already spent */

    function isSpent(bytes32 _nullifierHash) public view returns (bool) {
        return nullifierHashes[_nullifierHash];
    }

    /** Whether an array of giftcards is already spent */
    function isSpentArray(bytes32[] calldata _nullifierHashes)
        external
        view
        returns (bool[] memory spent)
    {
        spent = new bool[](_nullifierHashes.length);
        for (uint256 i = 0; i < _nullifierHashes.length; i++) {
            if (isSpent(_nullifierHashes[i])) {
                spent[i] = true;
            }
        }
    }
}
