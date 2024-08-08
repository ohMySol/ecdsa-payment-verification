const {ethers} = require('ethers')

// Defined data structure for domain separator and msg
const types = { // Use object notation for types
    EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
        { name: "salt", type: "bytes32"}
    ],
    Bonus: [ // Corrected key name (from "bonus" to "Bonus") to match your signing script
        { name: "recipientAddress", type: "address" },
        { name: "bonusAmount", type: "uint256" },
        { name: "nonce", type: "uint256" }
    ]
}

// Construct an EIP-712 type message
const getEip712Message = async(chainId, contractAddress, salt, sender, amount, nonce) => { 
    const eip712Message = {
        "domain": {
            "name": "BonusPayment",
            "version": "1",
            "chainId": chainId,
            "verifyingContract": contractAddress,
            "salt": salt
        },
        "message": {
            "recipientAddress": sender,
            "bonusAmount": amount,
            "nonce": nonce
        },
        "primaryType": "Bonus",
        "types": {
            "EIP712Domain": types.EIP712Domain,
            "Bonus": types.Bonus
        } 
    }
    return eip712Message
}

// Defined data for for domain separator and msg
const getDomainData = async(chainId, contractAddress, salt) => {
    const domain = {
        name: "BonusPayment",
        version: "1",
        chainId: chainId,
        verifyingContract: contractAddress,
        salt: salt
    }
    return domain
}

const getMessageData = async(sender, amount, nonce) => {
    const message = {
        recipientAddress: sender,
        bonusAmount: amount,
        nonce: nonce
    }
    return message
}


module.exports = {
    types,
    getDomainData,
    getMessageData,
    getEip712Message
}