import React from 'react';
import { BiX } from 'react-icons/bi';
import { Button } from 'design-system/button';
import Backdrop from 'design-system/backdrop';
import c from 'classnames';
import { ScrollHide } from './scroll-hide';

type TableOfContentsSidebarProps = {
  onClose: () => void;
  opened?: boolean;
};

const TableOfContentsSidebar = ({
  onClose,
  opened,
}: TableOfContentsSidebarProps) => {
  return (
    <>
      {opened && (
        <ScrollHide>
          <Backdrop onClick={onClose} />
        </ScrollHide>
      )}

      <aside
        data-testid="[table-of-contents-sidebar]:container"
        className={c(
          `bg-zinc-200 z-20 dark:bg-gray-950 fixed top-0 left-0 h-full w-[280px] overflow-y-auto transition-transform duration-300`,
          opened ? `-translate-x-0` : `-translate-x-full`,
        )}
      >
        <div className="p-4 flex gap-2 items-center h-[72px]">
          <h2 className="text-lg font-medium mr-auto">Table of Contents</h2>
          <Button i={2} s={1} title="Close table of contents" onClick={onClose}>
            <BiX />
          </Button>
        </div>

        <div className="p-4 pb-0 flex flex-col gap-2 h-[calc(100svh-72px)] overflow-y-auto">
          <p className="text-gray-500 dark:text-gray-400">
            Table of contents will appear here.
          </p>
        </div>
      </aside>
    </>
  );
};

export { TableOfContentsSidebar };
