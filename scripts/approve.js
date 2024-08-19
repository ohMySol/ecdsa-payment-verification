const { network } = require("hardhat")
const { getContractInstance } = require("../utils/helpers/helper-hardhat")

const approve = async() => {
    const bonusContract = await getContractInstance(network.name, 'BonusPayment')
    const tokenContract = await getContractInstance(network.name, 'PaymentToken')
    const approvalAmount = await tokenContract.totalSupply()
    await tokenContract.setApproval(approvalAmount, bonusContract.target)
    const allowance = await tokenContract.allowance(tokenContract.target, bonusContract.target)
    
    console.log(`\nAllowance ${allowance} successfully set from ${tokenContract.target} to ${bonusContract.target}`)
}

approve().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});