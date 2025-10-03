import { Button } from "design-system/button";
import React from "react";
import { BiPencil, BiTrash } from "react-icons/bi";
import { useDocManagementStore } from "store/doc-management/doc-management.store";
import { docStoreSelectors } from "store/doc/doc.store";
import c from "classnames";
import { formatDistance } from "date-fns";
import { navigate } from "gatsby";
import { PublicConfirmationContainer } from "features/creator/containers/public-confirmation.container";
import { PrivateConfirmationContainer } from "features/creator/containers/private-confirmation.container";
import { PermanentConfirmationContainer } from "features/creator/containers/permanent-confirmation.container";
import { Modal2 } from "design-system/modal2";
import { PermamentDocFormContainer } from "./permament-doc-form.container";
import { meta } from "../../../../meta";
import { useSimpleFeature } from "@greenonsoftware/react-kit";
import { ResourceVisibilityTabs } from "components/resource-visibility-tabs";
import { VisibilityIcon } from "components/visibility-icon";
import { ResourceAccessManagerModule } from "modules/resource-access-management";

interface DocumentDetailsContainerProps {
  onClose(): void;
  onOpen(): void;
}

const DocumentDetailsContainer = ({
  onClose,
  onOpen,
}: DocumentDetailsContainerProps) => {
  const privateConfirmation = useSimpleFeature();
  const permanentConfirmation = useSimpleFeature();
  const publicConfirmation = useSimpleFeature();
  const manualConfirmation = useSimpleFeature();
  const docStore = docStoreSelectors.useActive();
  const docManagementStore = useDocManagementStore();
  const permamentDocumentEdition = useSimpleFeature();

  const disabled = docManagementStore.is === `busy`;

  return (
    <Modal2 disabled={disabled} onClose={onClose}>
      {permamentDocumentEdition.isOn && (
        <PermamentDocFormContainer
          onBack={permamentDocumentEdition.off}
          onConfirm={permamentDocumentEdition.off}
        />
      )}

      {privateConfirmation.isOn && (
        <PrivateConfirmationContainer
          onConfirm={privateConfirmation.off}
          onCancel={privateConfirmation.off}
        />
      )}

      {permanentConfirmation.isOn && (
        <PermanentConfirmationContainer
          onConfirm={permanentConfirmation.off}
          onCancel={permanentConfirmation.off}
          onClose={onClose}
        />
      )}

      {publicConfirmation.isOn && (
        <PublicConfirmationContainer
          onConfirm={publicConfirmation.off}
          onCancel={publicConfirmation.off}
        />
      )}

      {manualConfirmation.isOn && (
        <ResourceAccessManagerModule
          onBack={manualConfirmation.off}
          onClose={onClose}
        />
      )}

      {permanentConfirmation.isOff &&
        publicConfirmation.isOff &&
        privateConfirmation.isOff &&
        permamentDocumentEdition.isOff &&
        manualConfirmation.isOff && (
          <>
            <Modal2.Header
              title="Details"
              closeButtonTitle="Close additional options"
            >
              <Button
                i={2}
                s={1}
                disabled={disabled}
                title="Delete current document"
                onClick={onOpen}
              >
                <BiTrash />
              </Button>
              {docStore.visibility === `permanent` && (
                <Button
                  i={2}
                  s={1}
                  disabled={disabled}
                  title="Edit current document"
                  onClick={permamentDocumentEdition.on}
                >
                  <BiPencil />
                </Button>
              )}
            </Modal2.Header>
            <Modal2.Body>
              <p>
                Name: <strong>{docStore.name}</strong>
              </p>
              {docStore.visibility === `permanent` && (
                <>
                  <p className="mt-1">
                    Description:{` `}
                    <strong className="break-words">
                      {docStore.description}
                    </strong>
                  </p>
                  <p className="mt-1">
                    Tags:{` `}
                    <strong className="break-words">
                      {docStore.tags.join(`, `)}
                    </strong>
                  </p>
                </>
              )}
              <div className="flex items-center gap-1.5 mt-1">
                <span>Visibility:</span>
                <strong
                  className={c(
                    `capitalize inline-flex items-center gap-1`,
                    docStore.visibility === "private"
                      ? "text-gray-600 dark:text-gray-400"
                      : "text-green-700 dark:text-green-600",
                  )}
                >
                  <VisibilityIcon
                    className="size-6"
                    visibility={docStore.visibility}
                  />
                  {docStore.visibility}
                </strong>
              </div>
              <p className="mt-1">
                Created:{` `}
                <strong>
                  {formatDistance(new Date().toISOString(), docStore.cdate)} ago
                </strong>
              </p>
              <p className="mt-1">
                Edited:{` `}
                <strong>
                  {formatDistance(new Date().toISOString(), docStore.mdate)} ago
                </strong>
              </p>
              {(docStore.visibility === `public` ||
                docStore.visibility === `permanent`) && (
                <button
                  className="underline underline-offset-2 text-blue-800 dark:text-blue-500 mt-1"
                  title="Document preview"
                  onClick={() =>
                    navigate(
                      `${meta.routes.documents.preview}?id=${docStore.id}`,
                    )
                  }
                >
                  <strong>Preview</strong>
                </button>
              )}
              {docStore.visibility === `permanent` && (
                <button
                  className="underline underline-offset-2 text-blue-800 dark:text-blue-500 ml-3"
                  title="Document URL"
                  onClick={() => navigate(docStore.path)}
                >
                  <strong>URL</strong>
                </button>
              )}
            </Modal2.Body>
            <Modal2.Footer className="overflow-x-auto">
              <ResourceVisibilityTabs
                disabled={disabled}
                visibility={docStore.visibility}
                onChange={(visibility) => {
                  if (visibility === docStore.visibility) {
                    return;
                  }

                  if (visibility === `private`) {
                    privateConfirmation.on();
                    return;
                  }

                  if (visibility === `public`) {
                    publicConfirmation.on();
                    return;
                  }

                  if (visibility === `permanent`) {
                    permanentConfirmation.on();
                    return;
                  }

                  manualConfirmation.on();
                }}
                title={(visibility) => `Make this document ${visibility}`}
              />
            </Modal2.Footer>
          </>
        )}
    </Modal2>
  );
};

export default DocumentDetailsContainer;
