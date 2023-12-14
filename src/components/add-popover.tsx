import { Button } from 'design-system/button';
import { useToggle } from 'development-kit/use-toggle';
import React from 'react';
import { BiCopyAlt, BiX } from 'react-icons/bi';
import { useCopy } from 'development-kit/use-copy';

const AddPopoverContent = React.lazy(() => import(`./add-popover-content`));

const AddPopover: React.FC = () => {
  const menu = useToggle();
  const [copyState, copy] = useCopy();

  const handleCopy = (content: string): void => {
    copy(content);
    menu.close();
  };

  return (
    <>
      <Button
        i={2}
        rfull
        title="Use markdown templates"
        overlay={copyState.is === `copied` ? `Copied` : undefined}
        onClick={menu.toggle}
      >
        {menu.opened ? (
          <BiX className="text-2xl" />
        ) : (
          <BiCopyAlt className="text-2xl" />
        )}
      </Button>
      {menu.opened && (
        <React.Suspense>
          <AddPopoverContent onCopy={handleCopy} onClose={menu.close} />
        </React.Suspense>
      )}
    </>
  );
};

export default AddPopover;
