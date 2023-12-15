import { Button } from 'design-system/button';
import { useToggle } from 'development-kit/use-toggle';
import React from 'react';
import { BiPlus, BiSave } from 'react-icons/bi';
import { useDocStore } from 'store/doc/doc.store';

const AddDocPopoverContent = React.lazy(
  () => import(`./add-doc-popover-content`),
);

const AddDocPopover: React.FC = () => {
  const menu = useToggle();
  const docStore = useDocStore();

  return (
    <>
      <Button i={2} rfull title="Create new document" onClick={menu.toggle}>
        {docStore.is === `active` ? (
          <BiSave className="text-2xl" />
        ) : (
          <BiPlus className="text-2xl" />
        )}
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
