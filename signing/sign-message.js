require("@chainlink/env-enc").config();
require("dotenv").config()
const {ethers, network} = require('hardhat')
const {getNetworkConfig, getContractInstance} = require('../utils/helpers/helper-hardhat');
const {types, getDomainData, getMessageData, getEip712Message} = require('./data-to-sign')

async function sign() {
    const networkName =  network.name
    const config = await getNetworkConfig(networkName)
    
    console.log(`\nSigning message in ${networkName} network...\n`)
    // Create contract instance based on the network
    const contract = await getContractInstance(networkName)
    // Get nonce from the contract for specific user
    const nonce = await contract.getNonce();
    const signer = await config.signer()
    // Get domain + message data
    const eip712Message = await getEip712Message(
        config.chainId, 
        config.contractAddress, 
        config.salt,
        signer.address, 
        100, 
        nonce
    )
    const domain = eip712Message['domain']
    const message = eip712Message['message']
    const types = {
        [eip712Message["primaryType"]]: eip712Message['types'][eip712Message["primaryType"]]
    }

    // Signing message
    const signature = await signer.signTypedData(domain, types, message);
    //console.log(signature)
    
    // Split signature into r,s,v parts and log them
    const r = signature.slice(0, 66); 
    const s = "0x" + signature.slice(66, 130); 
    const v = parseInt(signature.slice(130, 132), 16);
    console.log('Signature:', signature);
    console.log('v:', v);
    console.log('r:', r);
    console.log('s:', s);

    /* // Verify the signature(just for test purpose)
    const recoveredAddress = ethers.verifyTypedData(domain, types, message, signature);
    console.log(signer.address == recoveredAddress) */

}

sign().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
