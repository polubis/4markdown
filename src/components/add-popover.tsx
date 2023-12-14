import { Button } from 'design-system/button';
import { useToggle } from 'development-kit/use-toggle';
import CopyButtons from 'features/creator/copy-buttons';
import React from 'react';
import { BiPlusCircle, BiX } from 'react-icons/bi';
import c from 'classnames';

const Content = (
  <>
    <CopyButtons.Headings />
    <CopyButtons.Link />
    <CopyButtons.Image />
    <CopyButtons.Code />
    <CopyButtons.Table />
  </>
);

const baseClasses = `gap-2 fixed z-10 rounded-md p-2 bg-zinc-200 dark:bg-gray-950 border-2 border-zinc-300 dark:border-zinc-800`;

const AddPopover: React.FC = () => {
  const menu = useToggle();

  return (
    <>
      <Button i={2} rfull title="Add markdown content" onClick={menu.toggle}>
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
        </>
      )}
    </>
  );
};

export default AddPopover;
