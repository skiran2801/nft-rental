// components/layout/Header.jsx
import React from 'react';
import { Wallet, Coins } from 'lucide-react';

const Header = ({ isWalletConnected, walletBalance, handleWalletConnect, onLogoClick }) => {
   return (
       <div className="flex justify-between items-center mb-8 p-4 bg-white rounded-xl shadow-lg">
           <h1 
               className="text-3xl font-bold cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
               onClick={onLogoClick}
           >
               Smart Contract-Driven NFT Rental Marketplace
           </h1>
           
           <div className="flex items-center gap-4">
               {isWalletConnected && (
                   <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-blue-50 px-6 py-2 rounded-xl">
                       <Coins className="w-5 h-5 text-green-600" />
                       <span className="font-medium">{walletBalance} ETH</span>
                   </div>
               )}
               
               <button
                   onClick={handleWalletConnect}
                   className={`flex items-center gap-2 px-6 py-2 rounded-xl font-medium ${
                       isWalletConnected 
                           ? 'bg-green-500 text-white'
                           : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                   }`}
               >
                   <Wallet className="w-5 h-5" />
                   {isWalletConnected ? 'Connected' : 'Connect Wallet'}
               </button>
           </div>
       </div>
   );
};

export default Header;