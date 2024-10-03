import React from 'react';
import { BiArrowBack, BiPlus } from 'react-icons/bi';
import { Button } from 'design-system/button';
import { Link } from 'gatsby';
import { meta } from '../../meta';
import { useToggle } from 'development-kit/use-toggle';
import c from 'classnames';
import { triggerDocumentCreation } from 'core/creation-management';
import { docStoreSelectors } from 'store/doc/doc.store';

const CreationLinkContainer = () => {
  const menu = useToggle();
  const docStore = docStoreSelectors.state();

  return (
    <>
      <Button auto i={2} s={2} title="Create any content" onClick={menu.toggle}>
        <BiPlus />
        Create
      </Button>
      <div
        className={c(
          `absolute z-10 max-w-[280px] -left-[4px] sm:left-[60px]`,
          menu.opened ? `top-[64px]` : `-top-full`,
        )}
      >
        <ul className="bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 rounded-md border-2">
          <li
            className="flex flex-col cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3 border-b-2 border-zinc-300 dark:border-zinc-800"
            onClick={
              docStore.is === `idle` ? triggerDocumentCreation : undefined
            }
          >
            <Link to={meta.routes.home}>
              {docStore.is === `idle` && (
                <>
                  <h6 className="text-md">Document</h6>
                  <p className="mt-1 text-sm">
                    Use Markdown
                    {` `}
                    syntax with a real-time editor for seamless content building
                  </p>
                </>
              )}
              {docStore.is === `active` && (
                <>
                  <h6 className="flex items-center text-md">
                    <BiArrowBack className="mr-2" size={20} /> Continue Editing
                  </h6>
                  <p className="mt-1 text-sm">
                    You are currently working on{` `}
                    <strong>{docStore.name}</strong> document
                  </p>
                </>
              )}
            </Link>
          </li>
          {/* <li className="flex flex-col cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3">
            <h6 className="text-md">
              Flashcard Board{' '}
              <span className="px-2 py-0.5 border-2 border-yellow-700 text-yellow-700 rounded-full text-sm">
                Soon
              </span>
            </h6>
            <p className="mt-1 text-sm">
              Create a flashcard board and prepare notes for each topic.
            </p>
          </li>
          <li className="flex flex-col cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3">
            <h6 className="text-md">Mindmap</h6>
            <p className="mt-1 text-sm">
              Organize your thoughts and resources to build your second brain as
              a graph
            </p>
          </li> */}
        </ul>
      </div>
    </>
  );
};

export { CreationLinkContainer };
