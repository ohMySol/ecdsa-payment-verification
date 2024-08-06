// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract BonusPayment is Pausable, Ownable {
    constructor() Ownable(msg.sender) {
        
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