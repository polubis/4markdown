import { Button } from 'design-system/button';

import React from 'react';
import { BiSearch } from 'react-icons/bi';
import { useSimpleFeature } from '@greenonsoftware/react-kit';

const SearchPopoverContent = React.lazy(
  () => import(`./search-popover-content`),
);

const SearchPopover = ({ className }: { className?: string }) => {
  const menu = useSimpleFeature();

  const handleClick = () => {
    menu.on();
  };

  return (
    <>
      <Button
        i={1}
        s={2}
        className={className}
        title={`Search`}
        onClick={handleClick}
      >
        <BiSearch />
      </Button>
      {menu.isOn && (
        <React.Suspense>
          <SearchPopoverContent onClose={menu.off} />
        </React.Suspense>
      )}
    </>
  );
};

export default SearchPopover;
