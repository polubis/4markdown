import React from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { toString } from 'mdast-util-to-string';

type HeadingItem = {
  level: number;
  text: string;
  hash: string;
};

const getPlainText = (markdown: string): string => {
  const tree = unified().use(remarkParse).parse(markdown);

  return toString(tree);
};

const extractHeadings = (markdown: string): HeadingItem[] => {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;

  return (markdown.match(headingRegex) ?? []).map((heading) => {
    const [, hashes, text] = heading.match(/^(#{1,6})\s+(.+)$/) ?? [];
    const parsedText = getPlainText(text);
    const hash = parsedText.replace(/\s+/g, `-`);

    return {
      level: hashes.length,
      hash,
      text: parsedText,
    };
  });
};

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

const useTableOfContent = ({ containerId }: { containerId: string }) => {
  React.useLayoutEffect(() => {
    const headingsSelector = Array.from(
      { length: 6 },
      (_, i) => `#${containerId} h${i + 1}`,
    ).join(`, `);

    const scrollToHash = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      const decodedHash = hash.replace(/-/g, ` `);
      const headings = window.document.querySelectorAll(headingsSelector);
      const foundHeading = Array.from(headings).find(
        (heading) => heading.textContent === decodedHash,
      );
      foundHeading?.scrollIntoView({ block: `start` });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log(`Heading in view:`, entry.target.textContent);
          }
        });
      },
      { threshold: 0.5 },
    );

    const headings = window.document.querySelectorAll(headingsSelector);

    headings.forEach((heading) => observer.observe(heading));

    scrollToHash();

    window.addEventListener(`hashchange`, scrollToHash);

    return () => {
      window.removeEventListener(`hashchange`, scrollToHash);
      headings.forEach((heading) => observer.unobserve(heading));
      observer.disconnect();
    };
  }, [containerId]);
};

export { TableOfContent, useTableOfContent, extractHeadings };
