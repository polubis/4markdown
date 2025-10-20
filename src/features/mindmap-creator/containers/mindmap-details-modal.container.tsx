import { Button } from "design-system/button";
import { Modal2 } from "design-system/modal2";
import React from "react";
import c from "classnames";
import { BiPencil, BiTrash } from "react-icons/bi";
import { useMindmapCreatorState } from "store/mindmap-creator";
import {
  closeMindmapDetailsAction,
  openMindmapFormAction,
} from "store/mindmap-creator/actions";
import { safeActiveMindmapSelector } from "store/mindmap-creator/selectors";
import { navigate } from "gatsby";
import { formatDistance } from "date-fns";
import { Input } from "design-system/input";
import { Field } from "design-system/field";
import { meta } from "../../../../meta";
import { deleteMindmapAct } from "acts/delete-mindmap.act";
import { updateMindmapVisibilityAct } from "acts/update-mindmap-visibility.act";
import { ResourceVisibility } from "api-4markdown-contracts";
import { authStoreSelectors } from "store/auth/auth.store";
import { createPathForMindmap } from "core/create-path-for-mindmap";
import { context } from "@greenonsoftware/react-kit";
import { VisibilityIcon } from "components/visibility-icon";
import { ResourceVisibilityTabs } from "components/resource-visibility-tabs";
import { AccessGroupsAssignModule } from "modules/access-groups-assign";

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
    if (visibility === `manual`) {
      setView(ViewType.ManualForm);
      return;
    }

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
        <section className="flex flex-col space-y-1">
          <p>
            Name: <strong>{activeMindmap.name}</strong>
          </p>
          {activeMindmap.description && (
            <p>
              Description:{` `}
              <strong className="break-words">
                {activeMindmap.description}
              </strong>
            </p>
          )}
          {Array.isArray(activeMindmap.tags) &&
            activeMindmap.tags.length > 0 && (
              <p>
                Tags:{` `}
                <strong className="break-words">
                  {activeMindmap.tags.join(`, `)}
                </strong>
              </p>
            )}
          <div className="flex items-center gap-1.5">
            <span>Visibility:</span>
            <strong
              className={c(
                `capitalize inline-flex items-center gap-1`,
                activeMindmap.visibility === "private"
                  ? "text-gray-600 dark:text-gray-400"
                  : "text-green-700 dark:text-green-600",
              )}
            >
              <VisibilityIcon
                className="size-6"
                visibility={activeMindmap.visibility}
              />
              {activeMindmap.visibility}
            </strong>
          </div>
          <p>
            Created:{` `}
            <strong>
              {formatDistance(new Date().toISOString(), activeMindmap.cdate)}
              {` `}
              ago
            </strong>
          </p>
          <p>
            Edited:{` `}
            <strong>
              {formatDistance(new Date().toISOString(), activeMindmap.mdate)}
              {` `}
              ago
            </strong>
          </p>
          {activeMindmap.visibility === "manual" && (
            <p>
              Groups with access:{` `}
              <strong>{activeMindmap.sharedForGroups?.length ?? 0}</strong>
            </p>
          )}

          <footer>
            {activeMindmap.visibility !== `private` && (
              <button
                className="underline underline-offset-2 text-blue-800 dark:text-blue-500"
                title="Mindmap public link"
                onClick={() =>
                  navigate(
                    `${meta.routes.mindmaps.preview}?mindmapId=${activeMindmap.id}&authorId=${user.uid}`,
                  )
                }
              >
                <strong>Public Link</strong>
              </button>
            )}
            {activeMindmap.visibility === `permanent` && (
              <button
                className="underline underline-offset-2 text-blue-800 dark:text-blue-500 ml-3"
                title="Mindmap static stable URL"
                onClick={() =>
                  navigate(
                    createPathForMindmap(activeMindmap.id, activeMindmap.path),
                  )
                }
              >
                <strong>Static Stable URL</strong>
              </button>
            )}
            {activeMindmap.visibility === "manual" && (
              <Button
                className="mt-4 ml-auto"
                auto
                s={1}
                i={2}
                onClick={() => changeVisibility("manual")}
              >
                <BiPencil />
                Edit Access
              </Button>
            )}
          </footer>
        </section>
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
    <AccessGroupsAssignModule
      resource={activeMindmap}
      disabled={disabled}
      onBack={() => setView(ViewType.Details)}
      onClose={closeMindmapDetailsAction}
      onConfirm={(sharedForGroups) =>
        updateMindmapVisibilityAct("manual", sharedForGroups)
      }
    />
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
