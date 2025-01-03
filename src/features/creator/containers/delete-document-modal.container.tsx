import { Button } from 'design-system/button';
import { Input } from 'design-system/input';
import { Modal } from 'design-system/modal';
import React from 'react';
import { deleteDocument } from 'actions/delete-document.action';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';
import { docStoreSelectors } from 'store/doc/doc.store';

const DeleteDocumentModalContainer = ({ onClose }: { onClose(): void }) => {
  const docStore = docStoreSelectors.useActive();
  const docManagementStore = useDocManagementStore();
  const [name, setName] = React.useState(``);

  const disabled = docManagementStore.is === `busy`;

  const handleConfirm: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    deleteDocument(onClose);
  };

  return (
    <Modal disabled={disabled} onClose={onClose}>
      <Modal.Header
        title="Document Removal"
        closeButtonTitle="Close document removal"
      />
      <form onSubmit={handleConfirm}>
        <p className="mb-4">
          Type <strong>{docStore.name}</strong> to remove this document
        </p>
        <fieldset className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Document Name*</label>
          <Input
            placeholder="Type document name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </fieldset>
        <footer className="mt-6 flex">
          <Button
            className="ml-auto"
            type="button"
            i={1}
            s={2}
            auto
            disabled={disabled}
            title="Cancel document removal"
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="ml-2"
            i={2}
            s={2}
            auto
            title="Confirm document removal"
            disabled={name !== docStore.name || disabled}
          >
            Remove
          </Button>
        </footer>
      </form>
    </Modal>
  );
};

export { DeleteDocumentModalContainer };
