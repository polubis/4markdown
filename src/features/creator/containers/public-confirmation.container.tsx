import React from "react";
import { Button } from "design-system/button";
import { Modal2 } from "design-system/modal2";
import { useDocManagementStore } from "store/doc-management/doc-management.store";
import { meta } from "../../../../meta";
import { updateDocumentVisibilityAct } from "../acts/update-document-visibility.act";

interface PublicConfirmationContainerProps {
  onCancel(): void;
  onConfirm(): void;
}

const PublicConfirmationContainer = ({
  onCancel,
  onConfirm,
}: PublicConfirmationContainerProps) => {
  const docManagementStore = useDocManagementStore();

  const disabled = docManagementStore.is === `busy`;

  const handleConfirm = async (): Promise<void> => {
    const result = await updateDocumentVisibilityAct({
      visibility: `public`,
    });
    if (result.is === "ok") {
      onConfirm();
    }
  };

  return (
    <>
      <Modal2.Header
        title="Make it public"
        closeButtonTitle="Close public document confirmation"
      />
      <Modal2.Body>
        <p className="mb-1">
          You can share this document using a <strong>unique link</strong>.
          Public documents are not visible on Google or in the{` `}
          <a
            className="underline underline-offset-2 text-blue-800 dark:text-blue-500 font-bold"
            href={meta.routes.education.zone}
            target="_blank"
            rel="noreferrer"
          >
            Education Zone
          </a>
          .
        </p>
        <p>
          <i>
            Public means the document is visible <strong>to you</strong> and
            anyone with the <strong>link</strong> you share.
          </i>
        </p>
      </Modal2.Body>
      <Modal2.Footer className="flex space-x-3 w-full">
        <Button
          type="button"
          i={1}
          s={2}
          className="flex-1"
          auto
          title="Cancel public document confirmation"
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
          title="Confirm public document status change"
        >
          Confirm
        </Button>
      </Modal2.Footer>
    </>
  );
};

export { PublicConfirmationContainer };
