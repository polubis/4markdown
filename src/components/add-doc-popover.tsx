import { Button } from 'design-system/button';
import { useToggle } from 'development-kit/use-toggle';
import React from 'react';
import { BiPlus } from 'react-icons/bi';

const AddDocPopoverContent = React.lazy(
  () => import(`./add-doc-popover-content`),
);

const AddDocPopover: React.FC = () => {
  const menu = useToggle();

  return (
    <>
      <Button i={2} rfull title="Create new document" onClick={menu.toggle}>
        <BiPlus className="text-2xl" />
      </Button>
      {menu.opened && (
        <React.Suspense>
          <AddDocPopoverContent onClose={menu.close} />
        </React.Suspense>
      )}
    </>
  );
};

export default AddDocPopover;
