import { BiX } from 'react-icons/bi';
import React from 'react';
import type { MouseEvent } from 'react';

import { Button } from 'design-system/button';
import c from 'classnames';
import { useTableContent } from '../hooks/useTableContent';
import type { Heading } from '../hooks/useTableContent';

type TableOfContentSidebarProps = {
  onClose: () => void;
  opened?: boolean;
  content: string;
};

type HeadingItemProps = {
  heading: Heading;
  onHeadingClick: (e: MouseEvent, id: string) => void;
  activeHeadingId: string;
};

const HeadingItem = ({
  heading,
  onHeadingClick,
  activeHeadingId,
}: HeadingItemProps) => {
  const isActive = heading.id === activeHeadingId;

  return (
    <li className="my-1">
      <a
        href={`#${heading.id}`}
        className={c(
          `block py-1  hover:text-green-700`,
          heading.level === 1 ? `font-bold` : ``,
          heading.level === 2 ? `pl-2` : ``,
          heading.level === 3 ? `pl-4` : ``,
          heading.level === 4 ? `pl-6` : ``,
          heading.level === 5 ? `pl-8` : ``,
          heading.level === 6 ? `pl-10` : ``,
          isActive ? ` text-green-700 ` : ``,
        )}
        onClick={(e) => onHeadingClick(e, heading.id)}
      >
        {heading.text}
      </a>
      {heading.items.length > 0 && (
        <div
          className={c(
            heading.level > 1 ? `ml-1 mt-1 border-l-2 border-gray-300` : ``,
          )}
        >
          <ul className="pl-0">
            {heading.items.map((item) => (
              <HeadingItem
                key={item.id}
                heading={item}
                onHeadingClick={onHeadingClick}
                activeHeadingId={activeHeadingId}
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

const TableOfContentSidebar = ({
  onClose,
  opened,
  content,
}: TableOfContentSidebarProps) => {
  const { headings, handleHeadingClick, activeHeadingId } = useTableContent({
    content,
  });

  return (
    <>
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
          {headings.length > 0 ? (
            <ul className="pl-0 border-l-0">
              {headings.map((heading) => (
                <HeadingItem
                  key={heading.id}
                  heading={heading}
                  onHeadingClick={handleHeadingClick}
                  activeHeadingId={activeHeadingId}
                />
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No headings found in the document.
            </p>
          )}
        </div>
      </aside>
    </>
  );
};

export { TableOfContentSidebar };
