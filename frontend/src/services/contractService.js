import Web3 from 'web3';
import NFTRentalArtifact from '../artifacts/contracts/NFTRental.sol/NFTRental.json';
import NFTArtifact from '../artifacts/contracts/NFT.sol/NFT.json';
import storageService from './storageService';

// Add ERC721 ABI for approval functions
const ERC721_ABI = [
    {
        "inputs": [
            {"name": "operator", "type": "address"},
            {"name": "approved", "type": "bool"}
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "owner", "type": "address"},
            {"name": "operator", "type": "address"}
        ],
        "name": "isApprovedForAll",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    }
];

// Extract ABI arrays from artifacts
const NFTRentalABI = NFTRentalArtifact.abi;
const NFTABI = NFTArtifact.abi;

// --- Add more detailed Debugging ---
console.log("NFTRentalABI loaded:", NFTRentalABI ? `Array with ${NFTRentalABI.length} items` : 'FAILED TO LOAD');
console.log("NFTABI loaded:", NFTABI ? `Array with ${NFTABI.length} items` : 'FAILED TO LOAD');

// Log the actual function signatures
if (NFTRentalABI) {
  const getActiveListingsFn = NFTRentalABI.find(item => 
    item.name === 'getActiveListings' && item.type === 'function'
  );
  console.log("getActiveListings function ABI:", getActiveListingsFn);
}
// --- End detailed Debugging ---

// Initialize a static Web3 instance for utility functions
const utilityWeb3 = new Web3(window.ethereum || 'http://localhost:8545');

// Add this at the top of your file, after the imports
let initializationPromise = null;

async function debugTransaction(txHash, web3) {
  try {
    console.log(`Debugging transaction: ${txHash}`);
    const tx = await web3.eth.getTransaction(txHash);
    console.log('Transaction:', tx);
    
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    console.log('Transaction receipt:', receipt);
    
    return { tx, receipt };
  } catch (error) {
    console.error('Error debugging transaction:', error);
    return null;
  }
}

class ContractService {
    constructor() {
        this.web3 = null;
        this.contract = null;
        this.nftContract = null;
        this.storageService = null;
        this.initialized = false;
        
        // Auto-initialize when possible but don't wait for completion
        if (window.ethereum) {
            this.initIfPossible();
        }
    }
    
    async initIfPossible() {
        // Store the initialization promise for later use
        if (!initializationPromise) {
            initializationPromise = this.init(window.ethereum).catch(error => {
                console.warn('Auto-initialization failed:', error.message);
                initializationPromise = null; // Reset so we can try again
                return false;
            });
        }
        return initializationPromise;
    }

    // Add this ensureInitialized method to be used before any contract calls
    async ensureInitialized() {
        if (this.initialized) return true;
        
        if (!initializationPromise && window.ethereum) {
            await this.initIfPossible();
        }
        
        if (initializationPromise) {
            await initializationPromise;
        }
        
        if (!this.initialized) {
            throw new Error('Contract not initialized. Please connect your wallet first.');
        }
        
        return true;
    }

    async init(provider) {
        try {
            if (this.initialized) return true;
            
            console.log('Initializing ContractService...');
            
            if (!provider) {
                throw new Error('No provider available');
            }

            this.web3 = new Web3(provider);
            
            try {
                await this.web3.eth.net.isListening();
            } catch (error) {
                console.error('Network connection error:', error);
                throw new Error('Failed to connect to the network. Please make sure your Hardhat node is running.');
            }

            const networkId = await this.web3.eth.net.getId();
            console.log('Connected to network:', networkId);

            if (networkId !== 31337) {
                throw new Error('Please connect to Hardhat network (Chain ID: 31337)');
            }

            // --- Add explicit check for ABI before proceeding ---
            if (!NFTRentalABI || !NFTABI) {
                console.error("ABIs not loaded correctly!");
                throw new Error("Failed to load contract ABIs. Check import paths and artifact files.");
            }
            // --- End explicit check ---

            await this.initializeContracts();
            
            this.initialized = true;
            return true;
        } catch (error) {
            console.error('Contract initialization failed:', error);
            this.initialized = false;
            throw new Error(`Failed to initialize contracts: ${error.message}`);
        }
    }

