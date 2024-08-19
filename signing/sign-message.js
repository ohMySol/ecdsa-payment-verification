require("@chainlink/env-enc").config();
require("dotenv").config()
const {getNetworkConfig, getContractInstance, writeSignature, getSigner} = require('../utils/helpers/helper-hardhat');
const {getEip712Message} = require('./data-to-sign')

/* Function will sign a message with your tokens 'amount'. 'networkName' parameter
is needed for correct config usage from 'hardhat-helper.js' file. And privateKey is optional
if u need to sign a message with another account which is not exist in 'hardhat-helper.js' --> 
config object(I am using this option in tests and when u will sign a real message in the testnet,
it will pick up your privateKey from account in the testnet in the config)
*/
async function sign(amount, networkName, privateKey) {    
   try{ 
        console.log(`\nSigning message in ${networkName} network...\n`)
        
        const config = await getNetworkConfig(networkName)
        const contract = await getContractInstance(networkName, "BonusPayment")
        const nonce = await contract.getNonce();
        const signer = await getSigner(networkName, privateKey)

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
    } catch(error) {
        console.error(error)
    }
}

module.exports = {
    sign
}