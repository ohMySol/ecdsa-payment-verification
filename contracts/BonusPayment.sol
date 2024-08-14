// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {BonusPaymentErrors} from "../contracts/interfaces/CustomErrors.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BonusPayment is Pausable, Ownable, BonusPaymentErrors, EIP712 {
    using ECDSA for bytes32;

    event BonusClaimed(
        address recipient,
        uint256 amount
    );

    event BonusPaid(
        address recipient,
        uint256 amount
    );
    
    
    struct Bonus {
        address recipientAddress;
        uint256 bonusAmount;
        uint256 nonce;
    }

    IERC20 public token;
    bytes32 constant BONUS_TYPEHASH = keccak256(abi.encodePacked(
        "Bonus(address recipientAddress,uint256 bonusAmount,uint256 nonce)"
    ));

    mapping (address => mapping (uint256  => bool)) public usedNonce;
    mapping (address => uint256) public nonces;
    mapping (address => uint256) public withdrawalBalance;

    modifier notUsedNonce(uint256 _nonce) {
        if (usedNonce[msg.sender][_nonce]) {
            revert BonusPayment_NonceAlreadyUsed(getNonce());
        }
        usedNonce[msg.sender][getNonce()] = true;
        _;
    }

    constructor(address _token, string memory _name, string memory _version) 
        Ownable(msg.sender) 
        EIP712(_name, _version)
    {
        token = IERC20(_token);
    }

    /**
     * @notice Contract owner can stop contract work.
     * @dev Stops the contract by setting '_paused' variable to 'true'
     * in 'Pausable' contract.
     */
    function stopContract() external onlyOwner() {
        _pause();
    }

    /**
     * @notice Contract owner can start contract work.
     * @dev Starts the contract by setting '_paused' variable to 'false'
     * in 'Pausable' contract.
     */
    function startContract() external onlyOwner() {
        _unpause();
    }

    /**
     * @notice After signing and sending a mesage off chain, user call this function to claim his bonus.
     * @dev User pasting '_v', '_r', '_s' parameters which are used to recover the original message signer.
     * @param _bonusAmount - amount of tokens user expected to claim.
     */
    function claimBonus(
        uint8 _v, 
        bytes32 _r, 
        bytes32 _s, 
        uint256 _bonusAmount
    ) 
        external
        whenNotPaused()
        notUsedNonce(getNonce()) 
    {
        address recipient = msg.sender;
        address signer = recoverSigner(_v, _r, _s, _bonusAmount, recipient);
        if (recipient != signer) {
            revert BonusPayment_IncorrectSigner(signer, recipient);
        }
        withdrawalBalance[recipient] += _bonusAmount;
        updNonce();
        emit BonusClaimed(recipient, _bonusAmount);
    }

    function withdraw() external whenNotPaused() {
        uint256 amount = withdrawalBalance[msg.sender];
        if (amount <= 0) {
            revert BonusPayment_InsufficientWithdrawBalance(amount);
        }
        withdrawalBalance[msg.sender] -= amount;
        token.transferFrom(address(token), msg.sender, amount);
        emit BonusPaid(msg.sender, amount);
    }

    /**
     * @dev Returns balance for withraw from 'withdrawalBalance' mapping,
     * for 'msg.sender'.
     */
    function getBalance() public view returns(uint256) {
        return withdrawalBalance[msg.sender];
    }

    /**
     * @notice Update the nonce for each user, to prevent Nonce Replay Attack. 
     * @dev Update uint256 value in 'nonces' mapping for 'msg.sender'.
     */
    function updNonce() public {
        nonces[msg.sender] ++;
    }

    /**
     * @dev Returns an availble uint256 value for 'msg.sender' from 'nonces' mapping.
     */
    function getNonce() public view returns(uint256) {
        return nonces[msg.sender]; 
    }

    /**
     * @dev Returns the domain separator(a struct defining the domain) for the current chain.
     */
    function getDomainSeparatorHash() public view returns(bytes32) {
        return _domainSeparatorV4();
    }

    /**
     * @dev Creates a hash of the structured 'Bonus' message.
     * @param _amount - amount of tokens user should receive.
     * @param _recipientAddress - address of the bonus requestor.
     */
    function getMessageHash(uint256 _amount, address _recipientAddress) public view returns(bytes32) {
        return keccak256(abi.encode(
            BONUS_TYPEHASH,
            _recipientAddress,
            _amount,
            getNonce()
        ));
    }
    
    /**
     * @dev Returns a final  validation hash, which is constructed from
     * concatination of 'x19'(initial 0x19 byte), 'x01'(version byte), 
     * 'getDomainSeparatorHash()' and  'getBonusHash()'.
     */
    function getDigestHash(uint256 _amount, address _recipientAddress) public view returns(bytes32) {
        return keccak256(abi.encodePacked(
            "\x19\x01",
            getDomainSeparatorHash(),
            getMessageHash(_amount, _recipientAddress)
        ));
    }

    /**
     * @notice Function return a recovered signer address from the signature. 
     * @dev Sender put his '_v', '_r', '_s' parameters calculated from the signature 
     * off-chain + '_amount'. In the end 'recover' function returns teh address of the 
     * person, who signed the message. 
     * @param _v - represents the index of the point on the elliptic curve used for the signature.
     * @param _r - integer in the range[1...n-1]. Represents the x-coordinate on the elliptic curve 
     * based on a random point R on the curve.
     * @param _s - integer in the range[1...n-1]. It's a proof that this user signs this message.
     * Inside it has a result of the math operation which includes user private key, msg hash and r value.
     */
    function recoverSigner(uint8 _v, bytes32 _r, bytes32 _s, uint256 _amount, address _recipientAddress) public view returns(address) {
        bytes32 digest = getDigestHash(_amount, _recipientAddress);
        return digest.recover(_v, _r, _s);
    }
}