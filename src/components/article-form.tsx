import React, { useState } from 'react';
import Filter from 'components/filter';
import Search from './search';
import { BiSearch } from 'react-icons/bi';
import { Button } from 'design-system/button';

function ArticleForm({
  query,
  setQuery,
  articleFilter,
  setArticleFilter,
  limit,
  setLimit,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    console.log(`cjik`);
  }
  return (
    <form className="flex gap-4 items-end" onSubmit={handleSubmit}>
      <Search query={query} setQuery={setQuery} />
      <Filter
        option={articleFilter}
        setOption={setArticleFilter}
        label={`Article state`}
      >
        <option value={`public`}>Public</option>
        <option value={`accepted`}>Accepted</option>
        <option value={`review`}>To review</option>
      </Filter>
      <Filter option={limit} setOption={setLimit} label={`Articles limit`}>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </Filter>
      <Button
        onClick={() => console.log(`hej`)}
        auto
        type="button"
        i={2}
        s={2}
        title="Go to previous page"
      >
        <BiSearch />
      </Button>
    </form>
  );
}

export default ArticleForm;
