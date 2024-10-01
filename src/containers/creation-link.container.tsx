import React from 'react';
import { BiPlus } from 'react-icons/bi';
import { Button } from 'design-system/button';
import { Link } from 'gatsby';
import { meta } from '../../meta';
import { useToggle } from 'development-kit/use-toggle';
import c from 'classnames';
import { triggerDocumentCreation } from 'core/create-content-management';

const CreationLinkContainer = () => {
  const menu = useToggle();

  return (
    <>
      <Button auto i={2} s={2} title="Create any content" onClick={menu.toggle}>
        <BiPlus />
        <span className="ml-0.5">Create</span>
      </Button>
      <div
        className={c(
          `absolute z-0 max-w-[280px] -left-[4px] sm:left-[60px]`,
          menu.opened ? `top-[64px]` : `-top-full`,
        )}
      >
        <ul className="bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 rounded-md border-2">
          <li
            className="flex flex-col cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3 border-b-2 border-zinc-300 dark:border-zinc-800"
            onClick={triggerDocumentCreation}
          >
            <Link to={meta.routes.home}>
              <h6 className="text-md">Document</h6>
              <p className="mt-1 text-sm">
                Use Markdown
                {` `}
                syntax with a real-time editor for seamless content building
              </p>
            </Link>
          </li>
          <li className="flex flex-col cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3">
            <Link
              to={meta.routes.mindmap.create}
              activeClassName="bg-green-500"
            >
              <h6 className="text-md">Mindmap</h6>
              <p className="mt-1 text-sm">
                Organize your thoughts and resources to build your second brain
                as a graph
              </p>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export { CreationLinkContainer };
