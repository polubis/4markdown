import { Button } from 'design-system/button';
import { Input } from 'design-system/input';
import Modal from 'design-system/modal';
import React from 'react';
import { BiX } from 'react-icons/bi';
import { authStoreSelectors } from 'store/auth/auth.store';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';
import { docStoreSelectors } from 'store/doc/doc.store';

interface DeleteDocModalProps {
  onClose?(): void;
}

const DeleteDocModal = ({ onClose }: DeleteDocModalProps) => {
  const docStore = docStoreSelectors.useActive();
  const docManagementStore = useDocManagementStore();
  const [name, setName] = React.useState(``);

  const disabled = docManagementStore.is === `busy`;

  const close = (): void => {
    if (disabled) return;

    onClose?.();
  };

  const handleConfirm: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await authStoreSelectors.authorized().deleteDoc();
      close();
    } catch {}
  };

  return (
    <Modal onEscape={close}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h6 className="text-xl">Document Removal</h6>
        <Button
          type="button"
          disabled={disabled}
          i={2}
          s={1}
          title="Close document removal"
          onClick={close}
        >
          <BiX />
        </Button>
      </div>
      <form onSubmit={handleConfirm}>
        <p className="mb-4">
          Type <strong>{docStore.name}</strong> to remove this document
        </p>
        <fieldset className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Document name*</label>
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

export default DeleteDocModal;
