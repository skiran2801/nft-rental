import React, { useState, useEffect } from 'react';
import contractService from '../../services/contractService';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Benefits from './components/Benefits';
import Web3 from 'web3';
import NFTCard from '../../components/shared/NFTCard';

const Browse = ({ isWalletConnected, walletAddress }) => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [rentingNFT, setRentingNFT] = useState(null);

    // Move fetchListings outside useEffect
    const fetchListings = async () => {
        setLoading(true);
        setError('');
        try {
            // Ensure contract service is initialized
            if (!contractService.web3 && window.ethereum) {
                await contractService.init(window.ethereum);
            }
            const activeListings = await contractService.getActiveListings();
            console.log('Fetched listings:', activeListings);
            setListings(activeListings);
        } catch (fetchError) {
            console.error('Error fetching listings:', fetchError);
            setError(fetchError.message || 'Failed to load listings.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, [isWalletConnected]);

    const formatImageUrl = (url) => {
        if (!url) {
            console.log('No image URL provided, using placeholder');
            return '/assets/placeholder.png';
        }
        
        console.log('Original image URL:', url);
        
        // Use the contractService's formatIPFSUrl method for consistent handling
        const formattedUrl = contractService.formatIPFSUrl(url);
        console.log('Formatted URL (Pinata gateway):', formattedUrl);
        
        return formattedUrl;
    };

    const renderNFTImage = (listing) => {
        return (
            <img 
                src={listing.imageUrl || '/assets/placeholder.png'} 
                className="card-img-top" 
                alt={listing.metadata?.name || `NFT #${listing.tokenId}`}
                onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                    e.target.src = '/assets/placeholder.png';
                    e.target.onerror = null;
                }}
                style={{ height: '200px', objectFit: 'contain' }}
            />
        );
    };

    const handleRent = async (nft, duration) => {
        try {
            if (!walletAddress) {
                throw new Error('Please connect your wallet');
            }

            if (!nft.nftContract) {
                throw new Error('Invalid NFT contract address');
            }

            console.log('Renting NFT:', {
                nftContract: nft.nftContract,
                tokenId: nft.tokenId,
                duration,
                walletAddress
            });

            await contractService.rentNFT(
                nft.nftContract,
                nft.tokenId,
                duration,
                walletAddress
            );
            
            await fetchListings();
        } catch (error) {
            console.error('Failed to rent NFT:', error);
            throw new Error(error.message || 'Failed to rent NFT. Please try again.');
        }
    };

    return (
        <div className="space-y-12">
            <Hero />
            
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
                        Available NFTs for Rent
                    </h2>

                    {!isWalletConnected && (
                        <div className="text-center py-4 mb-8 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-yellow-700">
                                Please connect your wallet to rent NFTs
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-4 mb-8 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {loading && (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading listings...</p>
                        </div>
                    )}

                    {!loading && !error && listings.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No NFTs currently available for rent.
                        </div>
                    )}

                    {!loading && !error && listings.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {listings.map((listing) => (
                                <NFTCard
                                    key={`${listing.nftContract}-${listing.tokenId}`}
                                    nft={listing}
                                    isWalletConnected={isWalletConnected}
                                    walletAddress={walletAddress}
                                    onRent={handleRent}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <HowItWorks />
            <Benefits />
        </div>
    );
};

export default Browse;