    async initializeContracts() {
        try {
            // Verify contract addresses
            if (!process.env.REACT_APP_CONTRACT_ADDRESS || !process.env.REACT_APP_NFT_CONTRACT_ADDRESS) {
                throw new Error('Contract addresses not found in environment variables');
            }

            // --- Add Debugging before contract creation ---
            console.log("Attempting to create NFTRental contract with ABI:", NFTRentalABI ? 'ABI exists' : 'ABI MISSING');
            console.log("NFTRental Address:", process.env.REACT_APP_CONTRACT_ADDRESS);
            // --- End Debugging ---

            // Initialize rental contract using the imported ABI
            this.contract = new this.web3.eth.Contract(
                NFTRentalABI,
                process.env.REACT_APP_CONTRACT_ADDRESS
            );

            if (!this.contract || !this.contract.options.jsonInterface) {
                throw new Error('Failed to initialize rental contract - ABI likely undefined or invalid');
            }

            // --- Add Debugging before contract creation ---
            console.log("Attempting to create NFT contract with ABI:", NFTABI ? 'ABI exists' : 'ABI MISSING');
            console.log("NFT Address:", process.env.REACT_APP_NFT_CONTRACT_ADDRESS);
            // --- End Debugging ---

            // Initialize NFT contract using the imported ABI
            this.nftContract = new this.web3.eth.Contract(
                NFTABI,
                process.env.REACT_APP_NFT_CONTRACT_ADDRESS
            );

            if (!this.nftContract || !this.nftContract.options.jsonInterface) {
                throw new Error('Failed to initialize NFT contract - ABI likely undefined or invalid');
            }

            // Verify contracts are deployed with a simpler check
            try {
                const nftCode = await this.web3.eth.getCode(process.env.REACT_APP_NFT_CONTRACT_ADDRESS);
                const rentalCode = await this.web3.eth.getCode(process.env.REACT_APP_CONTRACT_ADDRESS);

                if (nftCode === '0x' || rentalCode === '0x') {
                    throw new Error('One or more contracts not deployed');
                }

                console.log('Contract verification successful');
            } catch (error) {
                console.error('Contract verification failed:', error);
                throw new Error('Contracts not properly deployed. Please run deployment script.');
            }

            console.log('Contracts initialized successfully');
        } catch (error) {
            console.error('Contract initialization error:', error);
            throw error;
        }
    }

    async uploadToIPFS(file) {
        return await storageService.uploadFile(file);
    }

    async uploadMetadataToIPFS(metadata) {
        return await storageService.uploadJson(metadata);
    }

    async getMinGasPrice() {
        try {
            // Get network's minimum gas price
            const gasPrice = await this.web3.eth.getGasPrice();
            console.log('Network minimum gas price:', gasPrice);
            return gasPrice;
        } catch (error) {
            console.error('Error getting gas price:', error);
            return '1000000000'; // 1 gwei fallback
        }
    }

    async mintNFT(account, tokenURI) {
        try {
            console.log('Minting NFT...');
            if (!this.nftContract) {
                throw new Error('NFT contract not initialized');
            }

            const formattedURI = tokenURI.startsWith('ipfs://') 
                ? tokenURI 
                : `ipfs://${tokenURI}`;

            // Get minimum gas price
            const minGasPrice = await this.getMinGasPrice();
            const mintMethod = this.nftContract.methods.safeMint || this.nftContract.methods.mint;
            
            const result = await mintMethod(account, formattedURI)
                .send({
                    from: account,
                    gasPrice: minGasPrice // Use minimum gas price
                });

            const tokenId = result.events.Transfer.returnValues.tokenId;
            return tokenId;
        } catch (error) {
            console.error('NFT minting failed:', error);
            throw new Error(error.message || 'Failed to mint NFT');
        }
    }

