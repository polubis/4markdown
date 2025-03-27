import { BiX } from 'react-icons/bi';
import React from 'react';
import { Button } from 'design-system/button';
import c from 'classnames';
import { useTableContent } from '../hooks/useTableContent/useTableContent';
import { Link } from 'gatsby';

type TableOfContentSidebarProps = {
  onClose: () => void;
  opened?: boolean;
  content: string;
};

const TableOfContentSidebar = ({
  onClose,
  opened,
  content,
}: TableOfContentSidebarProps) => {
  const { getParsedHeadings, handleScrollToSection, activeHeadingId } =
    useTableContent(content);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 72);
    };

    window.addEventListener(`scroll`, handleScroll);
    return () => window.removeEventListener(`scroll`, handleScroll);
  }, []);

  return (
    <>
      <aside
        data-testid="[table-of-contents-sidebar]:container"
        className={c(
          `bg-zinc-200 z-20 dark:bg-gray-950 fixed right-0 w-[280px] overflow-y-auto transition-all duration-300 border-l border-zinc-300 dark:border-zinc-800`,
          isScrolled ? `top-0` : `top-[72px]`,
          opened ? `translate-x-0` : `translate-x-full`,
          `h-screen`,
        )}
      >
        <div className="p-4 flex gap-2 items-center h-[72px] border-b border-zinc-300 dark:border-zinc-800">
          <h2 className="text-lg font-medium mr-auto">Table of Contents</h2>
          <Button i={2} s={1} title="Close table of contents" onClick={onClose}>
            <BiX />
          </Button>
        </div>
        <ul className="pl-4">
          {getParsedHeadings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
              className="py-1.5"
            >
              <Link
                to={`#${heading.id}`}
                onClick={(e) => handleScrollToSection(e, heading.id)}
                className={c(
                  `block transition-colors cursor-pointer`,
                  activeHeadingId === heading.id
                    ? `text-green-700 dark:text-green-500`
                    : `text-gray-800 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-500`,
                )}
              >
                {heading.text}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export { TableOfContentSidebar };
