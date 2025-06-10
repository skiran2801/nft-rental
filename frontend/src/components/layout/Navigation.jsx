// components/layout/Navigation.jsx
import React from 'react';
import { Home, Grid, Upload, LayoutDashboard } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab, isWalletConnected }) => {
   const navItems = [
       { id: 'home', icon: Home, label: 'Home' },
       { id: 'browse', icon: Grid, label: 'Browse' },
       { id: 'list', icon: Upload, label: 'List NFT' },
       { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', requiresWallet: true }
   ];

   return (
       <div className="flex gap-4 mb-6 bg-white p-2 rounded-xl shadow-md">
           {navItems.map(({ id, icon: Icon, label, requiresWallet }) => (
               (!requiresWallet || isWalletConnected) && (
                   <button
                       key={id}
                       onClick={() => setActiveTab(id)}
                       className={`px-6 py-3 rounded-lg font-medium transition-all ${
                           activeTab === id 
                               ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                               : 'hover:bg-gray-100'
                       }`}
                   >
                       <Icon className="w-5 h-5 inline-block mr-2" />
                       {label}
                   </button>
               )
           ))}
       </div>
   );
};

export default Navigation;