    async listNFT(nftAddress, tokenId, pricePerDay, maxDuration, account) {
        try {
            // First approve the rental contract
            await this.approveNFT(nftAddress, tokenId, account);

            // Get minimum gas price
            const minGasPrice = await this.getMinGasPrice();

            // List the NFT with minimum gas price
            const result = await this.contract.methods
                .listNFT(nftAddress, tokenId, pricePerDay, maxDuration)
                .send({
                    from: account,
                    gasPrice: minGasPrice // Use minimum gas price
                });

            return result;
        } catch (error) {
            console.error('NFT listing failed:', error);
            throw new Error(error.message || 'Failed to list NFT');
        }
    }

    async approveNFT(nftContract, tokenId, account) {
        if (!this.web3.utils.isAddress(nftContract)) {
            throw new Error('Invalid NFT contract address');
        }

        try {
            const erc721Contract = new this.web3.eth.Contract(
                ERC721_ABI,
                nftContract
            );

            // Get minimum gas price
            const minGasPrice = await this.getMinGasPrice();

            // Approve with minimum gas price
            await erc721Contract.methods
                .setApprovalForAll(this.contract.options.address, true)
                .send({
                    from: account,
                    gasPrice: minGasPrice // Use minimum gas price
                });

            console.log('NFT approved successfully');
        } catch (error) {
            console.error('Error approving NFT:', error);
            throw new Error('Failed to approve NFT');
        }
    }

    async getListingsByNFT(nftContract, tokenId) {
        if (!this.contract) {
            throw new Error('Contract not initialized');
        }

        try {
            const listing = await this.contract.methods
                .listings(nftContract, tokenId)
                .call();
            return listing;
        } catch (error) {
            console.error('Error fetching listing:', error);
            throw new Error('Failed to fetch NFT listing');
        }
    }

