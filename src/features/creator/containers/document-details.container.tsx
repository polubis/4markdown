import { Button } from 'design-system/button';
import React from 'react';
import { BiTrash, BiX } from 'react-icons/bi';
import { useAuthStore } from 'store/auth/auth.store';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';
import { docStoreSelectors } from 'store/doc/doc.store';
import { useDocsStore } from 'store/docs/docs.store';
import c from 'classnames';
import { formatDistance } from 'date-fns';
import { navigate } from 'gatsby';
import { siteMetadataStoreSelectors } from 'store/site-metadata/site-metadata.store';
import { Tabs } from 'design-system/tabs';
import { useToggle } from 'development-kit/use-toggle';
import { PublicConfirmationContainer } from 'features/creator/containers/public-confirmation.container';
import { PrivateConfirmationContainer } from 'features/creator/containers/private-confirmation.container';
import { PermanentConfirmationContainer } from 'features/creator/containers/permanent-confirmation.container';
import Modal from 'design-system/modal';

interface DocumentDetailsContainerProps {
  onClose(): void;
  onOpen(): void;
}

const DocumentDetailsContainer = ({
  onClose,
  onOpen,
}: DocumentDetailsContainerProps) => {
  const authStore = useAuthStore();
  const docsStore = useDocsStore();
  const privateConfirmation = useToggle();
  const permanentConfirmation = useToggle();
  const publicConfirmation = useToggle();
  const docStore = docStoreSelectors.useActive();
  const docManagementStore = useDocManagementStore();
  const siteMetaDataStore = siteMetadataStoreSelectors.useReady();

  return (
    <Modal>
      {privateConfirmation.opened && (
        <PrivateConfirmationContainer
          onConfirm={privateConfirmation.close}
          onCancel={privateConfirmation.close}
          onClose={onClose}
        />
      )}

      {permanentConfirmation.opened && (
        <PermanentConfirmationContainer
          onConfirm={permanentConfirmation.close}
          onCancel={permanentConfirmation.close}
          onClose={onClose}
        />
      )}

      {publicConfirmation.opened && (
        <PublicConfirmationContainer
          onConfirm={publicConfirmation.close}
          onCancel={publicConfirmation.close}
          onClose={onClose}
        />
      )}

      {permanentConfirmation.closed &&
        publicConfirmation.closed &&
        privateConfirmation.closed && (
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
            {docStore.visibility === `permanent` && (
              <>
                <p className="mt-1">
                  Description:{` `}
                  <strong className="break-words">
                    {docStore.description}
                  </strong>
                </p>
                <p className="mt-1">
                  Tags:{` `}
                  <strong className="break-words">
                    {docStore.tags.join(`, `)}
                  </strong>
                </p>
              </>
            )}
            <p className="mt-1">
              Visibility:{` `}
              <strong
                className={c(
                  `capitalize`,
                  {
                    'text-green-700 dark:text-green-600':
                      docStore.visibility === `public` ||
                      docStore.visibility === `permanent`,
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
            {(docStore.visibility === `public` ||
              docStore.visibility === `permanent`) && (
              <button
                className="underline underline-offset-2 text-blue-800 dark:text-blue-500 mt-1"
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
            {docStore.visibility === `permanent` && (
              <button
                className="underline underline-offset-2 text-blue-800 dark:text-blue-500 ml-3"
                title="Document URL"
                onClick={() => navigate(docStore.path)}
              >
                <strong>URL</strong>
              </button>
            )}
            <Tabs className="mt-8">
              <Tabs.Item
                title="Make this document private"
                active={docStore.visibility === `private`}
                onClick={
                  docStore.visibility === `private`
                    ? undefined
                    : privateConfirmation.open
                }
                disabled={docManagementStore.is === `busy`}
              >
                Private
              </Tabs.Item>
              <Tabs.Item
                title="Make this document public"
                active={docStore.visibility === `public`}
                onClick={
                  docStore.visibility === `public`
                    ? undefined
                    : publicConfirmation.open
                }
                disabled={docManagementStore.is === `busy`}
              >
                Public
              </Tabs.Item>
              <Tabs.Item
                title="Make this document permanent"
                active={docStore.visibility === `permanent`}
                onClick={
                  docStore.visibility === `permanent`
                    ? undefined
                    : permanentConfirmation.open
                }
                disabled={docManagementStore.is === `busy`}
              >
                Permanent
              </Tabs.Item>
            </Tabs>
          </>
        )}
    </Modal>
  );
};

export default DocumentDetailsContainer;
