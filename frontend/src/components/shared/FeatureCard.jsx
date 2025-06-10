import React from 'react';

const FeatureCard = ({ icon: Icon, title, description }) => {
 return (
   <div className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all">
     <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
       <Icon className="w-6 h-6 text-blue-600" />
     </div>
     <h3 className="text-xl font-bold mb-2">{title}</h3>
     <p className="text-gray-600">{description}</p>
   </div>
 );
};

export default FeatureCard;