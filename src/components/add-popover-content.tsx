import Backdrop from 'design-system/backdrop';
import CopyButtons from 'features/creator/copy-buttons';
import React from 'react';
import c from 'classnames';

const baseClasses = `gap-2 fixed rounded-md p-2 bg-zinc-200 dark:bg-gray-950 shadow-lg z-30`;

interface AddPopoverContentProps {
  onCopy(content: string): void;
  onClose(): void;
}

const AddPopoverContent: React.FC<AddPopoverContentProps> = ({
  onCopy,
  onClose,
}) => {
  const Content = (
    <>
      <CopyButtons.Headings onClick={onCopy} />
      <CopyButtons.Link onClick={onCopy} />
      <CopyButtons.Image onClick={onCopy} />
      <CopyButtons.Code onClick={onCopy} />
      <CopyButtons.Table onClick={onCopy} />
    </>
  );

  return (
    <>
      <div
        className={c(baseClasses, `hidden md:grid grid-cols-5 left-4 top-16`)}
      >
        {Content}
      </div>
      <div
        className={c(
          baseClasses,
          `flex md:hidden left-4 right-4 bottom-16 max-w-max overflow-y-auto`,
        )}
      >
        {Content}
      </div>
      <Backdrop onClick={onClose} />
    </>
  );
};

export default AddPopoverContent;
