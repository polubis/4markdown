import { Button } from 'design-system/button';
import Popover from 'design-system/popover';
import React from 'react';
import { BiTrash, BiX } from 'react-icons/bi';
import { authStoreSelectors, useAuthStore } from 'store/auth/auth.store';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';
import { docStoreSelectors } from 'store/doc/doc.store';
import { useDocsStore } from 'store/docs/docs.store';
import c from 'classnames';
import { formatDistance } from 'date-fns';
import { navigate } from 'gatsby';
import { siteMetadataStoreSelectors } from 'store/site-metadata/site-metadata.store';
import { Tabs } from 'design-system/tabs';
import { Doc } from 'models/doc';

interface DocBarMorePopoverContentProps {
  onClose(): void;
  onOpen(): void;
}

const DocBarMorePopoverContent = ({
  onClose,
  onOpen,
}: DocBarMorePopoverContentProps) => {
  const authStore = useAuthStore();
  const docsStore = useDocsStore();
  const docStore = docStoreSelectors.useActive();
  const docManagementStore = useDocManagementStore();
  const siteMetaDataStore = siteMetadataStoreSelectors.useReady();

  const changeVisiblity = (visibility: Doc['visibility']): void => {
    if (docStore.visibility === visibility) return;

    authStoreSelectors.authorized().updateDoc(docStore.name, visibility);
  };

  return (
    <Popover
      className="bottom-32 left-2 md:left-32 md:bottom-auto md:top-32"
      onBackdropClick={docManagementStore.is === `busy` ? undefined : onClose}
    >
      <div className="flex items-center">
        <h6 className="text-xl mr-4">Details</h6>
        <Button
          i={2}
          s={1}
          className="ml-auto"
          disabled={
            docManagementStore.is === `busy` ||
            authStore.is !== `authorized` ||
            docsStore.is === `busy`
          }
          title="Delete current document"
          onClick={onOpen}
        >
          <BiTrash />
        </Button>
        <Button
          i={2}
          s={1}
          className="ml-2"
          disabled={docManagementStore.is === `busy`}
          title="Close additional options"
          onClick={onClose}
        >
          <BiX />
        </Button>
      </div>
      <p className="mt-4">
        Name: <strong>{docStore.name}</strong>
      </p>
      <p className="mt-1">
        Visibility:{` `}
        <strong
          className={c(
            `capitalize`,
            {
              'text-green-700 dark:text-green-600':
                docStore.visibility === `public`,
            },
            {
              'text-gray-600 dark:text-gray-400':
                docStore.visibility === `private`,
            },
          )}
        >
          {docStore.visibility}
        </strong>
      </p>
      <p className="mt-1">
        Created:{` `}
        <strong>
          {formatDistance(new Date().toISOString(), docStore.cdate)} ago
        </strong>
      </p>
      <p className="mt-1">
        Edited:{` `}
        <strong>
          {formatDistance(new Date().toISOString(), docStore.mdate)} ago
        </strong>
      </p>
      {docStore.visibility === `public` && (
        <p className="mt-1">
          URL:{` `}
          <button
            className="underline underline-offset-2 text-blue-800 dark:text-blue-500"
            title="Document preview"
            onClick={() =>
              navigate(
                `${siteMetaDataStore.routes.docs.preview}?id=${docStore.id}`,
              )
            }
          >
            <strong>Preview</strong>
          </button>
        </p>
      )}
      <Tabs className="mt-8" loading={docManagementStore.is === `busy`}>
        <Tabs.Item
          title="Make this document private"
          active={docStore.visibility === `private`}
          onClick={() => changeVisiblity(`private`)}
        >
          Private
        </Tabs.Item>
        <Tabs.Item
          title="Make this document public"
          active={docStore.visibility === `public`}
          onClick={() => changeVisiblity(`public`)}
        >
          Public
        </Tabs.Item>
        <Tabs.Item
          title="Make this document permanent"
          active={docStore.visibility === `permanent`}
          onClick={() => changeVisiblity(`permanent`)}
        >
          Parmanent
        </Tabs.Item>
      </Tabs>
    </Popover>
  );
};

export default DocBarMorePopoverContent;
