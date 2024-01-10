import React from 'react';
import { BiImage } from 'react-icons/bi';
import { Button } from 'design-system/button';
import { useToggle } from 'development-kit/use-toggle';
import UploadImagePopoverContent from './upload-image-popover-content';

const SS_ADD_REQUESTED_KEY = 'addRequested';

const UploadImagePopover: React.FC = () => {
  const menu = useToggle();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    menu.open();
  };

  React.useEffect(() => {
    const openRequested = !Number.isNaN(
      Number.parseInt(localStorage.getItem(SS_ADD_REQUESTED_KEY) ?? ''),
    );

    if (openRequested) {
      localStorage.removeItem(SS_ADD_REQUESTED_KEY);
      menu.open();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Button i={1} s={2} title="Upload image" onClick={handleClick}>
        <BiImage />
      </Button>
      {menu.opened && (
        <React.Suspense>
          <UploadImagePopoverContent onClose={() => menu.close()} />
        </React.Suspense>
      )}
    </>
  );
};

export default UploadImagePopover;