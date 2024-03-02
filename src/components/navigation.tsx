import React from 'react';
import Filters from 'components/filters';
import Search from './search';

function Navigation() {
  return (
    <div className="flex  gap-4 items-end">
      <Search />
      <Filters />
    </div>
  );
}

export default Navigation;
