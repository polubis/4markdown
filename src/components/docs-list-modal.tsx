import { Button } from 'design-system/button';
import Modal from 'design-system/modal';
import type { Doc } from 'models/doc';
import React from 'react';
import { BiLowVision, BiRefresh, BiShow, BiWorld, BiX } from 'react-icons/bi';
import { authStoreSelectors } from 'store/auth/auth.store';
import { docStoreActions, useDocStore } from 'store/doc/doc.store';
import { useDocsStore } from 'store/docs/docs.store';
import c from 'classnames';

interface DocsListModalProps {
  onClose?(): void;
}

const DocsListModal = ({ onClose }: DocsListModalProps) => {
  const docsStore = useDocsStore();
  const docStore = useDocStore();
  const authStore = authStoreSelectors.useAuthorized();

  React.useEffect(() => {
    authStoreSelectors.authorized().getDocs();
  }, []);

  const selectDoc = (doc: Doc): void => {
    docStoreActions.setActive(doc);
    onClose?.();
  };

  const busy = docsStore.is === `busy`;

  return (
    <Modal onClose={busy ? undefined : onClose}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h6 className="text-xl">Your Documents</h6>
        <div className="flex gap-2">
          <Button
            type="button"
            i={2}
            s={1}
            title="Sync documents"
            disabled={busy}
            onClick={authStore.reloadDocs}
          >
            <BiRefresh />
          </Button>
          <Button
            type="button"
            i={2}
            s={1}
            disabled={busy}
            title="Close your documents"
            onClick={onClose}
          >
            <BiX />
          </Button>
        </div>
      </div>
      {(docsStore.is === `idle` || docsStore.is === `busy`) && (
        <p className="text-2xl">Just a second (￣▽￣)...</p>
      )}
      {docsStore.is === `fail` && (
        <p className="text-xl text-red-600 dark:text-red-400 text-center">
          Something went wrong... Try again with <strong>above button</strong>
        </p>
      )}
      {docsStore.is === `ok` && (
        <>
          {docsStore.docs.length > 0 ? (
            <ul className="grid tn:grid-cols-3 grid-cols-2 gap-2 justify-center max-h-[80svh] pr-2 overflow-y-auto">
              {docsStore.docs.map((doc) => (
                <li
                  className={c(
                    `relative cursor-pointer border-2 shrink-0 h-[100px] w-[100%] rounded-md p-4 flex justify-center items-center`,
                    docStore.is === `active` && docStore.id === doc.id
                      ? `bg-green-700 text-white border-green-700`
                      : `bg-zinc-200 dark:hover:bg-gray-900 dark:bg-gray-950 hover:bg-zinc-300 border-zinc-300 dark:border-zinc-800`,
                  )}
                  key={doc.id}
                  title={doc.name}
                  onClick={() => selectDoc(doc)}
                >
                  <span className="absolute top-1 right-1">
                    {doc.visibility === `private` && (
                      <BiLowVision title="This document is private" />
                    )}
                    {doc.visibility === `public` && (
                      <BiShow title="This document is public" />
                    )}
                    {doc.visibility === `permanent` && (
                      <BiWorld title="This document is permanent" />
                    )}
                  </span>
                  <span className="font-bold line-clamp-3 text-center text-sm">
                    {doc.name}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col">
              <h6>No documents added yet</h6>
            </div>
          )}
        </>
      )}
    </Modal>
  );
};

export default DocsListModal;
