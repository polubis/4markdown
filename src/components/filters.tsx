import React, { useState } from 'react';

function Filters() {
  const [filter, setFilter] = useState(`public`);

  return (
    <div className="w-52 relative">
      <span className="absolute top-1/2 right-0 transform -translate-x-1/2 -translate-y-1/2">
        🔽
      </span>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="appearance-none w-full text-base px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 "
      >
        <option value={`public`}>Public</option>
        <option value={`accepted`}>Accepted</option>
        <option value={`review`}>To Review</option>
      </select>
    </div>
  );
}

export default Filters;
