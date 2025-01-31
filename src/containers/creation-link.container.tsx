import React from 'react';
import { BiArrowBack, BiArrowToBottom, BiPlus } from 'react-icons/bi';
import { Button } from 'design-system/button';
import { Link } from 'gatsby';
import { meta } from '../../meta';
import c from 'classnames';
import { triggerDocumentCreation } from 'core/creation-management';
import { docStoreSelectors } from 'store/doc/doc.store';
import { useSimpleFeature } from 'development-kit/use-simple-feature';

const CreationLinkContainer = () => {
  const menu = useSimpleFeature();
  const docStore = docStoreSelectors.state();

  return (
    <>
      <Button auto i={2} s={2} title="Create any content" onClick={menu.toggle}>
        {menu.isOn ? (
          <BiArrowToBottom className="animate-fade-in" />
        ) : (
          <BiPlus />
        )}
        Create
      </Button>
      <div
        className={c(
          `absolute z-10 max-w-[280px] -left-[4px] sm:left-[60px]`,
          menu.isOn ? `top-[64px] animate-fade-in` : `-top-full`,
        )}
      >
        <ul className="bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 rounded-md border-2">
          <li
            className="flex flex-col cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3 border-b border-zinc-300 dark:border-zinc-800"
            onClick={
              docStore.is === `idle` ? triggerDocumentCreation : undefined
            }
          >
            <Link
              to={meta.routes.home}
              title={
                docStore.is === `idle`
                  ? `Create a new document`
                  : `Continue editing the document`
              }
            >
              {docStore.is === `idle` && (
                <>
                  <h6>Document</h6>
                  <p className="mt-1 text-sm">
                    Create documents in markdown format and share them with
                    others
                  </p>
                </>
              )}
              {docStore.is === `active` && (
                <>
                  <h6 className="flex items-center">
                    <BiArrowBack className="mr-2" size={20} /> Continue Editing
                  </h6>
                  <p className="mt-1 text-sm">
                    You are currently working on{` `}
                    <strong>{docStore.name}</strong>
                  </p>
                </>
              )}
            </Link>
          </li>

          <li className="relative flex flex-col p-3 border-b border-zinc-300 dark:border-zinc-800">
            <h6>Flashcard Board</h6>
            <p className="mt-1 text-sm">Coming soon</p>
          </li>

          <li className="flex flex-col cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3">
            <Link to={meta.routes.mindmap.new}>
              <h6 className="text-md">Mindmap</h6>
              <p className="mt-1 text-sm">
                Organize your thoughts and resources in mindmaps
              </p>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export { CreationLinkContainer };
