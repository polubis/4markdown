import { Button } from 'design-system/button';
import { useToggle } from 'development-kit/use-toggle';
import CopyButtons from 'features/creator/copy-buttons';
import React from 'react';
import { BiPlusCircle, BiX } from 'react-icons/bi';
import c from 'classnames';
import { useCopy } from 'development-kit/use-copy';
import Backdrop from 'design-system/backdrop';

const baseClasses = `gap-2 fixed z-10 rounded-md p-2 bg-zinc-200 dark:bg-gray-950 shadow-lg z-30`;

const AddPopover: React.FC = () => {
  const menu = useToggle();
  const [copyState, copy] = useCopy();

  const handleClose = (content: string): void => {
    copy(content);
    menu.close();
  };

  const Content = (
    <>
      <CopyButtons.Headings onClick={handleClose} />
      <CopyButtons.Link onClick={handleClose} />
      <CopyButtons.Image onClick={handleClose} />
      <CopyButtons.Code onClick={handleClose} />
      <CopyButtons.Table onClick={handleClose} />
    </>
  );

  return (
    <>
      <Button
        i={2}
        rfull
        title="Add markdown template"
        overlay={copyState.is === `copied` ? `Copied` : undefined}
        onClick={menu.toggle}
      >
        {menu.opened ? (
          <BiX className="text-2xl" />
        ) : (
          <BiPlusCircle className="text-2xl" />
        )}
      </Button>

      {menu.opened && (
        <>
          <div
            className={c(
              baseClasses,
              `hidden md:grid grid-cols-5 left-4 top-16`,
            )}
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
          <Backdrop onClick={menu.close} />
        </>
      )}
    </>
  );
};

export default AddPopover;
