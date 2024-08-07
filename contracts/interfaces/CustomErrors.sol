// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

interface BonusPaymentErrors {
    /** 
     * @dev Error indicates that the nonce was already used for bonus claiming.
     *  
     * @param nonce - random number used in msg signing to prevent replay attack.
    */
    error BonusPayment_NonceAlreadyUsed(uint256 nonce);
}