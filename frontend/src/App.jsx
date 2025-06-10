import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import walletService from './services/walletService';
import { checkEnvVariables } from './utils/env';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import { NETWORKS } from './utils/networkConfig';

// Import pages
import Home from './pages/Home';
import Browse from './pages/Browse';
import List from './pages/List';
import Dashboard from './pages/Dashboard';

const App = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    // Check if wallet was previously connected
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          // Check if we're already connected
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setIsWalletConnected(true);
            walletService.address = accounts[0];
          }

          // Listen for account changes
          window.ethereum.on('accountsChanged', handleAccountsChanged);
          // Listen for chain changes
          window.ethereum.on('chainChanged', handleChainChanged);
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkWalletConnection();

    // Cleanup listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // User disconnected wallet
      setIsWalletConnected(false);
      setWalletAddress('');
      walletService.address = null;
    } else {
      // User switched account
      setWalletAddress(accounts[0]);
      setIsWalletConnected(true);
      walletService.address = accounts[0];
    }
  };

  const handleChainChanged = () => {
    // Reload the page when chain changes
    window.location.reload();
  };

  const connectWallet = async () => {
    try {
      const address = await walletService.connect();
      setWalletAddress(address);
      setIsWalletConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setIsWalletConnected(false);
      setWalletAddress('');
      // Show user-friendly error message
      alert(error.message || 'Failed to connect wallet. Please make sure MetaMask is installed and try again.');
    }
  };

  const disconnectWallet = async () => {
    try {
      await walletService.disconnect();
      setIsWalletConnected(false);
      setWalletAddress('');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  useEffect(() => {
    try {
      checkEnvVariables();
    } catch (error) {
      console.error('Environment setup error:', error);
    }
  }, []);

  // Add network change handler
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', async (chainId) => {
        if (chainId !== NETWORKS.hardhat.chainId) {
          try {
            await walletService.checkAndSwitchNetwork();
          } catch (error) {
            console.error('Network switch error:', error);
            setIsWalletConnected(false);
            setWalletAddress('');
          }
        }
      });
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar 
          isWalletConnected={isWalletConnected}
          walletAddress={walletAddress}
          onConnect={connectWallet}
          onDisconnect={disconnectWallet}
        />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home isWalletConnected={isWalletConnected} />} />
            <Route path="/browse" element={<Browse isWalletConnected={isWalletConnected} walletAddress={walletAddress} />} />
            <Route path="/list" element={
              <ErrorBoundary>
                <List isWalletConnected={isWalletConnected} />
              </ErrorBoundary>
            } />
            <Route path="/dashboard" element={<Dashboard isWalletConnected={isWalletConnected} walletAddress={walletAddress} />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;