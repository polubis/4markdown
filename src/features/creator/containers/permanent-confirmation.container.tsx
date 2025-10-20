import { Button } from "design-system/button";
import React from "react";
import { Modal2 } from "design-system/modal2";
import { useDocManagementStore } from "store/doc-management/doc-management.store";
import { PermamentDocFormContainer } from "./permament-doc-form.container";
import { meta } from "../../../../meta";
import { useSimpleFeature } from "@greenonsoftware/react-kit";

interface PermanentConfirmationContainerProps {
  onConfirm(): void;
  onCancel(): void;
  onClose(): void;
}

const PermanentConfirmationContainer = ({
  onConfirm,
  onCancel,
}: PermanentConfirmationContainerProps) => {
  const docManagementStore = useDocManagementStore();
  const formSection = useSimpleFeature();

  const disabled = docManagementStore.is === `busy`;

  const handleConfirm = (): void => {
    formSection.on();
  };

  if (formSection.isOn) {
    return (
      <PermamentDocFormContainer
        onConfirm={onConfirm}
        onBack={formSection.off}
      />
    );
  }

  return (
    <>
      <Modal2.Header
        title="Make it permanent"
        closeButtonTitle="Close document permanent status confirmation"
      />
      <Modal2.Body>
        <p className="mb-1">
          Setting visibility to <strong>permanent</strong> makes your document
          available on <strong>Google</strong> with a static URL based on its
          name.
        </p>
        <p className="mb-1">
          You can change the document status later, but indexing or removal from{" "}
          {` `}
          Google may take <strong>1-14 days</strong>.
        </p>
        <p>
          <i>
            To add your article in the{` `}
            <a
              className="underline underline-offset-2 text-blue-800 dark:text-blue-500 font-bold"
              href={meta.routes.education.zone}
              target="_blank"
              rel="noreferrer"
            >
              Education Zone
            </a>
            , contact us via{` `}
            <a
              className="underline underline-offset-2 text-blue-800 dark:text-blue-500 font-bold"
              href={meta.linkedInUrl}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            . Not all permanent documents are displayed to maintain quality.
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
          title="Cancel document permanent status confirmation"
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
          title="Confirm permanent document policy"
        >
          Confirm
        </Button>
      </Modal2.Footer>
    </>
  );
};

export { PermanentConfirmationContainer };
