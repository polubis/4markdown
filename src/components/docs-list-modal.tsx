import { Button } from 'design-system/button';
import Modal from 'design-system/modal';
import React from 'react';
import { BiX } from 'react-icons/bi';
import { authStoreSelectors } from 'store/auth/auth.store';
import { useDocsStore } from 'store/docs/docs.store';

interface DocsListModalProps {
  onClose?(): void;
}

const DocsListModal = ({ onClose }: DocsListModalProps) => {
  const docsStore = useDocsStore();

  React.useEffect(() => {
    authStoreSelectors.authorized().getDocs();
  }, []);

  return (
    <Modal onClose={onClose}>
      <div className="flex items-center justify-between gap-4">
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
        <ul>
          {docsStore.docs.map((doc) => (
            <li key={doc.id}>{doc.name}</li>
          ))}
        </ul>
      )}
    </Modal>
  );
};

export default DocsListModal;
