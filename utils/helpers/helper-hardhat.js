const { ethers, JsonRpcProvider } = require("ethers");
require("@chainlink/env-enc").config();
require("dotenv").config()
const {bonusPaymentAbi} = require("../abi/BonusPayment")

// For local testing
const devNetworks = ["localhost", "hardhat"]

// For creating contracts instances
const networkConfig = {
    hardhat: {
        blockConfirmations: 1,
        provider: () => new JsonRpcProvider("http://127.0.0.1:8545"),
        signer: () => new ethers.Wallet(
                networkConfig.hardhat.privateKey, 
                networkConfig.hardhat.provider()
        ),
        privateKey: process.env.PRIVATE_KEY_LOCAL,
        contractAddress: process.env.BONUS_PAYMENT_LOCAL_ADDRESS,
        tokenAddress: process.env.TOKEN_LOCAL_ADDRESS,
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
        contractAddress: process.env.BONUS_PAYMENT_SEPOLIA_ADDRESS,
        tokenAddress: process.env.TOKEN_SEPOLIA_ADDRESS,
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

getContractInstance = async(networkName) => {
    const config = await getNetworkConfig(networkName)
    const abi = bonusPaymentAbi

    const contract = new ethers.Contract(config.contractAddress, abi, config.signer())
    return contract 
}


module.exports = {
    devNetworks,
    networkConfig,
    getNetworkConfig,
    getContractInstance
}