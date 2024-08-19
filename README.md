❗️Never push your .env file with private data to remote repository. I accidentially did this, but for private data I am using .env.enc file which ecrypts all the data inside with your password. So here is the 
live example how u shouldn't do, even if you are using encrypted file with your env variables.

# ECDSA Payment Verification
Let's assume that employees in the company can sign a message with their available bonus amount, and then after cryptographic verification of their message in smart contract, they receive their bonus in tokens from token contract on their balance. How can this be implemented?
The project showcased the usage of ECDSA signature in message signing on the server side, and then verification of this signature on-chain in smart contract with the help of signature components(v, r, s).

## How the logic works?
1. User signs a message off-chain on the server side with his bonus amount and nonce(automatically picked up nonce by the user from the contract).
2. After this he should call a function in the contract(in my case 'claimBonus' func) with the provided 'bonus amount' and 'v', 'r', 's' values in function arguments(in 'claim-bonus' script, v, r, s values are picked up automatically after signing. So users need to provide just an amount).
Once the user calls the 'claimBonus' function in the contract, it will verify if the current 'msg.sender' is == to the original message signer recovered from the signature. If addresses match, then the user balance is updated for a specified amount.
3. After a successful claim, the user is able to call a 'withdraw' function. It will transfer a token amount == to user balance to the user address. Finish.

## Technology Stack & Tools

- Solidity (Writing Smart Contracts)
- Javascript (Testing/Scripting)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ethers.js](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [Mocha](https://www.npmjs.com/package/mocha) (Testing Framework)
- [env-enc](https://github.com/smartcontractkit/env-enc) (Encrypted storage of private data)
- [Express.js](https://expressjs.com)(Backend server)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/)

## Setting Up The Project
### 1. Clone/Download the Repository.
`https://github.com/ohMySol/ecdsa-payment-verification.git`

### 2. Install Dependencies.
`npm install`

### 3. Set up .env and .env.enc files.
1. Make sure all the **.env** and **.env.enc** variables are set correctly. For more info about variables check the **.env.example** and **.env.enc.example** files.
Also, here is a guide, how to install env-enc and how to use it: [env-enc-guide](https://github.com/smartcontractkit/env-enc)

## Running The Project(localhost)
### 1. Start a localhost node(If u will sign a message locally)
1.1 Run command `npm run node`. This command will spin up a new isolated hardhat network(localhost).

### 2. Start backend server
2.1. Run command `npm run dev`. This will create a new express server on port 3030(hardcoded in app.js).
Inside app.js I am importing a sign route with the signing endpoint logic.

### 3. Run the mint script with desired amount of tokens.
3.1 Run command `npm run mint <network name>`. This will run a **mint.js** script. Inside this script, the ERC20 mint function will be triggered and 1000(hardcoded value, change if needed) will be minted to the ERC20 token address.\
3.2 So ERC20 contract is the owner of the minted tokens(this logic can be changed in PaymentToke.sol if you need).\
3.3 After a successfull minting you should see a message in the console 'Successfully mint: 'amount' for 'PaymentToken address>'

### 4. Run the approve script with desired amount of tokens for approve.
4.1 Run command `npm run approve <network name>`. This will run an **approve.js** script.\ 
4.2 Allowance is set in my implementation from token owner(PaymentToken contract) to spender(BonusPayment contract). This means that you allocate some amount of tokens for BonusPayment contract, and BonusPayment will be able to pay bonuses to users from this amount. Feel free to change the allowed amount for your own(but don't forget how much you minted before). Also feel free to change the allowance logic.\
4.3 After this command, BonusPayment token will be able to spend bonus tokens to pay users their bonuses. Don't be afraid user won't be able to spend more that he received after claiming, because contract state is updated correctly.

### 5. Sign a message
5.1 To sign a message you should follow to this url **http://localhost:3030/sign/message/<amount>/<network>**,
and paste there 2 parameters: **amount** - amount of tokens(only number value, couldn't be 0 or less), and **<network>** - network name where you are signing a message(localhost, sepolia...).\
5.2 Once message was signed, endpoint will return you a signature parts(v, r, s) in json object. So that you can grab them and use when calling a **claimBonus** function in smart contract to receive your bonus.
❗️Message will be signed with the help of the signer object created in the beginning of the **sign-message.js** script. Signer will be created using the private key provided for each specific network in the **helper-hardhat.js** in networkConfig object. 
When you signing a message on the backend --> signer and contract instance are created with the 'networkConfig' help based on the network you are signing. Yes sounds not easy, but you need to check the code to understand. This allow me to dynamically create a contract instance and a signer, based in which network the message is signed.

### 6.  Run the claim-bonus script to receive amount on your balance.
6.1 Run command `npm run claim <network name>`. This will run a **claim-bonus.js** script. You may remember that this function require 'v, r, s' parameters for claiming, so after signing a message a 'v, r, s' parameters are saved to signatures.json file. And when you will call a claim-bonus scripts, it will fetch parameters automatically.\
6.2 Signature can be used only once, because after every successfull claim, nonce for the caller will be updated. So that I prevented a signature replay attack. Also if recovered signer is not an actual function caller - then you won't be able to receive a bonus, assuming this is not your bonus.\
6.3 After a successfull function execution, your balance for withdrawing will be updated with claimed amount.

### 7.  Run a withdraw script to transfer tokens on your balance.
7.1 Run command `npm run withdraw <network name>`. This will run a **withdraw.js** script.\
7.2 In the console you will see that your token balance is updated with the amount of tokens you withdraw, and balance in BonusPayment contract will be updated to 0.
7.3 Finish!


