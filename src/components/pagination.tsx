import React from 'react';
import { Button } from 'design-system/button';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';

function Pagination() {
  return (
    <div className="flex gap-8">
      <Button type="button" i={2} s={2} title="Go to previous page">
        <BiLeftArrow />
      </Button>
      <Button type="button" i={2} s={2} title="Go to next page">
        <BiRightArrow />
      </Button>
    </div>
  );
}

export default Pagination;
