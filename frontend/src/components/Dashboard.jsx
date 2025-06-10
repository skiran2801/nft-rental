import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import contractService from '../services/contractService';
import walletService from '../services/walletService';

function Dashboard() {
  const [listings, setListings] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get the connected account
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (!accounts || accounts.length === 0) {
          setError('Please connect your wallet to view your dashboard');
          setLoading(false);
          return;
        }
        
        const userAccount = accounts[0];
        setAccount(userAccount);
        
        console.log('Fetching listings for account:', userAccount);
        
        // Initialize contract service first
        await contractService.ensureInitialized();
        
        // Fetch user listings
        const userListings = await contractService.getUserListings(userAccount);
        console.log('Retrieved user listings:', userListings);
        
        setListings(userListings);
        setRentals([]); // Will implement rentals later
        setError(null);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load your NFT data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    init();
    
    // Listen for account changes
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          init(); // Reload data when account changes
        } else {
          setAccount(null);
          setListings([]);
          setRentals([]);
          setError('Please connect your wallet to view your dashboard');
        }
      };
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  const formatPrice = (weiAmount) => {
    if (!weiAmount) return '0 ETH';
    return `${contractService.weiToEth(weiAmount)} ETH`;
  };

  const handleUnlist = async (listing) => {
    try {
      // Get the connected account
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      
      await contractService.unlistNFT(
        listing.nftContract,
        listing.tokenId,
        account
      );
      
      alert('NFT unlisted successfully!');
      // Refresh listings
      window.location.reload();
    } catch (error) {
      console.error('Error unlisting NFT:', error);
      alert(`Failed to unlist NFT: ${error.message}`);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Your Dashboard</h2>
      
      {loading && <p>Loading your NFTs...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      {!loading && account && (
        <div className="alert alert-info">
          Connected Account: {account}
        </div>
      )}
      
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>Your Listed NFTs</h3>
            </div>
            <div className="card-body">
              {listings.length === 0 ? (
                <div className="text-center">
                  <p>You haven't listed any NFTs yet.</p>
                  <Link to="/create" className="btn btn-primary">
                    List an NFT
                  </Link>
                </div>
              ) : (
                <div className="row">
                  {listings.map((listing) => (
                    <div key={`${listing.nftContract}-${listing.tokenId}`} className="col-md-6 mb-3">
                      <div className="card h-100">
                        {listing.imageUrl ? (
                          <img 
                            src={listing.imageUrl} 
                            className="card-img-top" 
                            alt={listing.metadata?.name || `NFT #${listing.tokenId}`}
                            onError={(e) => {
                              console.error('Image failed to load:', e.target.src);
                              e.target.src = '/assets/placeholder.png';
                              e.target.onerror = null;
                            }}
                            style={{ height: '150px', objectFit: 'contain' }}
                          />
                        ) : (
                          <div className="card-img-top d-flex justify-content-center align-items-center bg-light" style={{height: '150px'}}>
                            <img 
                              src="/assets/placeholder.png" 
                              alt="Placeholder" 
                              style={{ height: '100px', objectFit: 'contain' }}
                            />
                          </div>
                        )}
                        <div className="card-body">
                          <h5 className="card-title">{listing.metadata?.name || `NFT #${listing.tokenId}`}</h5>
                          <p className="card-text">Price: {formatPrice(listing.pricePerDay)}/day</p>
                          <button 
                            className="btn btn-sm btn-danger" 
                            onClick={() => handleUnlist(listing)}
                          >
                            Unlist
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>Your Rented NFTs</h3>
            </div>
            <div className="card-body">
              {rentals.length === 0 ? (
                <div className="text-center">
                  <p>You haven't rented any NFTs yet.</p>
                  <Link to="/browse" className="btn btn-primary">
                    Browse NFTs
                  </Link>
                </div>
              ) : (
                <div className="list-group">
                  {rentals.map((rental) => (
                    <div key={`${rental.nftContract}-${rental.tokenId}`} className="list-group-item">
                      <h5>{rental.metadata?.name || `NFT #${rental.tokenId}`}</h5>
                      <p>Rented until: {new Date(rental.endTime * 1000).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 