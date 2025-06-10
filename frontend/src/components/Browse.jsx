import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import contractService from '../services/contractService';

function Browse() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [isRenting, setIsRenting] = useState(false);

  useEffect(() => {
    // Check if wallet is already connected
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          // Request account access if needed
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setWalletConnected(true);
            fetchListings();
          } else {
            setLoading(false);
            setError('Please connect your wallet to view NFT listings');
          }
        } catch (err) {
          console.error('Error checking wallet connection:', err);
          setLoading(false);
          setError('Error checking wallet connection. Please refresh and try again.');
        }
      } else {
        setLoading(false);
        setError('Ethereum wallet not detected. Please install MetaMask or another web3 provider.');
      }
    };

    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('Ethereum wallet not detected. Please install MetaMask or another web3 provider.');
      return;
    }

    try {
      setLoading(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        setWalletConnected(true);
        setError(null);
        await fetchListings();
      } else {
        setError('No accounts found. Please check your wallet and try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet: ' + err.message);
      setLoading(false);
    }
  };

  const fetchListings = async () => {
    try {
      setLoading(true);
      const activeListings = await contractService.getActiveListings();
      console.log('Active listings in component:', activeListings);
      setListings(activeListings);
      setError(null);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to load listings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (weiAmount) => {
    if (!weiAmount) return '0 ETH';
    try {
      return `${contractService.weiToEth(weiAmount)} ETH`;
    } catch (error) {
      console.warn('Error converting price:', error);
      // Fallback conversion if contractService fails
      const tempWeb3 = new Web3(window.ethereum || 'http://localhost:8545');
      return `${tempWeb3.utils.fromWei(weiAmount.toString(), 'ether')} ETH`;
    }
  };

  const handleRent = async (listing) => {
    if (isRenting) return; // Prevent multiple clicks
    
    try {
      setIsRenting(true);
      
      console.log("Attempting to rent NFT:", {
        nftContract: listing.nftContract,
        tokenId: listing.tokenId,
        isActive: listing.isActive,
        pricePerDay: listing.pricePerDay,
        maxDuration: listing.maxDuration
      });
      
      // Get the connected account
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      console.log("Current account:", account);
      
      // Use a fixed rental duration (1 day) for simplicity
      const rentalDays = 1;
      console.log("Rental duration:", rentalDays);
      
      // Call the rent function
      console.log("Calling contractService.rentNFT...");
      const result = await contractService.rentNFT(
        listing.nftContract,
        listing.tokenId,
        rentalDays,
        account
      );
      
      console.log("Rental transaction successful:", result);
      alert('NFT rented successfully!');
      // Refresh listings
      window.location.reload();
    } catch (error) {
      console.error('Error renting NFT:', error);
      alert(`Failed to rent NFT: ${error.message}`);
    } finally {
      setIsRenting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Available NFTs for Rent</h2>
      
      {!walletConnected && (
        <div className="alert alert-warning">
          <p>You need to connect your wallet to view and rent NFTs.</p>
          <button onClick={connectWallet} className="btn btn-primary">
            Connect Wallet
          </button>
        </div>
      )}
      
      {loading && <p>Loading NFTs...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      {walletConnected && !loading && listings.length === 0 && !error && (
        <p>No NFTs available for rent at the moment.</p>
      )}
      
      <div className="row">
        {listings.map((listing, index) => (
          <div key={`${listing.nftContract}-${listing.tokenId}`} className="col-md-4 mb-4">
            <div className="card">
              {/* Image with fallback */}
              {listing.imageUrl ? (
                <img 
                  src={listing.imageUrl} 
                  className="card-img-top" 
                  alt={listing.metadata?.name || `NFT #${listing.tokenId}`}
                  onError={(e) => {
                    console.error(`Failed to load image: ${listing.imageUrl}`);
                    e.target.src = '/placeholder.png';
                    e.target.onerror = null; // Prevent infinite loop
                  }}
                  style={{ height: '250px', objectFit: 'contain' }}
                />
              ) : (
                <div className="card-img-top d-flex justify-content-center align-items-center bg-light" style={{height: '250px'}}>
                  <span>No image available</span>
                </div>
              )}
              
              <div className="card-body">
                <h5 className="card-title">
                  {listing.metadata?.name || `NFT #${listing.tokenId}`}
                </h5>
                <p className="card-text">
                  {listing.metadata?.description || 'No description available'}
                </p>
                <ul className="list-group list-group-flush mb-3">
                  <li className="list-group-item">
                    <strong>Price:</strong> {formatPrice(listing.pricePerDay)} per day
                  </li>
                  <li className="list-group-item">
                    <strong>Max Duration:</strong> {listing.maxDuration} days
                  </li>
                  <li className="list-group-item">
                    <strong>Available:</strong> {listing.isActive ? 'Yes' : 'No'}
                  </li>
                </ul>
                <button 
                  className="btn btn-primary w-100" 
                  onClick={() => handleRent(listing)}
                  disabled={!listing.isActive}
                >
                  Rent Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Browse; 