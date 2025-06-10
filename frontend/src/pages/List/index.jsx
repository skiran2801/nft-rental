import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingForm from './components/ListingForm';
import Hero from './components/Hero';
import walletService from '../../services/walletService';
import contractService from '../../services/contractService';
import Web3 from 'web3';
import storageService from '../../services/storageService';
import { testEnvVariables } from '../../utils/env';

const ListPage = ({ isWalletConnected }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const envVars = testEnvVariables();
    console.log('Environment variables loaded:', envVars);
  }, []);

  useEffect(() => {
    const initializeServices = async () => {
      try {
        setError('');
        console.log('Initializing services...');

        if (window.ethereum && isWalletConnected) {
          await contractService.init(window.ethereum);
        }

        if (isWalletConnected) {
          const maxRetries = 3;
          let currentRetry = 0;

          const attemptConnection = async (attempt) => {
            try {
              await storageService.initialize();
              console.log('Storage service initialized successfully');
              return true;
            } catch (error) {
              console.warn(`Storage initialization attempt ${attempt + 1} failed:`, error);
              if (attempt === maxRetries - 1) {
                setError('Warning: Storage service not available. Please check your connection and try again.');
                return false;
              }
              await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
              return false;
            }
          };

          while (currentRetry < maxRetries) {
            const success = await attemptConnection(currentRetry);
            if (success) break;
            currentRetry++;
          }
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Initialization error:', error);
        setError(`Initialization failed: ${error.message}`);
        setIsInitialized(true);
      }
    };

    initializeServices();
  }, [isWalletConnected]);

  const handleSubmit = async (formData) => {
    if (!isWalletConnected) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      const account = walletService.getAddress();
      if (!account) {
        throw new Error('No wallet address found');
      }

      console.log('Starting NFT creation process...');

      setUploadStatus('Uploading image to IPFS...');
      const imageCid = await contractService.uploadToIPFS(formData.image);

      setUploadStatus('Creating NFT metadata...');
      const metadata = {
        name: formData.name,
        description: formData.description,
        image: storageService.getIPFSUrl(imageCid, formData.image.name),
        attributes: [
          {
            trait_type: 'Minimum Duration',
            value: formData.minDuration
          },
          {
            trait_type: 'Maximum Duration',
            value: formData.maxDuration
          }
        ]
      };
      
      console.log('NFT Metadata being created:', metadata);
      console.log('Image URL in metadata:', metadata.image);

      const metadataCid = await contractService.uploadMetadataToIPFS(metadata);
      console.log('Metadata CID:', metadataCid);

      setUploadStatus('Creating your NFT...');
      const tokenId = await contractService.mintNFT(account, metadataCid);

      setUploadStatus('Listing your NFT...');
      const priceInWei = Web3.utils.toWei(formData.pricePerDay.toString(), 'ether');
      await contractService.listNFT(
        process.env.REACT_APP_NFT_CONTRACT_ADDRESS,
        tokenId,
        priceInWei,
        formData.maxDuration,
        account
      );

      setSuccess(true);
      console.log('NFT listed successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating and listing NFT:', error);
      setError(error.message || 'Failed to create and list NFT. Please try again.');
    } finally {
      setLoading(false);
      setUploadStatus('');
    }
  };

  if (!isInitialized) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Hero />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Create and List Your NFT
          </h2>
          <p className="text-gray-600 mt-2">
            Fill in the details below to create your NFT and list it for rent.
          </p>
        </div>

        {!isWalletConnected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <p className="text-yellow-700">
              Please connect your wallet to create and list your NFT.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <p className="text-green-700">
              Your NFT has been created and listed successfully!
            </p>
          </div>
        )}

        <ListingForm
          onSubmit={handleSubmit}
          loading={loading}
          uploadStatus={uploadStatus}
          isWalletConnected={isWalletConnected}
        />
      </div>
    </div>
  );
};

export default ListPage;