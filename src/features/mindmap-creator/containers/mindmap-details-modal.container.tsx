import { Button } from "design-system/button";
import { Modal2 } from "design-system/modal2";
import React from "react";
import { BiPencil, BiTrash } from "react-icons/bi";
import { useMindmapCreatorState } from "store/mindmap-creator";
import {
  closeMindmapDetailsAction,
  openMindmapFormAction,
} from "store/mindmap-creator/actions";
import { safeActiveMindmapSelector } from "store/mindmap-creator/selectors";
import { Input } from "design-system/input";
import { Field } from "design-system/field";
import { meta } from "../../../../meta";
import { deleteMindmapAct } from "acts/delete-mindmap.act";
import { updateMindmapVisibilityAct } from "acts/update-mindmap-visibility.act";
import { ResourceVisibility } from "api-4markdown-contracts";
import { authStoreSelectors } from "store/auth/auth.store";
import { createPathForMindmap } from "core/create-path-for-mindmap";
import { context } from "@greenonsoftware/react-kit";
import { ResourceVisibilityTabs } from "components/resource-visibility-tabs";
import { ResourceDetails } from "components/resource-details";

const AccessGroupsAssignModule = React.lazy(() =>
  import("modules/access-groups-assign").then((m) => ({
    default: m.AccessGroupsAssignModule,
  })),
);

const enum ViewType {
  Details = `details`,
  Delete = `delete`,
  ManualForm = `manual-form`,
}

const [FeatureProvider, useFeatureContext] = context(() => {
  const [view, setView] = React.useState(ViewType.Details);

  return {
    view,
    setView,
  };
});

const DeleteMindmapViewContainer = () => {
  const { setView } = useFeatureContext();
  const { operation } = useMindmapCreatorState();
  const activeMindmap = useMindmapCreatorState(safeActiveMindmapSelector);
  const [name, setName] = React.useState(``);

  const disabled = operation.is === `busy`;

  const close = (): void => {
    setView(ViewType.Details);
  };

  const handleConfirm = (): void => {
    deleteMindmapAct();
  };

  return (
    <>
      <Modal2.Header
        title="Remove Mindmap"
        closeButtonTitle="Close mindmap details"
      />
      <Modal2.Body>
        <div>
          <p className="mb-4">
            Type <strong>{activeMindmap.name}</strong> to remove this mindmap
          </p>
          <Field label="Mindmap Name*">
            <Input
              placeholder="Type mindmap name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </Field>
        </div>
      </Modal2.Body>
      <Modal2.Footer>
        <div className="flex space-x-3 w-full">
          <Button
            className="flex-1"
            type="button"
            i={1}
            s={2}
            auto
            disabled={disabled}
            title="Cancel mindmap removal"
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            i={2}
            s={2}
            auto
            title="Confirm mindmap removal"
            disabled={name !== activeMindmap.name || disabled}
            onClick={handleConfirm}
          >
            Remove
          </Button>
        </div>
      </Modal2.Footer>
    </>
  );
};

const MindmapDetailsViewContainer = () => {
  const { setView } = useFeatureContext();
  const { operation } = useMindmapCreatorState();

  const { user } = authStoreSelectors.useAuthorized();
  const disabled = operation.is === `busy`;
  const activeMindmap = useMindmapCreatorState(safeActiveMindmapSelector);

  const changeVisibility = (visibility: ResourceVisibility): void => {
    if (activeMindmap.visibility === visibility) return;

    updateMindmapVisibilityAct(visibility);
  };

  return (
    <>
      <Modal2.Header
        title="Mindmap Details"
        closeButtonTitle="Close mindmap details"
      >
        <Button
          disabled={disabled}
          i={2}
          s={1}
          title="Delete mindmap"
          onClick={() => setView(ViewType.Delete)}
        >
          <BiTrash />
        </Button>
        <Button
          disabled={disabled}
          i={2}
          s={1}
          title="Edit mindmap"
          onClick={() => openMindmapFormAction(activeMindmap)}
        >
          <BiPencil />
        </Button>
      </Modal2.Header>
      <Modal2.Body>
        <ResourceDetails
          type="Mindmap"
          sharedForGroups={activeMindmap.sharedForGroups}
          createdAt={activeMindmap.cdate}
          editedAt={activeMindmap.mdate}
          previewUrl={`${meta.routes.mindmaps.preview}?mindmapId=${activeMindmap.id}&authorId=${user.uid}`}
          staticUrl={createPathForMindmap(activeMindmap.id, activeMindmap.path)}
          name={activeMindmap.name}
          id={activeMindmap.id}
          tags={activeMindmap.tags ?? undefined}
          visibility={activeMindmap.visibility}
          description={activeMindmap.description ?? undefined}
          onAccessEdit={() => setView(ViewType.ManualForm)}
        />
      </Modal2.Body>
      <Modal2.Footer className="overflow-x-auto">
        <ResourceVisibilityTabs
          visibility={activeMindmap.visibility}
          onChange={changeVisibility}
          disabled={disabled}
          title={(visibility) => `Make this mindmap ${visibility}`}
        />
      </Modal2.Footer>
    </>
  );
};

const MindmapDetailsModalContainer = () => {
  const { view, setView } = useFeatureContext();
  const { operation: mindmapOperation } = useMindmapCreatorState();

  const disabled = mindmapOperation.is === `busy`;
  const activeMindmap = useMindmapCreatorState(safeActiveMindmapSelector);

  if (view === ViewType.Details) {
    return (
      <Modal2 disabled={disabled} onClose={closeMindmapDetailsAction}>
        <MindmapDetailsViewContainer />
      </Modal2>
    );
  }

  if (view === ViewType.Delete) {
    return (
      <Modal2 disabled={disabled} onClose={closeMindmapDetailsAction}>
        <DeleteMindmapViewContainer />
      </Modal2>
    );
  }

  return (
    <React.Suspense>
      <AccessGroupsAssignModule
        accessGroups={activeMindmap.sharedForGroups}
        disabled={disabled}
        onBack={() => setView(ViewType.Details)}
        onClose={closeMindmapDetailsAction}
        onConfirm={async (sharedForGroups) => {
          const result = await updateMindmapVisibilityAct(
            "manual",
            sharedForGroups,
          );

          if (result.is === "ok") {
            setView(ViewType.Details);
          }
        }}
      />
    </React.Suspense>
  );
};

const ConnectedMindmapDetailsModalContainer = () => {
  return (
    <FeatureProvider>
      <MindmapDetailsModalContainer />
    </FeatureProvider>
  );
};

export {
  ConnectedMindmapDetailsModalContainer as MindmapDetailsModalContainer,
};
