import React from 'react';
import type { HeadingItem } from 'development-kit/markdown-utils';

type MarkdownTableOfContentProps = {
  items: HeadingItem[];
};

const MarkdownTableOfContent = React.memo(
  ({ items }: MarkdownTableOfContentProps) => {
    return (
      <aside className="sticky top-0 right-4 h-[400px] max-w-[280px] py-4 -mt-4">
        <h2 className="text-lg mb-4">On This Page</h2>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={index}
              style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
            >
              <a
                className="underline underline-offset-2 text-blue-800 dark:text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                href={`#${item.text}`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    );
  },
  (prevProps, nextProps) => prevProps.items === nextProps.items,
);

MarkdownTableOfContent.displayName = `MarkdownTableOfContent`;

export { MarkdownTableOfContent };
