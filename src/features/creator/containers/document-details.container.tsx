import { Button } from 'design-system/button';
import React from 'react';
import { BiPencil, BiTrash, BiX } from 'react-icons/bi';
import c from 'classnames';
import { formatDistance } from 'date-fns';
import { navigate } from 'core/navigate';
import { Tabs } from 'design-system/tabs';
import { useToggle } from 'development-kit/use-toggle';
import { PublicConfirmationContainer } from './public-confirmation.container';
import { PrivateConfirmationContainer } from './private-confirmation.container';
import { PermanentConfirmationContainer } from './permanent-confirmation.container';
import Modal from 'design-system/modal';
import { PermamentDocFormContainer } from './permament-doc-form.container';
import { meta } from '../../../../meta';
import { useDocumentsCreatorState } from 'store/documents-creator';
import { selectActiveDocument } from 'store/documents-creator/selectors';

type DocumentDetailsContainerProps = {
  onClose(): void;
  onOpen(): void;
};

const DocumentDetailsContainer = ({
  onClose,
  onOpen,
}: DocumentDetailsContainerProps) => {
  const privateConfirmation = useToggle();
  const permanentConfirmation = useToggle();
  const publicConfirmation = useToggle();
  const busy = useDocumentsCreatorState((state) => state.busy);
  const activeDocument = useDocumentsCreatorState(selectActiveDocument);
  const permamentDocumentEdition = useToggle();

  return (
    <Modal>
      {permamentDocumentEdition.opened && (
        <PermamentDocFormContainer
          onBack={permamentDocumentEdition.close}
          onConfirm={permamentDocumentEdition.close}
          onClose={onClose}
        />
      )}

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
        privateConfirmation.closed &&
        permamentDocumentEdition.closed && (
          <>
            <div className="flex items-center">
              <h6 className="text-xl mr-4">Details</h6>
              <Button
                i={2}
                s={1}
                className="ml-auto"
                disabled={busy}
                title="Delete current document"
                onClick={onOpen}
              >
                <BiTrash />
              </Button>
              {activeDocument.visibility === `permanent` && (
                <Button
                  i={2}
                  s={1}
                  className="ml-2"
                  disabled={busy}
                  title="Edit current document"
                  onClick={permamentDocumentEdition.open}
                >
                  <BiPencil />
                </Button>
              )}
              <Button
                i={2}
                s={1}
                className="ml-2"
                disabled={busy}
                title="Close additional options"
                onClick={onClose}
              >
                <BiX />
              </Button>
            </div>
            <p className="mt-4">
              Name: <strong>{activeDocument.name}</strong>
            </p>
            {activeDocument.visibility === `permanent` && (
              <>
                <p className="mt-1">
                  Description:{` `}
                  <strong className="break-words">
                    {activeDocument.description}
                  </strong>
                </p>
                <p className="mt-1">
                  Tags:{` `}
                  <strong className="break-words">
                    {activeDocument.tags.join(`, `)}
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
                      activeDocument.visibility === `public` ||
                      activeDocument.visibility === `permanent`,
                  },
                  {
                    'text-gray-600 dark:text-gray-400':
                      activeDocument.visibility === `private`,
                  },
                )}
              >
                {activeDocument.visibility}
              </strong>
            </p>
            <p className="mt-1">
              Created:{` `}
              <strong>
                {formatDistance(new Date().toISOString(), activeDocument.cdate)}
                {` `}
                ago
              </strong>
            </p>
            <p className="mt-1">
              Edited:{` `}
              <strong>
                {formatDistance(new Date().toISOString(), activeDocument.mdate)}
                {` `}
                ago
              </strong>
            </p>
            {(activeDocument.visibility === `public` ||
              activeDocument.visibility === `permanent`) && (
              <button
                className="underline underline-offset-2 text-blue-800 dark:text-blue-500 mt-1"
                title="Document preview"
                onClick={() =>
                  navigate(
                    `${meta.routes.docs.preview}?id=${activeDocument.id}`,
                  )
                }
              >
                <strong>Preview</strong>
              </button>
            )}
            {activeDocument.visibility === `permanent` && (
              <button
                className="underline underline-offset-2 text-blue-800 dark:text-blue-500 ml-3"
                title="Document URL"
                onClick={() => navigate(activeDocument.path)}
              >
                <strong>URL</strong>
              </button>
            )}
            <Tabs className="mt-8">
              <Tabs.Item
                title="Make this document private"
                active={activeDocument.visibility === `private`}
                onClick={
                  activeDocument.visibility === `private`
                    ? undefined
                    : privateConfirmation.open
                }
                disabled={busy}
              >
                Private
              </Tabs.Item>
              <Tabs.Item
                title="Make this document public"
                active={activeDocument.visibility === `public`}
                onClick={
                  activeDocument.visibility === `public`
                    ? undefined
                    : publicConfirmation.open
                }
                disabled={busy}
              >
                Public
              </Tabs.Item>
              <Tabs.Item
                title="Make this document permanent"
                active={activeDocument.visibility === `permanent`}
                onClick={
                  activeDocument.visibility === `permanent`
                    ? undefined
                    : permanentConfirmation.open
                }
                disabled={busy}
              >
                Permanent
              </Tabs.Item>
            </Tabs>
          </>
        )}
    </Modal>
  );
};

export { DocumentDetailsContainer };
