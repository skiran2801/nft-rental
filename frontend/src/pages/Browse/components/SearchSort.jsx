// components/Browse/SearchSort.jsx
import React from 'react';

const SearchSort = ({ onSearch, onSort }) => {
   return (
       <div className="flex gap-4">
           <input
               type="text"
               placeholder="Search NFTs..."
               onChange={(e) => onSearch(e.target.value)}
               className="px-6 py-2 border rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
           />
           <select 
               onChange={(e) => onSort(e.target.value)}
               className="px-6 py-2 border rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
           >
               <option value="">Sort by</option>
               <option value="price_asc">Price: Low to High</option>
               <option value="price_desc">Price: High to Low</option>
               <option value="duration">Duration</option>
           </select>
       </div>
   );
};

export default SearchSort;