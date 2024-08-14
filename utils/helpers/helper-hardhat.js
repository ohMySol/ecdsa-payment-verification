const { ethers, JsonRpcProvider } = require("ethers");
require("@chainlink/env-enc").config();
require("dotenv").config()
const fs = require('fs')

// For local testing
const devNetworks = ["localhost", "hardhat"]

// For creating contracts instances
const networkConfig = {
    hardhat: {
        blockConfirmations: 1,
        provider: () => new JsonRpcProvider(),
        signer: () => new ethers.Wallet(
                networkConfig.hardhat.privateKey, 
                networkConfig.hardhat.provider()
        ),
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
        signer: () => new ethers.Wallet(
                networkConfig.localhost.privateKey, 
                networkConfig.localhost.provider()
        ),
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
        signer: () => new ethers.Wallet(
            networkConfig.sepolia.privateKey, 
            networkConfig.sepolia.provider()
        ),
        privateKey: process.env.PRIVATE_KEY,
        contracts: {
            BonusPayment: process.env.BONUS_PAYMENT_SEPOLIA_ADDRESS,
            PaymentToken: process.env.TOKEN_SEPOLIA_ADDRESS
        },
        chainId: 11155111
    }
}

const getNetworkConfig = async(networkName) => {
    const config = networkConfig[networkName]
    if (!config) {
        throw Error(`Unsupported network: ${networkName}`)
    }
    return config
}

getContractInstance = async(networkName, contractName) => {
    const config = await getNetworkConfig(networkName)
    const data = JSON.parse(fs.readFileSync(`./deployments/${networkName}/${contractName}.json`, "utf8"))
    const abi = data.abi
    const contractAddress = config.contracts[contractName]

    if (!contractAddress) {
        throw Error(`Unsupported contract address: ${contractAddress}`)
    }
    const contract = new ethers.Contract(contractAddress, abi, config.signer())
    return contract 
}


module.exports = {
    devNetworks,
    networkConfig,
    getNetworkConfig,
    getContractInstance
}