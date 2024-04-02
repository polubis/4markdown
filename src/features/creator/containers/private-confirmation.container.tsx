import React from 'react';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';
import { authStoreSelectors } from 'store/auth/auth.store';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';

interface PrivateConfirmationContainerProps {
  onClose(): void;
  onCancel(): void;
  onConfirm(): void;
}

const PrivateConfirmationContainer = ({
  onClose,
  onCancel,
  onConfirm,
}: PrivateConfirmationContainerProps) => {
  const docManagementStore = useDocManagementStore();

  const handleConfirm: React.FormEventHandler<HTMLFormElement> = async (
    e,
  ): Promise<void> => {
    e.preventDefault();

    try {
      await authStoreSelectors.authorized().makeDocPrivate();

      onConfirm();
    } catch {}
  };

  return (
    <form className="flex flex-col" onSubmit={handleConfirm}>
      <header className="flex items-center">
        <h6 className="text-xl mr-4 capitalize">Make it private</h6>
        <Button
          i={2}
          s={1}
          className="ml-auto"
          disabled={docManagementStore.is === `busy`}
          title="Close private document confirmation"
          onClick={onClose}
        >
          <BiX />
        </Button>
      </header>
      <p className="mt-4 mb-1">
        A private document is great to start with before you finish working on
        it, or if you want it to always be private. This document will be
        visible only to you.
      </p>
      <p className="mt-1">
        <i>The document status can be changed anytime.</i>
      </p>
      <footer className="mt-6 flex">
        <Button
          className="ml-auto"
          type="button"
          i={1}
          s={2}
          auto
          title="Cancel private document confirmation"
          disabled={docManagementStore.is === `busy`}
          onClick={onCancel}
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
          title="Confirm private document status change"
        >
          Confirm
        </Button>
      </footer>
    </form>
  );
};

export { PrivateConfirmationContainer };
