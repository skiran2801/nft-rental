# NFT Rental Platform

A decentralized application (dApp) that enables secure NFT rentals on the blockchain. This platform allows NFT owners to earn passive income by renting out their assets while providing renters with temporary access to exclusive NFTs.

## Features

- **NFT Listing**: List your NFTs for rent with customizable terms and pricing
- **Rental Marketplace**: Browse and search available NFTs for rent
- **Secure Transactions**: Smart contract-based rental agreements
- **User Dashboard**: Manage your listed and rented NFTs
- **Wallet Integration**: Seamless blockchain interaction with MetaMask support

## Project Screenshots

![NFT Rental Platform](assets/images/Screenshot 2025-04-21 at 1.27.14 AM.png)
![NFT Rental Platform](assets/images/Screenshot 2025-04-21 at 1.23.03 AM.png)
![NFT Rental Platform](assets/images/Screenshot 2025-04-21 at 1.12.23 AM.png)

## Tech Stack

- **Smart Contracts**: Solidity, Hardhat
- **Frontend**: React, Tailwind CSS
- **Blockchain**: Ethereum
- **Development**: Node.js, npm

## Project Structure

```
nft-rental/
├── contracts/                 # Smart contract source files
│   ├── NFT.sol               # ERC721 token implementation
│   ├── NFTRental.sol         # Main rental contract
│   ├── TestNFT.sol           # Test NFT implementation
│   └── interfaces/           # Contract interfaces
│
├── frontend/                 # React frontend application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API and blockchain services
│   │   ├── utils/          # Utility functions
│   │   └── contracts/      # Contract ABIs and addresses
│   │
│   ├── package.json
│   └── .env.development     # Frontend environment variables
│
├── scripts/                 # Deployment and utility scripts
│   ├── deploy.js           # Main deployment script
│   └── deploy-test.js      # Test deployment script
│
├── test/                   # Smart contract tests
├── hardhat.config.js       # Hardhat configuration
├── package.json           # Project dependencies
└── .env                   # Environment variables
```

## Prerequisites

- Node.js (v14 or higher)
- MetaMask wallet
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/nft-rental.git
cd nft-rental
```

2. Install dependencies:
```bash
npm install
cd frontend
npm install
```

3. Set up environment variables:
- Create a `.env` file in the root directory
- Create a `.env.development` file in the frontend directory
- Add your configuration variables (see `.env.example`)

## Development

1. Start the local Hardhat network:
```bash
npx hardhat node
```

2. Deploy smart contracts:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

3. Start the frontend development server:
```bash
cd frontend
npm start
```

## Testing

Run the test suite:
```bash
npx hardhat test
```

For gas reporting:
```bash
REPORT_GAS=true npx hardhat test
```

## Smart Contracts

- `NFT.sol`: ERC721 token implementation
- `NFTRental.sol`: Main rental contract
- `TestNFT.sol`: Test NFT implementation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

Your Name - [Advik](https://x.com/saikira86814070)

Project Link: [https://github.com/skiran2801/nft-rental](https://github.com/skiran2801/nft-rental) 
