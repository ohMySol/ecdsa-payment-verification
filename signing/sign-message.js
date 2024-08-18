require("@chainlink/env-enc").config();
require("dotenv").config()
const {getNetworkConfig, getContractInstance, writeSignature, getSigner} = require('../utils/helpers/helper-hardhat');
const {getEip712Message} = require('./data-to-sign')

async function sign(amount, networkName) {    
    console.log(`\nSigning message in ${networkName} network...\n`)
    
    const config = await getNetworkConfig(networkName)
    const contract = await getContractInstance(networkName, "BonusPayment")
    const nonce = await contract.getNonce();
    const signer = await getSigner(networkName)

    if (isNaN(amount) || amount <= 0) {
        throw new Error("Please provide a valid positive bonus amount parameter.");
    }

    const eip712Message = await getEip712Message(
        config.chainId, 
        config.contracts['BonusPayment'], 
        amount, 
        nonce
    )

    const domain = eip712Message['domain']
    const message = eip712Message['message']
    const types = {
        [eip712Message["primaryType"]]: eip712Message['types'][eip712Message["primaryType"]]
    }

    // Signing message
    const signature = await signer.signTypedData(domain, types, message);
    
    console.log("Message is signed!\n")

    // Split signature into r,s,v parts and log them
    const r = signature.slice(0, 66); 
    const s = "0x" + signature.slice(66, 130); 
    const v = parseInt(signature.slice(130, 132), 16);
    
    await writeSignature(v, r, s, amount)
    return {v,r,s}
}

/* sign().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); */

module.exports = {
    sign
}