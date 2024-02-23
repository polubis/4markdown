import { Button } from 'design-system/button';
import { useToggle } from 'development-kit/use-toggle';
import React from 'react';
import { BiCheck, BiCopyAlt } from 'react-icons/bi';
import { useCopy } from 'development-kit/use-copy';
import { useFileInput } from 'development-kit/use-file-input';

const TemplatesPopoverContent = React.lazy(
  () => import(`./templates-popover-content`),
);

const TemplatesPopover: React.FC = () => {
  const menu = useToggle();
  const [copyState, copy] = useCopy();

  const copyAndClose = (content: string): void => {
    copy(content);
    menu.close();
  };

  const [upload] = useFileInput({
    accept: `image/png, image/jpeg, image/jpg`,
    multiple: true,
    onChange: (e) => {
      console.log(e);
    },
    onError: () => {
      console.log(`Invalid`);
    },
  });

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
        <React.Suspense>
          <TemplatesPopoverContent
            onCopy={copyAndClose}
            onClose={menu.close}
            onUploadImageClick={upload}
          />
        </React.Suspense>
      )}
    </>
  );
};

export default TemplatesPopover;
