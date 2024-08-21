import { Button } from 'design-system/button';
import { useToggle } from 'development-kit/use-toggle';
import React, { lazy, Suspense } from 'react';
import { BiCheck, BiCopyAlt } from 'react-icons/bi';
import { useCopy } from 'development-kit/use-copy';

const TemplatesPopoverContent = lazy(
  () => import(`./templates-popover-content`),
);

const TemplatesPopover = () => {
  const menu = useToggle();
  const [copyState, copy] = useCopy();

  const copyAndClose = (content: string): void => {
    copy(content);
    menu.close();
  };

  return (
    <>
      <Button i={1} s={2} title="Use markdown templates" onClick={menu.toggle}>
        {copyState.is === `copied` ? (
          <BiCheck className="text-green-700" />
        ) : (
          <BiCopyAlt />
        )}
      </Button>
      {menu.opened && (
        <Suspense>
          <TemplatesPopoverContent onCopy={copyAndClose} onClose={menu.close} />
        </Suspense>
      )}
    </>
  );
};

export default TemplatesPopover;
