const { network } = require("hardhat")
const { devNetworks, getNetworkConfig} = require("../utils/helpers/helper-hardhat")
const { verify, tenderlyVerify } = require("../utils/contract-verification/verify")
const { getDomainNameVersion} = require("../signing/data-to-sign")

module.exports = async({deployments, getNamedAccounts}) => {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    const contractName = "BonusPayment"
    const networkName = network.name
    const config = await getNetworkConfig(networkName)
    const {name, version} = await getDomainNameVersion()

    log(`\n============ Deploying BonusPayment contract to ${networkName} network ============\n`)
        
    const contract = await deploy(contractName, {
        from: deployer,
        log: true,
        args: [config.tokenAddress, name, version],
        blockConfirmations: config.blockConfirmations
    })

    log(`\n============ Contract deployed to: ${contract.address}  ============\n`)

    if (!devNetworks.includes(networkName) && process.env.ETHERSCAN_API_KEY) {
        networkName == "sepolia"
        ? await verify(contract.address, contract.args)
        : await tenderlyVerify(contractName, contract.address)
    } else {
        log(`You are on the hardhat network, no verification required!\n`)
    }
    
}

module.exports.tags = ["payment", "all"]