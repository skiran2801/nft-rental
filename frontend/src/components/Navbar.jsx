import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Navbar = ({ isWalletConnected, walletAddress, onConnect, onDisconnect }) => {
  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">NFT Rental</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/browse" className="nav-link">Browse</Link>
              <Link to="/list" className="nav-link">List NFT</Link>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            </div>
          </div>

          <div className="flex items-center">
            {isWalletConnected ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
                  {shortenAddress(walletAddress)}
                </span>
                <button
                  onClick={onDisconnect}
                  className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                  title="Disconnect wallet"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={onConnect}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 