import React from 'react';
import { Shield, Clock, Coins } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      title: 'Secure Rentals',
      description: 'Smart contracts ensure safe and transparent NFT rentals',
      icon: Shield
    },
    {
      title: 'Flexible Duration',
      description: 'Choose rental periods that suit your needs',
      icon: Clock
    },
    {
      title: 'Earn from Your NFTs',
      description: 'Generate passive income by renting out your NFTs',
      icon: Coins
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Why Choose NFT Rental?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Experience the benefits of our secure and flexible NFT rental platform
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="relative p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900 text-center">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-gray-600 text-center">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;