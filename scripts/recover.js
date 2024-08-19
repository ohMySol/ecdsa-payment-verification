const { network } = require("hardhat")
const { getContractInstance, readSignature} = require("../utils/helpers/helper-hardhat")

const recover = async() => {
    const contract = await getContractInstance(network.name, 'BonusPayment')
    const {v, r, s, amount} = await readSignature()
    
    const recoveredSigner = await contract.recoverSigner(v, r, s, amount)
    
    //showing current awailable user balance for withdraw
    console.log(`\nSigner address recovered from signature: ${recoveredSigner}`); 
}

recover().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});