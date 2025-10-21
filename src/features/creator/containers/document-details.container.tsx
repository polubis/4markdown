import { Button } from "design-system/button";
import React from "react";
import { BiPencil, BiTrash } from "react-icons/bi";
import { useDocManagementStore } from "store/doc-management/doc-management.store";
import { docStoreSelectors } from "store/doc/doc.store";
import { PublicConfirmationContainer } from "features/creator/containers/public-confirmation.container";
import { PrivateConfirmationContainer } from "features/creator/containers/private-confirmation.container";
import { PermanentConfirmationContainer } from "features/creator/containers/permanent-confirmation.container";
import { Modal2 } from "design-system/modal2";
import { PermamentDocFormContainer } from "./permament-doc-form.container";
import { meta } from "../../../../meta";
import { useSimpleFeature } from "@greenonsoftware/react-kit";
import { ResourceVisibilityTabs } from "components/resource-visibility-tabs";
import { updateDocumentVisibilityAct } from "../acts/update-document-visibility.act";
import { ResourceDetails } from "components/resource-details";

const AccessGroupsAssignModule = React.lazy(() =>
  import("modules/access-groups-assign").then((m) => ({
    default: m.AccessGroupsAssignModule,
  })),
);

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
        <React.Suspense>
          <AccessGroupsAssignModule
            accessGroups={docStore.sharedForGroups}
            disabled={disabled}
            onBack={manualConfirmation.off}
            onClose={onClose}
            onConfirm={async (sharedForGroups) => {
              const result = await updateDocumentVisibilityAct({
                visibility: "manual",
                sharedForGroups,
              });

              if (result.is === "ok") {
                manualConfirmation.off();
              }
            }}
          />
        </React.Suspense>
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
              <ResourceDetails
                sharedForGroups={docStore.sharedForGroups}
                createdAt={docStore.cdate}
                editedAt={docStore.mdate}
                previewUrl={`${meta.routes.documents.preview}?id=${docStore.id}`}
                staticUrl={docStore.path}
                name={docStore.name}
                id={docStore.id}
                tags={"tags" in docStore ? docStore.tags : undefined}
                visibility={docStore.visibility}
                description={
                  "description" in docStore ? docStore.description : undefined
                }
                onAccessEdit={manualConfirmation.on}
              />
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

export { DocumentDetailsContainer };
