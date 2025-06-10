import React from 'react';
import { Wallet, Grid, Sparkles } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    { Icon: Wallet, title: 'Connect Wallet', desc: 'Link your Web3 wallet to start renting or listing NFTs' },
    { Icon: Grid, title: 'Browse or List', desc: 'Find NFTs to rent or list your own collection' },
    { Icon: Sparkles, title: 'Start Using', desc: 'Enjoy temporary access to exclusive NFTs' }
  ];

  return (
    <div className="space-y-12">
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
        How It Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {steps.map((item, i) => (
          <div key={i} className="text-center space-y-4 p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:translate-y-[-8px]">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center mx-auto">
              <item.Icon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-xl">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;