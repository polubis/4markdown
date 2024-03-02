import React from 'react';
import Filters from 'components/filters';
import Search from './search';
import { BiSearch } from 'react-icons/bi';
import { Button } from 'design-system/button';

function Navigation() {
  return (
    <div className="flex gap-4 items-end">
      <Search />
      <Filters />
      <Button auto type="button" i={2} s={2} title="Go to previous page">
        <BiSearch />
      </Button>
    </div>
  );
}

export default Navigation;
