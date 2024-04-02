import React from 'react';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';
import { authStoreSelectors } from 'store/auth/auth.store';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';

interface PublicConfirmationContainerProps {
  onClose(): void;
  onConfirm(): void;
}

const PublicConfirmationContainer = ({
  onClose,
  onConfirm,
}: PublicConfirmationContainerProps) => {
  const docManagementStore = useDocManagementStore();

  const handleConfirm: React.FormEventHandler<HTMLFormElement> = async (
    e,
  ): Promise<void> => {
    e.preventDefault();

    try {
      await authStoreSelectors.authorized().makeDocPublic();

      onConfirm();
    } catch {}
  };

  return (
    <form className="flex flex-col" onSubmit={handleConfirm}>
      <header className="flex items-center">
        <h6 className="text-xl mr-4">Before You Continue</h6>
        <Button
          i={2}
          s={1}
          className="ml-auto"
          disabled={docManagementStore.is === `busy`}
          title="Close public document confirmation"
          onClick={onClose}
        >
          <BiX />
        </Button>
      </header>
      <p className="mt-4 mb-1">
        <strong>Public document</strong> will be accessible via unique,
        generated <strong>URL</strong> provided to you and other authorized
        individuals. This document will be not <strong>searchable</strong> or
        {` `}
        <strong>indexed by Google</strong>.
      </p>
      <p className="mt-1">
        <i>
          The document status can be changed later. The <strong>URL</strong>
          {` `}
          will be available after confirmation.
        </i>
      </p>
      <footer className="mt-6 flex">
        <Button
          className="ml-auto"
          type="button"
          i={1}
          s={2}
          auto
          title="Cancel public document confirmation"
          disabled={docManagementStore.is === `busy`}
          onClick={onClose}
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
          title="Confirm public document status change"
        >
          Yes, I understand
        </Button>
      </footer>
    </form>
  );
};

export { PublicConfirmationContainer };
