# NEXUS GATE

- [x] [Concept & design](https://www.figma.com/file/IRfl6Cu2ZHBUDMtQ24UUPo/NexuSgate?node-id=306%3A374&t=vS02wnUjE6Opj3nD-1
) 
- [ ] Build frontend
- [x] Build backend
- [x] Build smart contracts
- [x] Deploy smart contracts to Testnet
- [x] Test user flow and transactions in localhost
- [x] Record demo video


## Details

NexusGate is an innovative platform designed to tokenize esports teams, empowering players, teams, and fans alike through, ownership, and new funding opportunities. The platform aims to revolutionize the esports industry by leveraging blockchain technology and eliminating the barriers of it. This can enhance transparency and trust, democratize decision-making, create new revenue streams, and enhance strategic partnerships.

## How It Works
[Concept Design ](https://www.figma.com/file/IRfl6Cu2ZHBUDMtQ24UUPo/NexuSgate?node-id=306%3A374&t=vS02wnUjE6Opj3nD-1
) 
- Step 1: Sign In With Your Social Account (Track: Gelato+Web3Auth)
- Step 2: Choose your chain of your team will live (upper left)
- Step 3: Enter
- Step 4: CLick Create a Team (left side) 
- Step 5: Add team details and invite members 
- Step 6: Deploy team safe under profile tab (safe)
- Step 7: Deploy your token (token deploy)
- *** Pending Steps
- Step 8: Distribute tokens
- Step 9: Add remove members


 | Gnosis Chain | ------ Deployments ------ |
 | --------------------------------------------- | ------------------------------------------------------------------ |
 | [Deployer Contract](https://gnosisscan.io/tx/0x66e94d6e7fe65adda8dfd4c6ea80925492920d55d7c242026b35911f6a24b5aa) | 0xcceb2cb52b27fdec6211b705cdb33345c3452143

 | Gorli Base | ------ Deployments ------ |
 | --------------------------------------------- | ------------------------------------------------------------------ |
 | [Deployer Contract](https://goerli.basescan.org/address/0xFefDadb1c553a2d19ED43F6Aab0C7251470db1BA) | 0xFefDadb1c553a2d19ED43F6Aab0C7251470db1BA |

  | Mumbai | ------ Deployments ------ |
 | --------------------------------------------- | ------------------------------------------------------------------ |
 | [Deployer Contract](https://mumbai.polygonscan.com/tx/0x355cafc5815fb6cf4b33b7fd35b32d06086154af3e7a7a101c33dd24c645ba30) | 0x9228C7d6240D02EFBa841B84Ec667bfDc9E2EfDD |


## Technologies

This project is built with the following open source libraries, frameworks and languages. User choice of framework used, available in plain js or typescript.
| Tech | Description |
| --------------------------------------------- | ------------------------------------------------------------------ |
| ------ | ------ Frontend Environment ------ |
| [React](https://react.dev/) | React Framework |
| ------ | ------ CSS Framework ------ |
| [Tailwind](https://tailwindcss.com/) | A utility-first CSS framework |
| ------ | ------ Ethereum Development Environment ------ |
| [Hardhat](https://hardhat.org/) | Ethereum development environment for professionals |
| ------ | ------ BlockChains ------ |
| [Base Testnet](https://bridge.base.org/) |Coinbase Test net |
| [Gnosis Chain](https://www.gnosis.io/) | Gnosis Chain is one of the first Ethereum sidechains and has stayed true to its values. |
| [Mambai](https://mumbai.polygonscan.com/) | Polygon Testnet
| ------ | ------ Included Libraries ------ |
| [Safe Core SDK for AA](https://docs.safe.global/learn/safe-core/safe-core-account-abstraction-sdk) |The Safe{Core} Account abstraction SDK allows builders to add account abstraction functionality into their apps.|
| [Gelato Gas Relayers](https://docs.gelato.network/developer-services/relay) | Enabling developers to get transactions validated fast, reliably and securely. |
| [Gelato Gasless Wallet](https://docs.gelato.network/developer-services/gasless-wallet) | Gasless Wallet allows externally owned accounts (EOAs) to deploy their own smart contract wallet
| [Gasless Onboarding](https://docs.gelato.network/developer-services/gasless-wallet/gasless-onboarding) | Gasless Onboardin gives developers the ability to onboard their users via social logins such as Google, Facebook, Discord, etc.


## To Work on

- Add final functionality to distribute tokens
- Add functionality to add or remove team members
- Add vesting functionality for token vesting for members
- Add UI images and designs

# 

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.


## Environment Variables
```
REACT_APP_SPONSOR_API_KEY=
REACT_APP_SPONSOR_API_KEY_MAINNET=
REACT_APP_GNOSIS_RPC_URL=
REACT_APP_MUMBAI_RPC_URL=
REACT_APP_BASEGOERLI_RPC_URL=
```
