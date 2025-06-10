import React, { useState, useEffect } from 'react';
import contractService from '../../../services/contractService';
import NFTCard from '../../../components/shared/NFTCard';

const ListedNFTs = ({ walletAddress }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchListings();
  }, [walletAddress]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError('');
      const userListings = await contractService.getUserListings(walletAddress);
      setListings(userListings);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to fetch your listings');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlist = async (nftContract, tokenId) => {
    try {
      setLoading(true);
      await contractService.unlistNFT(nftContract, tokenId, walletAddress);
      await fetchListings(); // Refresh listings
    } catch (err) {
      console.error('Error unlisting NFT:', err);
      setError('Failed to unlist NFT');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading your listings...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">You haven't listed any NFTs yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((nft) => (
        <NFTCard
          key={`${nft.nftContract}-${nft.tokenId}`}
          nft={nft}
          onUnlist={() => handleUnlist(nft.nftContract, nft.tokenId)}
          showUnlist={true}
        />
      ))}
    </div>
  );
};

export default ListedNFTs;
