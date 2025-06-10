import React, { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import contractService from '../../../services/contractService';

// Standard ERC721 interface including Enumerable extension
const ERC721_ABI = [
  {
    "inputs": [{"name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "owner", "type": "address"}, {"name": "index", "type": "uint256"}],
    "name": "tokenOfOwnerByIndex",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// List of supported NFT contracts
const SUPPORTED_CONTRACTS = [
  {
    address: process.env.REACT_APP_NFT_CONTRACT_ADDRESS,
    name: 'Your NFT Collection'
  }
  // Add more contracts as needed
];

const NFTSelector = ({ onSelect, walletAddress }) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedContract, setSelectedContract] = useState(SUPPORTED_CONTRACTS[0]);

  const fetchNFTs = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(ERC721_ABI, process.env.REACT_APP_NFT_CONTRACT_ADDRESS);

      // Get contract details
      const [name, symbol] = await Promise.all([
        contract.methods.name().call(),
        contract.methods.symbol().call()
      ]);
      console.log('Contract:', { name, symbol });

      // Get balance of NFTs
      const balance = await contract.methods.balanceOf(walletAddress).call();
      console.log('NFT Balance:', balance);

      if (balance === '0') {
        setNfts([]);
        return;
      }

      // Fetch all NFTs owned by the user
      const nftPromises = [];
      for (let i = 0; i < balance; i++) {
        nftPromises.push(contract.methods.tokenOfOwnerByIndex(walletAddress, i).call());
      }

      const tokenIds = await Promise.all(nftPromises);
      console.log('Token IDs:', tokenIds);

      // Fetch metadata for each NFT
      const nftsWithMetadata = await Promise.all(
        tokenIds.map(async (tokenId) => {
          try {
            const tokenURI = await contract.methods.tokenURI(tokenId).call();
            let metadata = {};

            if (tokenURI) {
              if (tokenURI.startsWith('ipfs://')) {
                const ipfsUrl = tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
                const response = await fetch(ipfsUrl);
                metadata = await response.json();
              } else {
                const response = await fetch(tokenURI);
                metadata = await response.json();
              }
            }

            return {
              contractAddress: process.env.REACT_APP_NFT_CONTRACT_ADDRESS,
              contractName: name,
              contractSymbol: symbol,
              tokenId,
              name: metadata.name || `${symbol} #${tokenId}`,
              image: metadata.image || '',
              description: metadata.description || '',
              attributes: metadata.attributes || []
            };
          } catch (error) {
            console.error(`Error fetching metadata for token ${tokenId}:`, error);
            return {
              contractAddress: process.env.REACT_APP_NFT_CONTRACT_ADDRESS,
              contractName: name,
              contractSymbol: symbol,
              tokenId,
              name: `${symbol} #${tokenId}`,
              image: '',
              description: 'Metadata unavailable'
            };
          }
        })
      );

      setNfts(nftsWithMetadata);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      setError('Failed to fetch your NFTs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (walletAddress) {
      fetchNFTs();
    }
  }, [walletAddress, fetchNFTs]);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Select NFT to List</h3>
        {SUPPORTED_CONTRACTS.length > 1 && (
          <select
            className="border rounded-lg px-3 py-2"
            value={selectedContract.address}
            onChange={(e) => {
              const contract = SUPPORTED_CONTRACTS.find(c => c.address === e.target.value);
              setSelectedContract(contract);
            }}
          >
            {SUPPORTED_CONTRACTS.map(contract => (
              <option key={contract.address} value={contract.address}>
                {contract.name}
              </option>
            ))}
          </select>
        )}
      </div>
      
      {loading && (
        <div className="text-gray-600">Loading your NFTs...</div>
      )}

      {error && (
        <div className="text-red-600">{error}</div>
      )}

      {!loading && !error && nfts.length === 0 && (
        <div className="text-gray-600">
          No NFTs found in your wallet for {selectedContract.name}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nfts.map((nft) => (
          <div
            key={`${nft.contractAddress}-${nft.tokenId}`}
            className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
            onClick={() => onSelect(nft)}
          >
            {nft.image ? (
              <img 
                src={contractService.formatIPFSUrl(nft.image)} 
                alt={nft.name}
                className="w-full h-48 object-cover rounded-lg mb-2" 
                onError={(e) => {
                  console.error('Image failed to load:', e.target.src);
                  e.target.src = '/placeholder.png';
                }}
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                No Image
              </div>
            )}
            <div className="font-medium">{nft.name}</div>
            <div className="text-sm text-gray-600">
              {nft.contractName} • Token ID: {nft.tokenId}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTSelector; 