const { ethers, JsonRpcProvider } = require("ethers");
require("@chainlink/env-enc").config();
require("dotenv").config()
const fsp = require('fs/promises');

/*
1. This is the file with the helper configs and helper functions
which you can use across your scripts in order to write less code.
All this code is incapsulated in this module will help you dynamically
deploy, write to contract, read from the contract, create providers,
signers and contracts instances.
*/

// For local testing.
const devNetworks = ["localhost", "hardhat"]

// Config object with all necessary data to create:
// contract instance, create signer object, provider...
// So that you will dynamically create all the above points
// based on the network you are.
const networkConfig = {
    hardhat: {
        blockConfirmations: 1,
        provider: () => new JsonRpcProvider(),
        signer: (privateKey) => { //provide your own private key
            if (!privateKey) {
                privateKey = networkConfig.hardhat.privateKey; // if no private key provided -> use default one
            }
            return new ethers.Wallet(privateKey, networkConfig.hardhat.provider()
        )},
        privateKey: process.env.PRIVATE_KEY_LOCAL,
        contracts: {
            BonusPayment: process.env.BONUS_PAYMENT_LOCAL_ADDRESS,
            PaymentToken: process.env.TOKEN_LOCAL_ADDRESS
        },
        chainId: 31337
    },
    localhost: {
        blockConfirmations: 1,
        provider: () => new JsonRpcProvider("http://127.0.0.1:8545"),
        signer: (privateKey) => {
            if (!privateKey) {
                privateKey = networkConfig.localhost.privateKey;
            }
            return new ethers.Wallet(privateKey, networkConfig.localhost.provider()
        )},
        privateKey: process.env.PRIVATE_KEY_LOCAL,
        contracts: {
            BonusPayment: process.env.BONUS_PAYMENT_LOCAL_ADDRESS,
            PaymentToken: process.env.TOKEN_LOCAL_ADDRESS
        },
        chainId: 31337
    },
    sepolia: {
        blockConfirmations: 6,
        provider: () => new JsonRpcProvider(
            `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
        ),
        signer: (privateKey) => {
            if (!privateKey) {
                privateKey = networkConfig.sepolia.privateKey;
            }
            return new ethers.Wallet(privateKey, networkConfig.sepolia.provider()
        )},
        privateKey: process.env.PRIVATE_KEY,
        contracts: {
            BonusPayment: process.env.BONUS_PAYMENT_SEPOLIA_ADDRESS,
            PaymentToken: process.env.TOKEN_SEPOLIA_ADDRESS
        },
        chainId: 11155111
    }
}

// Returns the config object for specific 'networkName'.
const getNetworkConfig = async(networkName) => {
    const config = networkConfig[networkName]
    if (!config) {
        throw Error(`Unsupported network: ${networkName}`)
    }
    return config
}

// Returns a 'contractName' instance on the specific 'networkName'.
getContractInstance = async(networkName, contractName) => {
    const config = await getNetworkConfig(networkName)
    const data = JSON.parse(await fsp.readFile(`./artifacts/contracts/${contractName}.sol/${contractName}.json`, "utf8"))
    const abi = data.abi
    const contractAddress = config.contracts[contractName]

    if (!contractAddress) {
        throw Error(`Unsupported contract address: ${contractAddress}`)
    }
    const contract = new ethers.Contract(contractAddress, abi, config.signer())
    return contract 
}

getSigner = async(networkName, privateKey) => {
    const config = await getNetworkConfig(networkName)
    return config.signer(privateKey)
}

// Write created signature parts(v,r,s) to the signatures.json file.
writeSignature = async(v, r, s, amount) => {
    const signatureData = {
        v: v,
        r: r,
        s: s,
        amount: amount
    }
    await fsp.writeFile('./signing/signatures.json', JSON.stringify(signatureData))
}

readSignature = async() => {
   const {v, r, s, amount} = JSON.parse(await fsp.readFile('./signing/signatures.json', 'utf8'))
   return {v, r, s, amount}
}


module.exports = {
    devNetworks,
    networkConfig,
    getNetworkConfig,
    getContractInstance,
    writeSignature,
    readSignature,
    getSigner
}