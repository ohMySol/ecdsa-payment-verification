const types = {
    EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" }
    ],
    Bonus: [
        { name: "bonusAmount", type: "uint256" },
        { name: "nonce", type: "uint256" }
    ]
}

// Construct an EIP-712 type message
const getEip712Message = async(chainId, contractAddress, amount, nonce) => { 
    const eip712Message = {
        "domain": {
            "name": "BonusPayment",
            "version": "1",
            "chainId": chainId,
            "verifyingContract": contractAddress
        },
        "message": {
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
const getDomainNameVersion = async() => {
    const domain = {
        name: "BonusPayment",
        version: "1"
    }
    return domain
}

const getMessageData = async(amount, nonce) => {
    const message = {
        bonusAmount: amount,
        nonce: nonce
    }
    return message
}


module.exports = {
    types,
    getDomainNameVersion,
    getMessageData,
    getEip712Message
}