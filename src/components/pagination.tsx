import React, { useEffect, useState } from 'react';
import { Button } from 'design-system/button';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';

function Pagination({ responseCount, limit, page, onPageChange }) {
  const pageCount = responseCount > 0 ? Math.ceil(responseCount / limit) : 0;

  function handleNextPage() {
    page !== pageCount && onPageChange({ page: page + 1 });
  }

  function handlePreviousPage() {
    page > 1 && onPageChange({ page: page - 1 });
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
