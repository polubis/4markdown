import { Button } from 'design-system/button';
import React from 'react';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';

interface VisibilityToPermamentDialogProps {
  onConfirm(): void;
  onCancel(): void;
}

const VisibilityToPermamentDialog = ({
  onConfirm,
  onCancel,
}: VisibilityToPermamentDialogProps) => {
  const docManagementStore = useDocManagementStore();

  const handleConfirm: React.FormEventHandler<HTMLFormElement> = async (
    e,
  ): Promise<void> => {
    e.preventDefault();
    onConfirm();
  };

  return (
    <form className="flex flex-col" onSubmit={handleConfirm}>
      <h6 className="text-xl mr-4">Before You continue</h6>
      <p className="mt-4 mb-1">
        Changing the visibility to <strong>permanent</strong> will make your
        document available in a <strong>static URL</strong>.
      </p>
      <p>
        The document will be available in <strong>Google</strong> after several
        days. Make sure that you don&apos;t have any sensitive data in this
        document.
      </p>
      <p className="mt-1">
        <i>
          The document status can be changed later, however removing it from
          {` `}
          <strong>Google</strong> may take several days.
        </i>
      </p>
      <footer className="mt-6 flex">
        <Button
          className="ml-auto"
          type="button"
          i={1}
          s={2}
          auto
          title="Cancel document permanent status change"
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
          title="Confirm document permanent status change"
        >
          Yes, I understand
        </Button>
      </footer>
    </form>
  );
};

export default VisibilityToPermamentDialog;
