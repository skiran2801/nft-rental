import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Grid, Shield, Users, DollarSign, Clock } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto pt-16 pb-8 px-4">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Welcome to Smart Contract-Driven NFT Rental Marketplace
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Rent and lend NFTs securely through smart contracts
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/browse"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Start Browsing
              </Link>
              <Link
                to="/list"
            className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                List Your NFT
              </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Wallet className="h-8 w-8" />,
                title: 'Connect Wallet',
                description: 'Link your Web3 wallet to start renting or listing NFTs'
              },
              {
                icon: <Grid className="h-8 w-8" />,
                title: 'Browse or List',
                description: 'Find NFTs to rent or list your own collection'
              },
              {
                icon: <Clock className="h-8 w-8" />,
                title: 'Start Using',
                description: 'Enjoy temporary access to exclusive NFTs'
              }
            ].map((step, index) => (
              <div 
                  key={index}
                className="flex flex-col items-center text-center hover:transform hover:scale-105 transition-transform duration-300"
                >
                <div className="bg-blue-100 p-4 rounded-full text-blue-600 mb-4 hover:bg-blue-200 transition-colors">
                  {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Contracts Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Understanding Smart Contracts
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">What are Smart Contracts?</h3>
              </div>
              <p className="text-gray-600">
                Smart contracts are self-executing programs stored on a blockchain that automatically execute when predetermined conditions are met. They act as digital agreements that are:
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start text-gray-600">
                  <span className="text-blue-600 mr-2">•</span>
                  Immutable - cannot be changed once deployed
                </li>
                <li className="flex items-start text-gray-600">
                  <span className="text-blue-600 mr-2">•</span>
                  Transparent - code and execution are visible to all
                </li>
                <li className="flex items-start text-gray-600">
                  <span className="text-blue-600 mr-2">•</span>
                  Decentralized - run on blockchain network
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">How They Work in NFT Rentals</h3>
              </div>
              <p className="text-gray-600">
                In our NFT rental marketplace, smart contracts handle the entire rental process:
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start text-gray-600">
                  <span className="text-purple-600 mr-2">•</span>
                  Automatically verify NFT ownership and availability
                </li>
                <li className="flex items-start text-gray-600">
                  <span className="text-purple-600 mr-2">•</span>
                  Process rental payments and escrow funds
                </li>
                <li className="flex items-start text-gray-600">
                  <span className="text-purple-600 mr-2">•</span>
                  Manage temporary NFT transfers
                </li>
                <li className="flex items-start text-gray-600">
                  <span className="text-purple-600 mr-2">•</span>
                  Enforce rental duration and return conditions
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 p-8 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold text-center mb-6 text-blue-600">The Rental Process</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-white p-4 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-blue-600 font-bold">1</div>
                <p className="text-gray-600">User selects NFT and rental duration</p>
              </div>
              <div className="text-center">
                <div className="bg-white p-4 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-blue-600 font-bold">2</div>
                <p className="text-gray-600">Smart contract verifies conditions</p>
              </div>
              <div className="text-center">
                <div className="bg-white p-4 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-blue-600 font-bold">3</div>
                <p className="text-gray-600">Payment processed and NFT transferred</p>
              </div>
              <div className="text-center">
                <div className="bg-white p-4 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-blue-600 font-bold">4</div>
                <p className="text-gray-600">NFT automatically returns after duration</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About NFTs and Decentralization */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Understanding NFTs and Our Marketplace
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* What are NFTs? */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">What are NFTs?</h3>
              </div>
              <p className="text-gray-600 mb-4">
                NFTs (Non-Fungible Tokens) are unique digital assets that represent ownership of specific items, such as:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Digital art and collectibles
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Virtual real estate
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Game items and characters
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Music and media content
                </li>
              </ul>
            </div>

            {/* Why Decentralized? */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Why Decentralized?</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Our platform operates on blockchain technology, offering several advantages:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  No central authority controlling transactions
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Transparent and secure rental agreements
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Direct peer-to-peer interactions
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Smart contracts ensuring fair terms
                </li>
              </ul>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Frequently Asked Questions
            </h3>
            <div className="space-y-6">
              {[
                {
                  question: "How do I rent an NFT?",
                  answer: "Simply connect your wallet, browse available NFTs, and select the rental duration. The smart contract will handle the transaction automatically."
                },
                {
                  question: "Can I list my NFT for rent?",
                  answer: "Yes! Connect your wallet, go to the List page, and set your rental terms. Your NFT will be available for others to rent while you earn passive income."
                },
                {
                  question: "Is it safe to rent NFTs?",
                  answer: "Absolutely! Our smart contracts ensure secure transactions, and the blockchain provides transparent tracking of all rental agreements."
                }
              ].map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                >
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-lg">{faq.question}</h4>
                  </div>
                  <p className="text-gray-600 mt-3 ml-12">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8">
            Join our community and start exploring the world of NFT rentals today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/browse"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition"
            >
              Browse NFTs
            </Link>
            <Link
              to="/list"
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-blue-700 transition"
            >
              List Your NFT
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;