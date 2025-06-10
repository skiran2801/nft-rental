import React, { useState } from 'react';
import { DollarSign, Clock, X, Check } from 'lucide-react';
import contractService from '../../services/contractService';

const NFTModal = ({ nft, onClose, formattedPrice }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">{nft.metadata?.name || 'Unnamed NFT'}</h2>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <img 
                        src={nft.imageUrl}
                        alt={nft.metadata?.name}
                        className="w-full h-[300px] object-cover rounded-xl mb-6"
                    />
                    
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                            <p className="text-gray-600">
                                {nft.metadata?.description || 'No description available'}
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500">Price per Day</p>
                                    <p className="font-medium">{formattedPrice}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500">Maximum Duration</p>
                                    <p className="font-medium">{nft.maxDuration} days</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500">Contract Address</p>
                                    <p className="font-medium truncate">{nft.nftContract}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500">Token ID</p>
                                    <p className="font-medium">{nft.tokenId}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RentalConfirmationModal = ({ nft, onClose, onConfirm, formattedPrice }) => {
    const [duration, setDuration] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleRent = async () => {
        try {
            setIsProcessing(true);
            setError(null);
            await onConfirm(duration);
            // Show success message before closing
            setTimeout(() => onClose(), 2000);
        } catch (err) {
            setError(err.message || 'Failed to rent NFT. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Rent NFT</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full"
                        disabled={isProcessing}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium mb-2">Rental Duration (days)</h3>
                        <input 
                            type="number"
                            min="1"
                            max={nft.maxDuration}
                            value={duration}
                            onChange={(e) => setDuration(Math.min(Number(e.target.value), nft.maxDuration))}
                            className="w-full px-4 py-2 border rounded-lg"
                            disabled={isProcessing}
                        />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between mb-2">
                            <span>Price per day:</span>
                            <span>{formattedPrice}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                            <span>Total price:</span>
                            <span>{`${contractService.weiToEth(nft.pricePerDay * duration)} ETH`}</span>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleRent}
                        disabled={isProcessing}
                        className={`w-full py-3 rounded-xl font-medium flex items-center justify-center ${
                            isProcessing 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                        }`}
                    >
                        {isProcessing ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Processing...
                            </>
                        ) : (
                            'Confirm Rental'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

const NFTCard = ({ nft, isWalletConnected, onRent, walletAddress }) => {
    const [showModal, setShowModal] = useState(false);
    const [showRentalModal, setShowRentalModal] = useState(false);
    const [rentalSuccess, setRentalSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [imageError, setImageError] = useState(false);
    
    // Check if the current user is the owner of the NFT
    const isOwner = walletAddress && nft.owner && 
                    walletAddress.toLowerCase() === nft.owner.toLowerCase();

    // Format price from wei to ETH if needed
    const formattedPrice = nft.pricePerDay ? 
        `${contractService.weiToEth(nft.pricePerDay)} ETH/day` : 
        nft.price;

    // Add a fallback image URL
    const fallbackImage = 'https://via.placeholder.com/300x300?text=No+Image';
    
    const handleImageError = () => {
        setImageError(true);
    };

    const handleRentClick = () => {
        setShowRentalModal(true);
    };

    const handleRentConfirm = async (duration) => {
        try {
            if (!nft.nftContract) {
                throw new Error('Invalid NFT contract address');
            }

            await onRent(nft, duration);
            setShowRentalModal(false);
            setRentalSuccess(true);
            setTimeout(() => setRentalSuccess(false), 3000);
        } catch (error) {
            setError(error.message || 'Failed to rent NFT. Please try again.');
        }
    };

   return (
        <>
            <div className="border rounded-xl p-6 hover:shadow-xl transition-all bg-white relative">
                {rentalSuccess && (
                    <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
                        <div className="text-center">
                            <div className="bg-green-100 rounded-full p-2 inline-block mb-2">
                                <Check className="w-6 h-6 text-green-600" />
                            </div>
                            <p className="text-green-600 font-medium">Successfully Rented!</p>
                        </div>
                    </div>
                )}

                <div 
                    className="cursor-pointer"
                    onClick={() => setShowModal(true)}
                >
                    <img 
                        src={imageError ? fallbackImage : (nft.imageUrl || fallbackImage)}
                        alt={nft.metadata?.name || 'NFT'}
                        onError={handleImageError}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-semibold mb-2">{nft.metadata?.name || 'Unnamed NFT'}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{nft.metadata?.description || 'No description available'}</p>
                </div>
           
           <div className="flex items-center gap-4 mb-4">
               <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg">
                   <DollarSign className="w-4 h-4 text-blue-500" />
                        <span className="text-blue-700">{formattedPrice}</span>
               </div>
               <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-lg">
                   <Clock className="w-4 h-4 text-purple-500" />
                        <span className="text-purple-700">{nft.maxDuration} days max</span>
               </div>
           </div>

                {isOwner ? (
                    <div className="w-full py-3 px-4 rounded-xl bg-gray-100 text-center text-gray-600">
                        You own this NFT
                    </div>
                ) : (
           <button 
                        onClick={handleRentClick}
                        disabled={!isWalletConnected || isOwner}
               className={`w-full py-3 rounded-xl font-medium ${
                            !isWalletConnected 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : isOwner
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                        }`}
                    >
                        {!isWalletConnected 
                            ? 'Connect Wallet to Rent' 
                            : isOwner 
                            ? 'Cannot Rent Your Own NFT'
                            : 'Rent Now'}
           </button>
                )}
       </div>

            {showModal && (
                <NFTModal 
                    nft={nft} 
                    onClose={() => setShowModal(false)} 
                    formattedPrice={formattedPrice}
                />
            )}

            {showRentalModal && (
                <RentalConfirmationModal 
                    nft={nft}
                    onClose={() => setShowRentalModal(false)}
                    onConfirm={handleRentConfirm}
                    formattedPrice={formattedPrice}
                />
            )}
        </>
   );
};

export default NFTCard;