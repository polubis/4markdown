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
import { useToggle } from 'development-kit/use-toggle';

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
  const visibilityToPermanentDialog = useToggle();

  const changeVisiblity = (visibility: Doc['visibility']): void => {
    if (docStore.visibility === visibility) return;

    if (docStore.visibility !== `permanent` && visibility === `permanent`) {
      visibilityToPermanentDialog.open();
      return;
    }

    authStoreSelectors.authorized().updateDoc(docStore.name, visibility);
  };

  const confirmVisibilityToPermanentChange: React.FormEventHandler<
    HTMLFormElement
  > = async (e): Promise<void> => {
    e.preventDefault();
    try {
      await authStoreSelectors
        .authorized()
        .updateDoc(docStore.name, `permanent`);
      visibilityToPermanentDialog.close();
    } catch {}
  };

  return (
    <>
      <Popover
        className="bottom-32 left-2 md:left-32 md:bottom-auto md:top-32 max-w-[94%] md:max-w-[400px]"
        onBackdropClick={docManagementStore.is === `busy` ? undefined : onClose}
      >
        {visibilityToPermanentDialog.opened && (
          <form
            className="flex flex-col"
            onSubmit={confirmVisibilityToPermanentChange}
          >
            <h6 className="text-xl mr-4">Before You continue</h6>
            <p className="mt-4 mb-1">
              Changing the visibility to <strong>permanent</strong> will make
              your document available in a <strong>static URL</strong>.
            </p>
            <p>
              The document will be available in <strong>Google</strong> after
              several days. Make sure that you don&apos;t have any sensitive
              data in this document.
            </p>
            <p className="mt-1">
              <i>
                The document status can be changed later, however removing it
                from <strong>Google</strong> may take several days.
              </i>
            </p>
            <footer className="mt-6 flex">
              <Button
                className="ml-auto"
                type="button"
                i={1}
                s={2}
                auto
                title="Cancel document permanent status change"
                disabled={docManagementStore.is === `busy`}
                onClick={visibilityToPermanentDialog.close}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="ml-2"
                i={2}
                s={2}
                auto
                disabled={docManagementStore.is === `busy`}
                title="Confirm document permanent status change"
              >
                Yes, I understand
              </Button>
            </footer>
          </form>
        )}

        {visibilityToPermanentDialog.closed && (
          <>
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
              <button
                className="mt-1 underline underline-offset-2 text-blue-800 dark:text-blue-500"
                title="Document preview"
                onClick={() =>
                  navigate(
                    `${siteMetaDataStore.routes.docs.preview}?id=${docStore.id}`,
                  )
                }
              >
                <strong>Preview</strong>
              </button>
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
          </>
        )}
      </Popover>
    </>
  );
};

export default DocBarMorePopoverContent;
