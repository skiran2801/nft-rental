import React from 'react';

const Hero = ({ onBrowse, onList }) => {
 return (
   <div className="text-center space-y-8 py-16 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl">
     <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
       Rent & Share NFTs
     </h1>
     
     <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
       The first decentralized marketplace for NFT rentals. Monetize your NFTs or access exclusive assets without full ownership.
     </p>
     
     <div className="flex gap-4 justify-center">
       <button 
         onClick={onBrowse}
         className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transform transition-all hover:scale-105"
       >
         Start Browsing
       </button>
       
       <button 
         onClick={onList}
         className="bg-white hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold border-2 border-gray-100 shadow-lg transform transition-all hover:scale-105"
       >
         List Your NFT
       </button>
     </div>
   </div>
 );
};

export default Hero;