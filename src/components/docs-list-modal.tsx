import { Button } from 'design-system/button';
import Modal from 'design-system/modal';
import type { Doc } from 'models/doc';
import React from 'react';
import { BiX } from 'react-icons/bi';
import { authStoreSelectors } from 'store/auth/auth.store';
import { docStoreActions, docStoreSelectors } from 'store/doc/doc.store';
import { useDocsStore } from 'store/docs/docs.store';
import c from 'classnames';

interface DocsListModalProps {
  onClose?(): void;
}

const DocsListModal = ({ onClose }: DocsListModalProps) => {
  const docsStore = useDocsStore();
  const docStore = docStoreSelectors.useActive();

  React.useEffect(() => {
    authStoreSelectors.authorized().getDocs();
  }, []);

  const selectDoc = (doc: Doc): void => {
    docStoreActions.setActive(doc);
    onClose?.();
  };

  return (
    <Modal onClose={onClose}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h6 className="text-xl">Your Documents</h6>
        <Button
          type="button"
          i={2}
          rfull
          title="Close your documents"
          onClick={onClose}
        >
          <BiX />
        </Button>
      </div>
      {(docsStore.is === `idle` || docsStore.is === `busy`) && (
        <p className="text-2xl">Just a second (～￣▽￣)U+007e</p>
      )}
      {docsStore.is === `fail` && <div>Error</div>}
      {docsStore.is === `ok` && docsStore.docs.length > 0 ? (
        <ul className="grid tn:grid-cols-3 grid-cols-2 gap-2 justify-center max-h-[80svh] pr-2 overflow-y-auto">
          {docsStore.docs.map((doc) => (
            <li
              className={c(
                `cursor-pointer border-2 shrink-0 h-[100px] w-[100%] rounded-md p-4 flex justify-center items-center`,
                {
                  'bg-zinc-200 dark:hover:bg-gray-900 dark:bg-gray-950 hover:bg-zinc-300 border-zinc-300 dark:border-zinc-800':
                    docStore.id !== doc.id,
                },
                {
                  'bg-green-700 text-white border-green-700':
                    docStore.id === doc.id,
                },
              )}
              key={doc.id}
              title={doc.name}
              onClick={() => selectDoc(doc)}
            >
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
    </Modal>
  );
};

export default DocsListModal;
