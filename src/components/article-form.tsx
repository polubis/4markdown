import React, { useState } from 'react';
import Filter from 'components/filter';
import Search from './search';
import { BiSearch } from 'react-icons/bi';
import { Button } from 'design-system/button';

function ArticleForm({ query, onQueryChange, status, limit }) {
  return (
    <form className="flex gap-4 items-end">
      {/* 
      <Search query={query} onQueryChange={onQueryChange} /> */}

      <Search query={query} setQuery={(query) => onQueryChange({ query })} />

      <Filter
        option={status}
        onQueryChange={onQueryChange}
        setOption={(status) => onQueryChange({ status })}
        label={`Article state`}
      >
        <option value={`public`}>Public</option>
        <option value={`accepted`}>Accepted</option>
        <option value={`review`}>To review</option>
      </Filter>
      <Filter
        option={limit}
        setOption={(limit) => onQueryChange({ limit })}
        label={`Articles limit`}
      >
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </Filter>
    </form>
  );
}

export default ArticleForm;
