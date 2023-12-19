import { Button } from 'design-system/button';
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
    <Modal onClose={close}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h6 className="text-xl">Document Removal</h6>
        <Button
          type="button"
          disabled={disabled}
          i={2}
          rfull
          title="Close"
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
          <input
            placeholder="Type document name..."
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="px-3 py-2 placeholder:text-gray-600 dark:placeholder:text-gray-300 text-sm rounded-md bg-gray-300 dark:bg-slate-800 border-[2.5px] border-transparent focus:border-black dark:border-white outline-none"
          />
        </fieldset>
        <footer className="mt-6 flex">
          <Button
            className="ml-auto"
            type="button"
            i={2}
            rfull
            disabled={disabled}
            title="Close"
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="ml-2"
            i={2}
            rfull
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
