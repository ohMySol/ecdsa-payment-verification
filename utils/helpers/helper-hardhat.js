const devNetworks = ["localhost", "hardhat"]
const networkConfig = {
    hardhat: {
        blockConfirmations: 1
    },
    sepolia: {
        blockConfirmations: 6
    }
}


module.exports = {
    devNetworks,
    networkConfig
}