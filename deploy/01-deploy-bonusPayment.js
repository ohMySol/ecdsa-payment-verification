const { network } = require("hardhat")
const { devNetworks, networkConfig } = require("../utils/helpers/helper-hardhat")
const { verify, tenderlyVerify } = require("../utils/contract-verification/verify")

module.exports = async({deployments, getNamedAccounts}) => {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    const contractName = "BonusPayment"

    log(`\n============ Deploying BonusPayment contract to ${network.name} network ============\n`)
        
    const contract = await deploy(contractName, {
        from: deployer,
        log: true,
        args: [],
        blockConfirmations: devNetworks.includes(network.name)
        ? networkConfig.hardhat.blockConfirmations
        : networkConfig.sepolia.blockConfirmations
    })

    log(`\n============ Contract deployed to: ${contract.address}  ============\n`)

    if (!devNetworks.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        network.name == "sepolia"
        ? await verify(contract.address, contract.args)
        : await tenderlyVerify(contractName, contract.address)
    } else {
        log(`You are on the hardhat network, no verification required!\n`)
    }
    
}

module.exports.tags = ["payment", "all"]