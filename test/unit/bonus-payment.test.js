const { expect } = require("chai")
const { ethers, deployments, network } = require("hardhat");
const { devNetworks } = require("../../utils/helpers/helper-hardhat")

!devNetworks.includes(network.name)
? describe.skip
:describe("BonusPayment contract tests", function() {
    let Contract, contract, user1, user2, deployer
    
    beforeEach("Set up a contract for testing", async () => {
        [ deployer, user1, user2 ] = await ethers.getSigners()

        //deploy contract for tests
        await deployments.fixture(["all"]) // take a deploy script with "carnft" tag and deploy it
        Contract = (await deployments.get("BonusPayment")).address; //receive a deployed contract information(means address, ABI, bytecode ...)
        console.log(Contract)
        contract = await ethers.getContractAt("BonusPayment", Contract) //receive a contract instance
        console.log(contract)
    })

    describe("Withdraw function test", () => {
        it("Verify withdraw function returns true", async () => {
            const success = await contract.withdraw()
            expect(success).to.equal(false)
        })
    
    })

})