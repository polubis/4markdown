import React, { useEffect, useState } from 'react';
import { Button } from 'design-system/button';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';

function Pagination({ articleInfoCount, limit }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageCount =
    articleInfoCount > 0 ? Math.ceil(articleInfoCount / limit) : 0;

  useEffect(() => setCurrentPage(1), [limit]);

  function handleNextPage() {
    currentPage === pageCount
      ? setCurrentPage(pageCount)
      : setCurrentPage((curr) => curr + 1);
  }

  function handlePreviousPage() {
    currentPage === 1 ? setCurrentPage(1) : setCurrentPage((curr) => curr - 1);
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
      <span className="text-lg">{currentPage}</span>
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
