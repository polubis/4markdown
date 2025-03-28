import React from 'react';
import { BiArrowBack, BiArrowToBottom, BiPlus } from 'react-icons/bi';
import { Button } from 'design-system/button';
import { Link } from 'gatsby';
import { meta } from '../../meta';
import c from 'classnames';
import { triggerDocumentCreation } from 'core/creation-management';
import { docStoreSelectors } from 'store/doc/doc.store';
import { useSimpleFeature } from '@greenonsoftware/react-kit';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { activeMindmapSelector } from 'store/mindmap-creator/selectors';

const CreationLinkContainer = () => {
  const menu = useSimpleFeature();
  const docStore = docStoreSelectors.state();
  const activeMindmap = useMindmapCreatorState(activeMindmapSelector);

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
          `absolute z-10 max-w-[280px] -left-[4px] sm:left-[56px]`,
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
                    <strong>{docStore.name}</strong> document
                  </p>
                </>
              )}
            </Link>
          </li>

          <li className="flex flex-col cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3 border-b border-zinc-300 dark:border-zinc-800">
            <Link
              to={meta.routes.mindmaps.creator}
              title={
                activeMindmap
                  ? `Continue editing mindmap`
                  : `Create a new mindmap`
              }
            >
              {activeMindmap === null && (
                <>
                  <h6>Mindmap</h6>
                  <p className="mt-1 text-sm">
                    Create mindmaps using a powerful editor and leverage
                    Markdown syntax
                  </p>
                </>
              )}
              {activeMindmap && (
                <>
                  <h6 className="flex items-center">
                    <BiArrowBack className="mr-2" size={20} /> Continue Editing
                  </h6>
                  <p className="mt-1 text-sm">
                    You are currently working on{` `}
                    <strong>{activeMindmap.name}</strong> mindmap
                  </p>
                </>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export { CreationLinkContainer };
