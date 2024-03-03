import React, { useState } from 'react';
import Filters from 'components/filters';
import Search from './search';
import { BiSearch } from 'react-icons/bi';
import { Button } from 'design-system/button';

function Navigation({ handleArticleInfo }) {
  const [query, setQuery] = useState(``);
  const [filter, setFilter] = useState(`public`);

  return (
    <div className="flex gap-4 items-end">
      <Search query={query} setQuery={setQuery} />
      <Filters filter={filter} setFilter={setFilter} />
      <Button
        onClick={() => handleArticleInfo(query, filter)}
        auto
        type="button"
        i={2}
        s={2}
        title="Go to previous page"
      >
        <BiSearch />
      </Button>
    </div>
  );
}

export default Navigation;
