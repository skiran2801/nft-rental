import React from 'react';
import { Search } from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Browse Available NFTs</h1>
          <p className="text-xl mb-8">
            Discover and rent unique NFTs from our growing collection
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search NFTs..."
                className="w-full px-6 py-4 rounded-lg text-gray-900 bg-white/90 backdrop-blur-sm"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;