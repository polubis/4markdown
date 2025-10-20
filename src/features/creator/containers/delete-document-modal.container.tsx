import { Button } from "design-system/button";
import { Field } from "design-system/field";
import { Input } from "design-system/input";
import { Modal2 } from "design-system/modal2";
import React from "react";
import { deleteDocument } from "actions/delete-document.action";
import { useDocManagementStore } from "store/doc-management/doc-management.store";
import { docStoreSelectors } from "store/doc/doc.store";

const DeleteDocumentModalContainer = ({ onClose }: { onClose(): void }) => {
  const docStore = docStoreSelectors.useActive();
  const docManagementStore = useDocManagementStore();
  const [name, setName] = React.useState(``);

  const disabled = docManagementStore.is === `busy`;

  const handleConfirm = (): void => {
    deleteDocument(onClose);
  };

  return (
    <Modal2 disabled={disabled} onClose={onClose}>
      <Modal2.Header
        title="Document Removal"
        closeButtonTitle="Close document removal"
      />
      <Modal2.Body>
        <p className="mb-4">
          Type <strong>{docStore.name}</strong> to remove this document
        </p>
        <Field label="Document Name*">
          <Input
            placeholder="Type document name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </Field>
      </Modal2.Body>
      <Modal2.Footer className="flex space-x-3 w-full">
        <Button
          type="button"
          i={1}
          s={2}
          className="flex-1"
          auto
          disabled={disabled}
          title="Cancel document removal"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          i={2}
          s={2}
          auto
          className="flex-1"
          title="Confirm document removal"
          disabled={name !== docStore.name || disabled}
          onClick={handleConfirm}
        >
          Remove
        </Button>
      </Modal2.Footer>
    </Modal2>
  );
};

export { DeleteDocumentModalContainer };
