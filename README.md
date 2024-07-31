# Oasis Demo Quiz dApp

A confidential quiz dApp exposing the RNG to generate a random order of
questions per coupon with the reward payout for the ones who solve it.
Runs on Oasis Sapphire.

- `backend` contains the solidity contract, deployment and testing utils.
- `frontend` contains a Vue-based web application communicating with the
  backend smart contract.

This monorepo is set up for `pnpm`. Install dependencies by running:

```sh
pnpm install
```

## Backend

Move to the `backend` folder and build smart contracts:

```sh
pnpm build
```

Next, deploy the contract.

### Basic Local Hardhat Deployment

Start the hardhat node:

```sh
npx hardhat node
```

Deploy smart contracts to that local network:

```sh
npx hardhat deploy --network localhost
```

The deployed Quiz and OasisReward addresses will be reported. Remember it and store it
inside the `frontend` folder's `.env.development`, for example:

```
VITE_QUIZ_ADDR=0x385cAE1F3afFC50097Ca33f639184f00856928Ff
VITE_NFT_ADDR=0x3C8D74Aa9b3390Af534351dB8dcF5A65FE7C9Dd2
```

### Deploying to Sapphire Localnet, Testnet and Mainnet

Prepare your hex-encoded private key and store it as an environment variable:

```shell
export PRIVATE_KEY=0x...
```

To deploy the contracts to the [Sapphire Localnet], Testnet or Mainnet, use the
following commands respectively:

```shell
npx hardhat deploy --network sapphire-localnet
npx hardhat deploy --network sapphire-testnet
npx hardhat deploy --network sapphire
```

[Sapphire Localnet]: https://github.com/oasisprotocol/oasis-web3-gateway/pkgs/container/sapphire-dev

### Once deployed

Checklist after deploying a production-ready quiz:

1. Push questions. Example:

   ```shell
   npx hardhat addQuestions 0x385cAE1F3afFC50097Ca33f639184f00856928Ff test-questions.json --network sapphire-testnet
   ```

2. Add coupons. Example:

   ```shell
    hardhat addCoupons 0x385cAE1F3afFC50097Ca33f639184f00856928Ff test-coupons.txt  --network sapphire-testnet
   ```

3. Set payout reward. Example:

   ```shell
   npx hardhat setReward 0x385cAE1F3afFC50097Ca33f639184f00856928Ff 2.0  --network sapphire-testnet
   ```

4. Set gasless kaypair. The current account nonce will be fetched and stored to
   the contract. Because of that, the provided account **must be used solely for
   gasless transactions by the deployed quiz contract**. Example:

   ```shell
   npx hardhat setGaslessKeyPair 0x385cAE1F3afFC50097Ca33f639184f00856928Ff 0xd8cA6E05FC1a466992D98f5f4FFC621ca95b7229 0xbf63c1e7982a80f424b5e8c355b7f11a0968bf44b1407c473aadb364b8c291d3  --network sapphire-testnet
   ```

5. Fund the contract and the gasless account. Example:
   
   ```shell
   npx hardhat fund 0x385cAE1F3afFC50097Ca33f639184f00856928Ff 100  --network sapphire-testnet # contract
   npx hardhat fund 0xd8cA6E05FC1a466992D98f5f4FFC621ca95b7229 10  --network sapphire-testnet # gasless account
   ```

6. Check the quiz contract status, to make sure if everything is set. Example:

   ```shell
   npx hardhat status 0x385cAE1F3afFC50097Ca33f639184f00856928Ff --network sapphire-testnet
   ```
   
   You can also obtain details on spent coupons as follows (may take a while):

   ```shell
   npx hardhat getCoupons 0x385cAE1F3afFC50097Ca33f639184f00856928Ff --network sapphire-testnet
   ```

### Deploy and setup quiz with a single task

You can also setup and run the entire quiz in a single task.

```shell
npx hardhat deployAndSetupQuiz --network sapphire-testnet
```   

The `deployAndSetupQuiz` task supports several optional parameters:

1. **`--questions-file`**: A file containing questions in JSON format. Default value is `test-questions.json`.
2. **`--coupons-file`**: A file containing coupons, one per line. Default value is `test-coupons.txt`.
3. **`--reward`**: The reward in ROSE. Default value is `2.0`.
4. **`--gasless-address`**: The payer address for gasless transactions.
5. **`--gasless-secret`**: The payer secret key for gasless transactions.
6. **`--fund-amount`**: The amount in ROSE to fund the contract. Default value is `100`.
7. **`--fund-gasless-amount`**: The amount in ROSE to fund the gasless account. Default value is `10`.
8. **`--contract-address`**: The contract address for status check.
   

Check out other hardhat tasks that will help you manage the quiz:

```shell
npx hardhat help
```
### A note on tests:

When running tests on sapphire-localnet

```shell
npx hardhat test --network sapphire-localnet
```

avoid setting $PRIVATE_KEY environment variable. It blocks reading default accounts from the docker localnet.


## Frontend

After you compiled the backend, updated `.env.development` with the
corresponding address and a chain ID, move to the `frontend` folder, compile
and Hot-Reload frontend for Development:

```sh
pnpm dev
```

Navigate to http://localhost:5173 with your browser to view your dApp. Some
browsers (e.g. Brave) may require https connection and a CA-signed certificate
to access the wallet. In this case, read the section below on how to properly
deploy your dApp.

You can use one of the deployed test accounts and associated private key with
MetaMask. If you use the same MetaMask accounts on fresh local networks such as
Hardhat Node, Foundry Anvil or sapphire-dev docker image, don't forget to
*clear your account's activity* each time or manually specify the correct
account nonce.

### Frontend Deployment

You can build assets for deployment by running:

```sh
pnpm build
```

`dist` folder will contain the generated HTML files that can be hosted.

#### Different Website Base

If you are running dApp on a non-root base dir, add

```
BASE_DIR=/my/public/path
```

to `.env.production` and bundle the app with

```
pnpm build-only --base=/my/public/path/
```

Then copy the `dist` folder to a place of your `/my/public/path` location.
