// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {BonusPaymentErrors} from "../contracts/interfaces/CustomErrors.sol";

contract BonusPayment is Pausable, Ownable, BonusPaymentErrors {
    constructor() Ownable(msg.sender) {
    }

    // Mapping to store a used nonces. Nonce will be each time new, once user claim hiw bonus.
    mapping (address => mapping (uint256  => bool)) public usedNonce;
    // Mapping to store user nonce
    mapping (address => uint256) public userNonce;
    mapping (address => uint256) public withdrawalBalances;

    function claimBonus(uint256 bonusAmount, uint8 v, bytes32 r, bytes32 s) external {
        if (usedNonce[msg.sender][getNonce()]) {
            revert BonusPayment_NonceAlreadyUsed(getNonce());
        }

        updNonce();
    }

    function withdraw() external {
    }

    /**
     * @dev Returns an availble uint256 value user for user 'nonce'
     */
    function getNonce() public view returns(uint256) {
        return userNonce[msg.sender]; 
    }

    function updNonce() public {
        userNonce[msg.sender] ++;
    }

    /**
     * @notice Contract owner can stop contract work.
     * 
     * @dev Stops the contract by setting '_paused' variable to 'true'
     * in 'Pausable' contract.
     */
    function stopContract() external onlyOwner() {
        _pause();
    }

    /**
     * @notice Contract owner can start contract work.
     * 
     * @dev Starts the contract by setting '_paused' variable to 'false'
     * in 'Pausable' contract.
     */
    function startContract() external onlyOwner() {
        _unpause();
    }
}