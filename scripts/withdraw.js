const { network } = require("hardhat")
const { getContractInstance } = require("../utils/helpers/helper-hardhat")

const withdraw = async() => {
    const bonusContract = await getContractInstance(network.name, 'BonusPayment')
    const tokenContract = await getContractInstance(network.name, 'PaymentToken')
    
    const balanceBeforeWithdraw = await bonusContract.getBalance()
    const beforeWithdraw = await tokenContract.balanceOf("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266")// hardcoded argument to hardhat 1st account
    await bonusContract.withdraw()
    const balanceAfterWithdraw = await bonusContract.getBalance()
    const afterWithdraw = await tokenContract.balanceOf("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266")// hardcoded argument to hardhat 1st account

    console.log("\nUser allowed withdraw balance: " + balanceBeforeWithdraw);
    console.log("User token balance before witdraw: " + beforeWithdraw);
    console.log("User token balance after witdraw: " + afterWithdraw); 
    console.log("User allowed withdraw balance: " + balanceAfterWithdraw);
}

withdraw().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});