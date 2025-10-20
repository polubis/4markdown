import React from "react";
import { Button } from "design-system/button";
import { Modal2 } from "design-system/modal2";
import { useDocManagementStore } from "store/doc-management/doc-management.store";
import { updateDocumentVisibilityAct } from "../acts/update-document-visibility.act";

interface PrivateConfirmationContainerProps {
  onCancel(): void;
  onConfirm(): void;
}

const PrivateConfirmationContainer = ({
  onCancel,
  onConfirm,
}: PrivateConfirmationContainerProps) => {
  const docManagementStore = useDocManagementStore();

  const disabled = docManagementStore.is === `busy`;

  const handleConfirm = async (): Promise<void> => {
    const result = await updateDocumentVisibilityAct({ visibility: `private` });
    if (result.is === "ok") {
      onConfirm();
    }
  };

  return (
    <>
      <Modal2.Header
        title="Make it private"
        closeButtonTitle="Close private document confirmation"
      />
      <Modal2.Body>
        <p className="mb-1">
          A private document is ideal for drafts or if you want it to always
          remain private. It will only be visible to you.
        </p>
        <p>
          <i>
            Private means the document is visible only to you, but its content
            is {` `}
            <strong>not encrypted</strong>. Avoid storing sensitive data.
          </i>
        </p>
      </Modal2.Body>
      <Modal2.Footer className="flex space-x-3 w-full">
        <Button
          i={1}
          s={2}
          className="flex-1"
          auto
          title="Cancel private document confirmation"
          disabled={disabled}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          i={2}
          s={2}
          auto
          className="flex-1"
          disabled={disabled}
          onClick={handleConfirm}
          title="Confirm private document status change"
        >
          Confirm
        </Button>
      </Modal2.Footer>
    </>
  );
};

export { PrivateConfirmationContainer };
