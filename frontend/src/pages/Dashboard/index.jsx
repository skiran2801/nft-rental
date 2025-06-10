// pages/Dashboard/index.jsx
import React, { useState, useEffect } from 'react';
import contractService from '../../services/contractService';
import NFTCard from '../../components/shared/NFTCard';

const Dashboard = ({ walletAddress }) => {
    const [activeTab, setActiveTab] = useState('listed');
    const [listedNFTs, setListedNFTs] = useState([]);
    const [rentedNFTs, setRentedNFTs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNFTs = async () => {
            if (!walletAddress) {
                setError('Please connect your wallet');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Fetch listed NFTs
                const listed = await contractService.getUserListings(walletAddress);
                setListedNFTs(listed);

                // Fetch rented NFTs (if method is implemented)
                try {
                    const rented = await contractService.getUserRentals(walletAddress);
                    setRentedNFTs(rented);
                } catch (err) {
                    console.warn('Rental fetching not yet implemented');
                    setRentedNFTs([]);
                }

            } catch (err) {
                console.error('Error fetching NFTs:', err);
                setError('Failed to fetch your NFTs. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchNFTs();
    }, [walletAddress]);

    if (!walletAddress) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center p-8 bg-yellow-50 rounded-lg">
                    <p className="text-yellow-600">Please connect your wallet to view your dashboard</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
            
            {/* Tabs */}
            <div className="flex space-x-4 mb-6 border-b">
                <button
                    className={`pb-2 px-4 ${activeTab === 'listed' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('listed')}
                >
                    Listed NFTs ({listedNFTs.length})
                </button>
                <button
                    className={`pb-2 px-4 ${activeTab === 'rented' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('rented')}
                >
                    Rented NFTs ({rentedNFTs.length})
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="text-center p-8 bg-red-50 rounded-lg mb-6">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {/* NFT Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === 'listed' && (
                    listedNFTs.length > 0 ? (
                        listedNFTs.map((nft) => (
                            <NFTCard
                                key={`${nft.contractAddress}-${nft.tokenId}`}
                                nft={nft}
                                isWalletConnected={true}
                                walletAddress={walletAddress}
                                showUnlistButton={true}
                                onUnlist={async () => {
                                    try {
                                        await contractService.unlistNFT(nft.contractAddress, nft.tokenId, walletAddress);
                                        const updated = await contractService.getUserListings(walletAddress);
                                        setListedNFTs(updated);
                                    } catch (err) {
                                        console.error('Failed to unlist NFT:', err);
                                        setError('Failed to unlist NFT. Please try again.');
                                    }
                                }}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center p-8 bg-gray-50 rounded-lg">
                            <p className="text-gray-600">You haven't listed any NFTs yet</p>
                        </div>
                    )
                )}

                {activeTab === 'rented' && (
                    <div className="col-span-full text-center p-8 bg-blue-50 rounded-lg">
                        <p className="text-blue-600">
                            NFT rental functionality is coming soon! 
                            <br />
                            You'll be able to view and manage your rented NFTs here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;