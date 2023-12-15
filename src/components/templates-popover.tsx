import { Button } from 'design-system/button';
import { useToggle } from 'development-kit/use-toggle';
import React from 'react';
import { BiCopyAlt } from 'react-icons/bi';
import { useCopy } from 'development-kit/use-copy';

const TemplatesPopoverContent = React.lazy(
  () => import(`./templates-popover-content`),
);

const TemplatesPopover: React.FC = () => {
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
        <BiCopyAlt className="text-2xl" />
      </Button>
      {menu.opened && (
        <React.Suspense>
          <TemplatesPopoverContent onCopy={handleCopy} onClose={menu.close} />
        </React.Suspense>
      )}
    </>
  );
};

export default TemplatesPopover;
