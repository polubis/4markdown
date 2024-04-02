import React from 'react';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';
import { authStoreSelectors } from 'store/auth/auth.store';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';

interface PublicConfirmationContainerProps {
  onClose(): void;
  onCancel(): void;
  onConfirm(): void;
}

const PublicConfirmationContainer = ({
  onClose,
  onCancel,
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
        <h6 className="text-xl mr-4 capitalize">Make public</h6>
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
        You will be able to share this document using a unique{` `}
        <strong>URL</strong>. Simply press <strong>confirm</strong>, and then
        share the link with others.
      </p>
      <p>
        The document will not appear in <strong>Google</strong> and in the
        application search.
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
          title="Cancel public document confirmation"
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
          title="Confirm public document status change"
        >
          Confirm
        </Button>
      </footer>
    </form>
  );
};

export { PublicConfirmationContainer };
