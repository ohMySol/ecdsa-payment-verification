const { network } = require("hardhat")
const { getContractInstance } = require("../utils/helpers/helper-hardhat")

const mint = async() => {
    const contract = await getContractInstance(network.name, 'PaymentToken')
    const mintAmount = 1000 // Set up your mint amount
    await contract.mint(mintAmount)
    const balance = await contract.balanceOf(contract.target)
  
    console.log(`\nSuccessfully mint: ${balance} for ${contract.target}`);
}

mint().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});