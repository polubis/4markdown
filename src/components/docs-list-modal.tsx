import { Button } from 'design-system/button';
import Modal from 'design-system/modal';
import type { Doc } from 'models/doc';
import React from 'react';
import { BiX } from 'react-icons/bi';
import { authStoreSelectors } from 'store/auth/auth.store';
import { docStoreActions } from 'store/doc/doc.store';
import { useDocsStore } from 'store/docs/docs.store';

interface DocsListModalProps {
  onClose?(): void;
}

const DocsListModal = ({ onClose }: DocsListModalProps) => {
  const docsStore = useDocsStore();

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
        <Button type="button" i={2} rfull title="Close" onClick={onClose}>
          <BiX />
        </Button>
      </div>
      {(docsStore.is === `idle` || docsStore.is === `busy`) && (
        <p className="text-2xl">Just a second (～￣▽￣)U+007e</p>
      )}
      {docsStore.is === `fail` && <div>Error</div>}
      {docsStore.is === `ok` && (
        <ul className="grid grid-cols-3 gap-2 justify-center">
          {docsStore.docs.map((doc) => (
            <li
              className="bg-zinc-200 dark:hover:bg-gray-900 hover:bg-zinc-300 cursor-pointer dark:bg-gray-950 border-2 border-zinc-300 dark:border-zinc-800 shrink-0 h-[100px] w-[100%] rounded-md p-4 flex justify-center items-center"
              key={doc.id}
              onClick={() => selectDoc(doc)}
            >
              <span className="font-bold line-clamp-3 text-center text-sm">
                {doc.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};

export default DocsListModal;
