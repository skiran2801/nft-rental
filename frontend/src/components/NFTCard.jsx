import React, { useState, useEffect } from 'react';
import contractService from '../services/contractService';

const NFTCard = ({ nft, onRent, onUnlist }) => {
  const [currentGatewayIndex, setCurrentGatewayIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  
  // Add headers for Pinata gateway authentication
  const pinataHeaders = {
    headers: {
      'x-pinata-gateway-token': 'rYtjz8bbKJhdMZD7FcsBKV_juSZxrHEbsEMiaCPi19H4Re5UeHW5RBVg0iEvTTzt'
    }
  };

  useEffect(() => {
    const ipfsUrl = nft.metadata?.image || nft.imageUrl;
    if (!ipfsUrl) {
      console.error('No image URL found in metadata');
      return;
    }

    console.log('Full IPFS URL:', ipfsUrl);
    
    // Extract IPFS hash more carefully
    let ipfsHash = ipfsUrl;
    if (ipfsUrl.startsWith('ipfs://')) {
      ipfsHash = ipfsUrl.substring(7); // Remove just the 'ipfs://' prefix
    } else if (ipfsUrl.includes('/ipfs/')) {
      ipfsHash = ipfsUrl.split('/ipfs/')[1];
    }

    console.log('Extracted IPFS hash/path:', ipfsHash);

    // Create URL with authentication using the exact format
    const pinataUrl = `https://amethyst-abundant-chinchilla-818.mypinata.cloud/ipfs/${ipfsHash}?pinataGatewayToken=rYtjz8bbKJhdMZD7FcsBKV_juSZxrHEbsEMiaCPi19H4Re5UeHW5RBVg0iEvTTzt`;
    setImageUrl(pinataUrl);
  }, [nft]);

  const handleImageError = () => {
    const ipfsUrl = nft.metadata?.image || nft.imageUrl;
    if (!ipfsUrl) return;

    let ipfsHash = ipfsUrl.startsWith('ipfs://') 
      ? ipfsUrl.substring(7)
      : ipfsUrl;

    // Use public gateways as fallback
    const publicGateways = [
      'https://ipfs.io/ipfs',
      'https://gateway.pinata.cloud/ipfs',
      'https://cloudflare-ipfs.com/ipfs',
      'https://dweb.link/ipfs'
    ];

    const nextIndex = currentGatewayIndex;
    if (nextIndex < publicGateways.length) {
      const nextUrl = `${publicGateways[nextIndex]}/${ipfsHash}`;
      console.log('Trying public gateway:', nextUrl);
      setCurrentGatewayIndex(nextIndex + 1);
      setImageUrl(nextUrl);
    } else {
      // Fallback to SVG placeholder
      setImageUrl('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiIHJ5PSIyIj48L3JlY3Q+PGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiPjwvY2lyY2xlPjxwb2x5bGluZSBwb2ludHM9IjIxIDE1IDE2IDEwIDUgMjEiPjwvcG9seWxpbmU+PC9zdmc+');
    }
  };

  // Add this console log to check the metadata
  console.log('NFT Metadata:', {
    metadata: nft.metadata,
    image: nft.metadata?.image,
    imageUrl: nft.imageUrl
  });

  return (
    <div className="nft-card">
      <img 
        src={imageUrl} 
        alt={nft.metadata?.name || `NFT #${nft.tokenId}`}
        onError={handleImageError}
        style={{ maxWidth: '100%', height: 'auto', minHeight: '200px', objectFit: 'contain' }}
      />
      <div className="nft-info">
        <h3>{nft.metadata?.name || `NFT #${nft.tokenId}`}</h3>
        <p>{nft.metadata?.description || 'No description available'}</p>
        {onRent && (
          <button onClick={() => onRent(nft)}>Rent</button>
        )}
        {onUnlist && (
          <button onClick={() => onUnlist(nft)}>Unlist</button>
        )}
      </div>
    </div>
  );
};

export default NFTCard; 