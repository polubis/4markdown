import React, { useEffect, useState } from 'react';
import { Button } from 'design-system/button';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';

function Pagination({ articleInfoCount, limit, page, setPage }) {
  const pageCount =
    articleInfoCount > 0 ? Math.ceil(articleInfoCount / limit) : 0;

  useEffect(() => setPage(1), [limit, setPage]);

  function handleNextPage() {
    page === pageCount ? setPage(pageCount) : setPage((curr) => curr + 1);
  }

  function handlePreviousPage() {
    page === 1 ? setPage(1) : setPage((curr) => curr - 1);
  }

  return (
    <div className="flex gap-8 items-center">
      <Button
        onClick={handlePreviousPage}
        type="button"
        i={2}
        s={2}
        title="Go to previous page"
      >
        <BiLeftArrow />
      </Button>
      <span className="text-lg">{page}</span>
      <Button
        onClick={handleNextPage}
        type="button"
        i={2}
        s={2}
        title="Go to next page"
      >
        <BiRightArrow />
      </Button>
    </div>
  );
}

export default Pagination;
