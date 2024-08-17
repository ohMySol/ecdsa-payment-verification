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

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/)

## Setting Up The Project
### 1. Clone/Download the Repository.
`https://github.com/ohMySol/ecdsa-payment-verification.git`

### 2. Install Dependencies.
`$ npm install`

### 3. Set up .env and .env.enc files.
1. Make sure all the **.env** and **.env.enc** variables are set correctly. For more info about variables check the **.env.example** and **.env.enc.example** files.
Also, here is a guide, how to install env-enc and how to use it: [env-enc-guide](https://github.com/smartcontractkit/env-enc)