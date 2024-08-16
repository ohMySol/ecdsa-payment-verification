// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

interface BonusPaymentErrors {
    /** 
     * @dev Error indicates that the nonce was already used for bonus claiming.
     * @param nonce - random number used in msg signing to prevent replay attack.
    */
    error BonusPayment_NonceAlreadyUsed(uint256 nonce);

    /**
     * @dev Error indicates that a recovered signer is now equal to original signer.
     * @param recoveredSigner - address recovered from signature.
     * @param originalSigner - address which originally sign a message.
     */
    error BonusPayment_IncorrectSigner(address recoveredSigner, address originalSigner);

    /**
     * @dev Error indicates that user has not enough tokens on the balance for withdraw.
     * @param amount - current user balance.
     */
    error BonusPayment_InsufficientWithdrawBalance(uint256 amount);

    /**
     * @dev Error indicates that user doesn't provide address for a new token contract.
     */
    error BonusPayment_ZeroTokenAddress();

}