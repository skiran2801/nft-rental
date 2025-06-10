import React from 'react';
import { Search, Wallet, Clock } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      title: 'Browse NFTs',
      description: 'Explore available NFTs for rent',
      icon: Search
    },
    {
      title: 'Select Duration',
      description: 'Choose how long you want to rent',
      icon: Clock
    },
    {
      title: 'Rent NFT',
      description: 'Complete the rental process securely',
      icon: Wallet
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Renting NFTs has never been easier
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative p-6 bg-gray-50 rounded-xl"
              >
                <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900 text-center">
                  {step.title}
                </h3>
                <p className="mt-2 text-gray-600 text-center">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;