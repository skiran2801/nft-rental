import React from 'react';
import { Shield, Clock, DollarSign, Users } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure Transactions',
      description: 'All rentals are backed by smart contracts'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Flexible Duration',
      description: 'Rent for days, weeks, or months'
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: 'Best Prices',
      description: 'Competitive rates for all NFTs'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Verified Owners',
      description: 'All NFTs are from verified sources'
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Rent With Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div className="text-blue-600 mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
