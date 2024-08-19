const { network } = require("hardhat")
const { getContractInstance, readSignature} = require("../utils/helpers/helper-hardhat")

const claim = async() => {
    const contract = await getContractInstance(network.name, 'BonusPayment')
    const {v, r, s, amount} = await readSignature()
    
    await contract.claimBonus(v, r, s, amount)
    const balance = await contract.getBalance()
    //showing current awailable user balance for withdraw
    console.log(`\nSuccessfully claim bonus, your balance now is: ${balance}`); 
}

claim().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});