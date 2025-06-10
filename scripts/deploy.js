// scripts/deploy.js
const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Fund test accounts
  const testAccounts = [
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
  ];

  // Send 100 ETH to each test account
  for (const account of testAccounts) {
    console.log(`Funding test account ${account}...`);
    await deployer.sendTransaction({
      to: account,
      value: ethers.utils.parseEther("100")
    });
    const balance = await ethers.provider.getBalance(account);
    console.log(`Account ${account} balance: ${ethers.utils.formatEther(balance)} ETH`);
  }

  // Deploy NFT Contract
  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();
  await nft.deployed();
  console.log("NFT Contract deployed to:", nft.address);

  // Deploy Rental Contract
  const NFTRental = await ethers.getContractFactory("NFTRental");
  const rental = await NFTRental.deploy();
  await rental.deployed();
  console.log("Rental Contract deployed to:", rental.address);

  // Read existing .env.development file
  let envContent = '';
  try {
    envContent = fs.readFileSync('frontend/.env.development', 'utf8');
  } catch (error) {
    console.log('No existing .env.development file found');
  }

  // Update only the contract addresses
  const envLines = envContent.split('\n');
  const updatedEnv = envLines.map(line => {
    if (line.startsWith('REACT_APP_NFT_CONTRACT_ADDRESS=')) {
      return `REACT_APP_NFT_CONTRACT_ADDRESS=${nft.address}`;
    }
    if (line.startsWith('REACT_APP_CONTRACT_ADDRESS=')) {
      return `REACT_APP_CONTRACT_ADDRESS=${rental.address}`;
    }
    return line;
  });

  // Add network URL if not present
  if (!envContent.includes('REACT_APP_NETWORK_URL=')) {
    updatedEnv.push('REACT_APP_NETWORK_URL=http://127.0.0.1:8545');
  }

  fs.writeFileSync(
    'frontend/.env.development',
    updatedEnv.join('\n'),
    'utf8'
  );

  console.log('Environment variables updated successfully');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });