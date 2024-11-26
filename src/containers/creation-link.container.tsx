import React from 'react';
import { BiArrowBack, BiArrowToBottom, BiPlus } from 'react-icons/bi';
import { Button } from 'design-system/button';
import { Link } from 'gatsby';
import { meta } from '../../meta';
import { useToggle } from 'development-kit/use-toggle';
import c from 'classnames';
import { triggerDocumentCreation } from 'core/creation-management';
import { useDocumentsCreatorState } from 'store/documents-creator';
import { findActiveDocument } from 'store/documents-creator/selectors';

const CreationLinkContainer = () => {
  const menu = useToggle();
  const activeDocument = useDocumentsCreatorState(findActiveDocument);

  return (
    <>
      <Button auto i={2} s={2} title="Create any content" onClick={menu.toggle}>
        {menu.opened ? (
          <BiArrowToBottom className="animate-fade-in" />
        ) : (
          <BiPlus />
        )}
        Create
      </Button>
      <div
        className={c(
          `absolute z-10 max-w-[280px] -left-[4px] sm:left-[60px]`,
          menu.opened ? `top-[64px] animate-fade-in` : `-top-full`,
        )}
      >
        <ul className="bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 rounded-md border-2">
          <li
            className="flex flex-col cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3 border-b-2 border-zinc-300 dark:border-zinc-800"
            onClick={
              activeDocument === null ? undefined : triggerDocumentCreation
            }
          >
            <Link
              to={meta.routes.home}
              title={
                activeDocument === null
                  ? `Create a new document`
                  : `Continue editing the document`
              }
            >
              {activeDocument === null && (
                <>
                  <h6 className="text-md">Document</h6>
                  <p className="mt-1 text-sm">
                    Create documents in markdown format and share them with
                    others
                  </p>
                </>
              )}
              {activeDocument !== null && (
                <>
                  <h6 className="flex items-center text-md">
                    <BiArrowBack className="mr-2" size={20} /> Continue Editing
                  </h6>
                  <p className="mt-1 text-sm">
                    You are currently working on{` `}
                    <strong>{activeDocument.name}</strong>
                  </p>
                </>
              )}
            </Link>
          </li>

          <li className="relative flex flex-col p-3 border-b-2 border-zinc-300 dark:border-zinc-800">
            <h6 className="text-md">Flashcard Board</h6>
            <p className="mt-1 text-sm">Coming soon</p>
          </li>

          <li className="relative flex flex-col p-3">
            <h6 className="text-md">Mindmap</h6>
            <p className="mt-1 text-sm">Coming soon</p>
          </li>
        </ul>
      </div>
    </>
  );
};

export { CreationLinkContainer };