    async getActiveListings() {
        // Always call ensureInitialized before using contracts
        await this.ensureInitialized();
        
        try {
            console.log('Fetching active listings...');
            
            // Keep your existing temporary contract with explicit ABI
            const getActiveListingsFunction = {
                constant: true,
                inputs: [],
                name: 'getActiveListings',
                outputs: [
                    { internalType: 'address[]', name: 'contracts', type: 'address[]' },
                    { internalType: 'uint256[][]', name: 'tokenIds', type: 'uint256[][]' }
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function'
            };

            const tempContract = new this.web3.eth.Contract(
                [getActiveListingsFunction], 
                process.env.REACT_APP_CONTRACT_ADDRESS
            );
            
            const result = await tempContract.methods.getActiveListings().call();
            console.log('Raw active listings data:', result);

            const { contracts, tokenIds } = result;
            
            const listingsWithDetails = [];
            
            for (let i = 0; i < contracts.length; i++) {
                const nftContract = contracts[i];
                for (let j = 0; j < tokenIds[i].length; j++) {
                    const tokenId = tokenIds[i][j];
                    
                    try {
                        const listingDetails = await this.getListing(nftContract, tokenId);
                        
                        const erc721Contract = new this.web3.eth.Contract(NFTABI, nftContract);
                        const tokenURI = await erc721Contract.methods.tokenURI(tokenId).call();
                        
                        // Improved metadata handling
                        let metadata = {};
                        let imageUrl = '';
                        
                        if (tokenURI) {
                            try {
                                // Better IPFS URL handling
                                const metadataUrl = this.formatIPFSUrl(tokenURI);
                                console.log(`Fetching metadata from Pinata gateway: ${metadataUrl}`);
                                
                                const response = await fetch(metadataUrl);
                                if (!response.ok) {
                                    throw new Error(`HTTP error! Status: ${response.status}`);
                                }
                                
                                metadata = await response.json();
                                console.log(`Metadata for token ${tokenId}:`, metadata);
                                
                                // Process image URL if it exists
                                if (metadata.image) {
                                    imageUrl = this.formatIPFSUrl(metadata.image);
                                    console.log(`Image URL for token ${tokenId}: ${imageUrl}`);
                                }
                            } catch (metadataError) {
                                console.warn(`Failed to fetch metadata for token ${tokenId}:`, metadataError);
                            }
                        }
                        
                        listingsWithDetails.push({
                            nftContract,
                            tokenId,
                            ...listingDetails,
                            metadata,
                            tokenURI,
                            imageUrl // Add the processed image URL
                        });
                    } catch (detailError) {
                        console.error(`Failed to process listing for contract ${nftContract}, token ${tokenId}:`, detailError);
                    }
                }
            }
            
            console.log('Processed listings with details:', listingsWithDetails);
            return listingsWithDetails;
        } catch (error) {
            console.error('Error fetching active listings:', error);
            throw new Error('Failed to fetch active listings: ' + error.message);
        }
    }

    // Simplified IPFS URL formatter that only uses Pinata gateway
    formatIPFSUrl(url) {
        if (!url) {
            console.log('formatIPFSUrl: Empty URL provided');
            return '';
        }
        console.log('formatIPFSUrl: Input URL:', url);
        
        // Handle ipfs:// protocol
        let ipfsPath = url.replace('ipfs://', '');
        
        // If the path starts with a slash, remove it
        if (ipfsPath.startsWith('/')) {
            ipfsPath = ipfsPath.substring(1);
        }
        
        // Remove any file paths after the CID
        ipfsPath = ipfsPath.split('/')[0];
        
        // Use Pinata gateway with token
        const pinataGateway = 'https://amethyst-abundant-chinchilla-818.mypinata.cloud';
        const gatewayToken = 'rYtjz8bbKJhdMZD7FcsBKV_juSZxrHEbsEMiaCPi19H4Re5UeHW5RBVg0iEvTTzt';
        
        // Return the Pinata gateway URL with token
        const formattedUrl = `${pinataGateway}/ipfs/${ipfsPath}?pinataGatewayToken=${gatewayToken}`;
        console.log('formatIPFSUrl: Generated URL:', formattedUrl);
        
        return formattedUrl;
    }

    async fetchWithPinata(url) {
        try {
            // Use the same gateway token we're using in formatIPFSUrl
            const gatewayToken = 'rYtjz8bbKJhdMZD7FcsBKV_juSZxrHEbsEMiaCPi19H4Re5UeHW5RBVg0iEvTTzt';
            
            console.log('Fetching from Pinata:', url);
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Pinata fetch error:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorText
                });
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            return response;
        } catch (error) {
            console.error('Error fetching from Pinata:', error);
            throw error;
        }
    }

    // Add getListing if it doesn't exist
    async getListing(nftContract, tokenId) {
        // Always call ensureInitialized before using contracts
        await this.ensureInitialized();
        
        try {
            const listing = await this.contract.methods.listings(nftContract, tokenId).call();
            return listing;
        } catch (error) {
            console.error('Error fetching listing:', error);
            throw new Error('Failed to fetch listing');
        }
    }

    // Static utility methods that don't rely on instance state
    static weiToEth(wei) {
        return utilityWeb3.utils.fromWei(wei.toString(), 'ether');
    }
    
    static ethToWei(eth) {
        return utilityWeb3.utils.toWei(eth.toString(), 'ether');
    }
    
    // Instance methods that use static methods as fallbacks
    weiToEth(wei) {
        if (this.web3) {
            return this.web3.utils.fromWei(wei.toString(), 'ether');
        }
        return ContractService.weiToEth(wei);
    }
    
    ethToWei(eth) {
        if (this.web3) {
            return this.web3.utils.toWei(eth.toString(), 'ether');
        }
        return ContractService.ethToWei(eth);
    }

    async rentNFT(nftContract, tokenId, rentalDuration, account) {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            if (!Web3.utils.isAddress(nftContract)) {
                throw new Error('Invalid NFT contract address format');
            }

            if (!account) {
                throw new Error('No wallet connected');
            }

            console.log('Starting rental process with params:', {
                nftContract,
                tokenId,
                rentalDuration,
                account
            });

            // Get the listing details first
            const listing = await this.getListing(nftContract, tokenId);
            if (!listing || !listing.isActive) {
                throw new Error('NFT is not available for rent');
            }

            // Get price per day from the listing
            const pricePerDay = listing.pricePerDay;
            console.log('Price per day:', pricePerDay);

            // Calculate total price using Web3's utils.toBN
            const totalPrice = this.web3.utils.toBN(pricePerDay).mul(
                this.web3.utils.toBN(rentalDuration)
            );
            console.log('Total price:', totalPrice.toString());

            // First, check if approval is needed
            const isApproved = await this.checkNFTApproval(nftContract, tokenId, account);
            console.log('NFT approval status:', isApproved);

            if (!isApproved) {
                console.log('Requesting NFT approval...');
                await this.approveNFT(nftContract, tokenId, account);
            }

            // Validate rental duration against max duration
            if (rentalDuration > parseInt(listing.maxDuration)) {
                throw new Error(`Rental duration cannot exceed ${listing.maxDuration} days`);
            }

            console.log('Sending rental transaction...');
            const rental = await this.contract.methods
                .rentNFT(nftContract, tokenId, rentalDuration)
                .send({ 
                    from: account,
                    value: totalPrice.toString() // Send the total price in wei
                });

            console.log('Rental successful:', rental);
            return rental;
        } catch (error) {
            console.error('Detailed rental error:', {
                message: error.message,
                code: error.code,
                data: error.data
            });
            
            // Provide more specific error messages
            if (error.message.includes('insufficient funds')) {
                throw new Error('Insufficient funds to complete the rental');
            } else if (error.message.includes('user rejected')) {
                throw new Error('Transaction was rejected by user');
            } else {
                throw new Error(`Failed to rent NFT: ${error.message}`);
            }
        }
    }

    // Add helper method to check NFT approval
    async checkNFTApproval(nftContract, tokenId, account) {
        try {
            const nftContractInstance = new this.web3.eth.Contract(
                ERC721_ABI,
                nftContract
            );
            
            const isApproved = await nftContractInstance.methods
                .isApprovedForAll(account, this.contract.options.address)
                .call();
                
            return isApproved;
        } catch (error) {
            console.error('Error checking NFT approval:', error);
            return false;
        }
    }

    async getUserListings(userAddress) {
        await this.ensureInitialized();
        
        try {
            console.log('Fetching listings for user:', userAddress);
            
            // Get user's NFTs first
            const userNFTs = await this.contract.methods.getUserListings(userAddress).call();
            console.log('Raw user NFTs:', userNFTs);
            
            if (!userNFTs || !userNFTs.contracts || !userNFTs.tokenIds) {
                console.log('No listings found for user');
                return [];
            }
            
            const { contracts, tokenIds } = userNFTs;
            const userListings = [];
            
            // Process each NFT
            for (let i = 0; i < contracts.length; i++) {
                const nftContract = contracts[i];
                for (let j = 0; j < tokenIds[i].length; j++) {
                    const tokenId = tokenIds[i][j];
                    
                    try {
                        // Get listing details
                        const listingDetails = await this.getListing(nftContract, tokenId);
                        console.log(`Listing details for token ${tokenId}:`, listingDetails);
                        
                        // Get NFT metadata
                        const erc721Contract = new this.web3.eth.Contract(NFTABI, nftContract);
                        const tokenURI = await erc721Contract.methods.tokenURI(tokenId).call();
                        console.log(`Token URI for token ${tokenId}:`, tokenURI);
                        
                        // Process metadata and image
                        let metadata = {};
                        let imageUrl = '';
                        
                        if (tokenURI) {
                            try {
                                const metadataUrl = this.formatIPFSUrl(tokenURI);
                                console.log(`Fetching metadata from URL: ${metadataUrl}`);
                                
                                const response = await fetch(metadataUrl);
                                if (!response.ok) {
                                    throw new Error(`HTTP error! Status: ${response.status}`);
                                }
                                
                                metadata = await response.json();
                                console.log(`Metadata for token ${tokenId}:`, metadata);
                                
                                if (metadata.image) {
                                    imageUrl = this.formatIPFSUrl(metadata.image);
                                    console.log(`Image URL for token ${tokenId}:`, imageUrl);
                                } else {
                                    console.warn(`No image found in metadata for token ${tokenId}`);
                                }
                            } catch (metadataError) {
                                console.warn(`Failed to fetch metadata for token ${tokenId}:`, metadataError);
                                // Continue with empty metadata but don't throw
                                metadata = {};
                            }
                        } else {
                            console.warn(`No tokenURI found for token ${tokenId}`);
                        }
                        
                        // Only add active listings
                        if (listingDetails.isActive) {
                            userListings.push({
                                nftContract,
                                tokenId,
                                ...listingDetails,
                                metadata: metadata || {},
                                tokenURI: tokenURI || '',
                                imageUrl: imageUrl || '/images/placeholder.png',
                                isOwner: true
                            });
                        }
                    } catch (detailError) {
                        console.error(`Failed to process listing for contract ${nftContract}, token ${tokenId}:`, detailError);
                    }
                }
            }
            
            console.log('Processed user listings:', userListings);
            return userListings;
        } catch (error) {
            console.error('Error fetching user listings:', error);
            throw new Error('Failed to fetch your listed NFTs: ' + error.message);
        }
    }

    async unlistNFT(nftContract, tokenId, account) {
        // Always call ensureInitialized before using contracts
        await this.ensureInitialized();
        
        try {
            console.log('Unlisting NFT:', { nftContract, tokenId, account });
            
            // Validate inputs
            if (!nftContract || !this.web3.utils.isAddress(nftContract)) {
                throw new Error('Invalid NFT contract address');
            }
            if (tokenId === undefined || tokenId === null) {
                throw new Error('Invalid token ID');
            }
            if (!account || !this.web3.utils.isAddress(account)) {
                throw new Error('Invalid account address');
            }
            
            // Get minimum gas price
            const minGasPrice = await this.getMinGasPrice();
            
            // Call the unlistNFT function
            const result = await this.contract.methods
                .unlistNFT(nftContract, tokenId)
                .send({
                    from: account,
                    gasPrice: minGasPrice,
                    gas: 200000  // Explicit gas limit
                });
            
            console.log('Unlisting transaction result:', result);
            return result;
        } catch (error) {
            console.error('NFT unlisting failed:', error);
            
            // Handle specific errors
            if (error.message.includes('User denied transaction signature')) {
                throw new Error('Transaction was rejected in your wallet');
            } else if (error.message.includes('execution reverted')) {
                throw new Error('Transaction reverted by the contract. You might not be the owner of this NFT.');
            }
            
            throw new Error(error.message || 'Failed to unlist NFT');
        }
    }

    async getUserRentals(userAddress) {
        await this.ensureInitialized();
        
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            console.log('Fetching rentals for user:', userAddress);
            
            // Get all active listings first
            const { contracts, tokenIds } = await this.contract.methods.getActiveListings().call();
            console.log('Active listings:', { contracts, tokenIds });
            
            const processedRentals = [];
            
            // Check each listing for rental status
            for (let i = 0; i < contracts.length; i++) {
                const nftContract = contracts[i];
                for (let j = 0; j < tokenIds[i].length; j++) {
                    const tokenId = tokenIds[i][j];
                    
                    try {
                        // Get rental info using getRentalInfo
                        const rentalInfo = await this.contract.methods.getRentalInfo(nftContract, tokenId).call();
                        
                        // If this NFT is rented by the user
                        if (rentalInfo.renter.toLowerCase() === userAddress.toLowerCase()) {
                            // Get NFT metadata
                            const erc721Contract = new this.web3.eth.Contract(NFTABI, nftContract);
                            let tokenURI;
                            try {
                                tokenURI = await erc721Contract.methods.tokenURI(tokenId).call();
                                console.log(`Token URI for rented NFT ${tokenId}:`, tokenURI);
                            } catch (uriError) {
                                console.warn(`Failed to fetch tokenURI for NFT ${tokenId}:`, uriError);
                                continue;
                            }
                            
                            // Process metadata and image
                            let metadata = {};
                            let imageUrl = '';
                            
                            if (tokenURI) {
                                try {
                                    const metadataUrl = this.formatIPFSUrl(tokenURI);
                                    console.log(`Fetching metadata from URL: ${metadataUrl}`);
                                    
                                    const response = await fetch(metadataUrl);
                                    if (!response.ok) {
                                        throw new Error(`HTTP error! Status: ${response.status}`);
                                    }
                                    
                                    metadata = await response.json();
                                    console.log(`Metadata for rented NFT ${tokenId}:`, metadata);
                                    
                                    if (metadata.image) {
                                        imageUrl = this.formatIPFSUrl(metadata.image);
                                        console.log(`Image URL for rented NFT ${tokenId}:`, imageUrl);
                                    }
                                } catch (metadataError) {
                                    console.warn(`Failed to fetch metadata for rented NFT ${tokenId}:`, metadataError);
                                    metadata = {};
                                }
                            }
                            
                            const now = Math.floor(Date.now() / 1000);
                            const isActive = now < parseInt(rentalInfo.endTime);
                            
                            processedRentals.push({
                                nftContract,
                                tokenId,
                                owner: rentalInfo.owner,
                                pricePerDay: rentalInfo.pricePerDay,
                                maxDuration: rentalInfo.maxDuration,
                                startTime: parseInt(rentalInfo.endTime) - (parseInt(rentalInfo.maxDuration) * 24 * 60 * 60), // Approximate start time
                                endTime: parseInt(rentalInfo.endTime),
                                metadata,
                                imageUrl: imageUrl || '/images/placeholder.png',
                                isActive,
                                remainingTime: isActive ? parseInt(rentalInfo.endTime) - now : 0
                            });
                        }
                    } catch (detailError) {
                        console.error(`Failed to process rental details for contract ${nftContract}, token ${tokenId}:`, detailError);
                    }
                }
            }
            
            // Sort rentals by active status and end time
            processedRentals.sort((a, b) => {
                if (a.isActive !== b.isActive) return b.isActive - a.isActive;
                return b.endTime - a.endTime;
            });
            
            console.log('Processed user rentals:', processedRentals);
            return processedRentals;
        } catch (error) {
            console.error('Error fetching user rentals:', error);
            throw new Error('Failed to fetch your rented NFTs: ' + error.message);
        }
    }

    async getUserTransactions(userAddress) {
        await this.ensureInitialized();
        
        try {
            console.log('Fetching transactions for user:', userAddress);
            
            // Get user's transactions
            const userTransactions = await this.contract.methods.getUserTransactions(userAddress).call();
            console.log('Raw user transactions:', userTransactions);
            
            if (!userTransactions || userTransactions.length === 0) {
                console.log('No transactions found for user');
                return [];
            }
            
            const processedTransactions = [];
            
            // Process each transaction
            for (const tx of userTransactions) {
                try {
                    // Get transaction details
                    const txDetails = {
                        type: tx.transactionType, // 'RENT', 'LIST', 'UNLIST', etc.
                        nftContract: tx.nftContract,
                        tokenId: tx.tokenId,
                        amount: this.weiToEth(tx.amount),
                        timestamp: tx.timestamp,
                        transactionHash: tx.transactionHash
                    };
                    
                    processedTransactions.push(txDetails);
                } catch (detailError) {
                    console.error(`Failed to process transaction:`, detailError);
                }
            }
            
            // Sort transactions by timestamp (newest first)
            processedTransactions.sort((a, b) => b.timestamp - a.timestamp);
            
            console.log('Processed user transactions:', processedTransactions);
            return processedTransactions;
        } catch (error) {
            console.error('Error fetching user transactions:', error);
            throw new Error('Failed to fetch your transaction history: ' + error.message);
        }
    }
}

// Create instance and export
const contractService = new ContractService();
export default contractService; 