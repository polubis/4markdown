import React from 'react';
import type { HeadingItem } from 'development-kit/markdown-utils';

type TableOfContentProps = {
  items: HeadingItem[];
};

const TableOfContent = ({ items }: TableOfContentProps) => {
  return (
    <aside className="static max-w-prose mx-auto lg:mx-0 lg:sticky lg:max-h-[70vh] lg:max-w-[280px] lg:top-0 lg:right-4 lg:py-4 lg:-mt-6">
      {items.length === 0 ? (
        <>
          <h2 className="text-lg mb-2">No Headings</h2>
          <p>This document does not contain any headings yet</p>
        </>
      ) : (
        <>
          <h2 className="text-lg mb-2">On This Page</h2>
          <ul className="space-y-1.5">
            {items.map((item, index) => (
              <li
                key={index}
                className="lg:truncate"
                style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
              >
                <a
                  className="underline underline-offset-2 text-gray-900 dark:text-gray-300 hover:text-blue-800 hover:dark:text-blue-500"
                  href={`#${item.hash}`}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  );
};

export { TableOfContent };
