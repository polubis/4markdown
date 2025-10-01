import { Button } from "design-system/button";
import { Modal2 } from "design-system/modal2";
import React, { useEffect } from "react";
import c from "classnames";
import { BiErrorAlt, BiPencil, BiSearch, BiTrash } from "react-icons/bi";
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
import {
  API4MarkdownDto,
  RESOURCE_VISIBILITIES,
  ResourceVisibility,
} from "api-4markdown-contracts";
import { authStoreSelectors } from "store/auth/auth.store";
import { createPathForMindmap } from "core/create-path-for-mindmap";
import { context } from "@greenonsoftware/react-kit";
import { Tabs2 } from "design-system/tabs-2";
import { VisibilityIcon } from "components/visibility-icon";
import { findUserAct } from "acts/find-user.act";
import { Transaction } from "development-kit/utility-types";
import { getResourceAccessGroupAct } from "acts/get-resource-access-group.act";
import { Avatar } from "design-system/avatar";
import { Hint } from "design-system/hint";

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

    if (visibility === `manual`) {
      setView(ViewType.ManualForm);
      return;
    }

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
          </footer>
        </section>
      </Modal2.Body>
      <Modal2.Footer className="overflow-x-auto">
        <Tabs2>
          {RESOURCE_VISIBILITIES.map((type) => (
            <Tabs2.Item
              key={type}
              title={`Make this mindmap ${type}`}
              className="capitalize"
              active={activeMindmap.visibility === type}
              onClick={() => changeVisibility(type)}
              disabled={disabled}
            >
              <VisibilityIcon className="size-6 shrink-0" visibility={type} />
              <Tabs2.ItemText>{type}</Tabs2.ItemText>
            </Tabs2.Item>
          ))}
        </Tabs2>
      </Modal2.Footer>
    </>
  );
};

const ManualFormViewContainer = () => {
  const [phrase, setPhrase] = React.useState("");
  const [operation, setOperation] = React.useState<Transaction>({ is: `idle` });

  const { setView } = useFeatureContext();
  const [loadOperation, setLoadOperation] = React.useState<
    Transaction<API4MarkdownDto<"getResourceAccessGroups">>
  >({
    is: `idle`,
  });

  const close = (): void => {
    setView(ViewType.Details);
  };

  const confirmPhrase = async () => {
    setOperation({ is: `busy` });

    const result = await findUserAct();

    if (result.is === `ok`) {
      setPhrase("");
      setOperation({ is: `ok` });
      setLoadOperation((op) => ({
        is: `ok`,
        userProfiles: [
          result.data.userProfile,
          ...(op.is === `ok` ? op.userProfiles : []),
        ],
      }));
      return;
    }

    setOperation(result);
  };

  useEffect(() => {
    (async () => {
      setLoadOperation({ is: `busy` });

      const result = await getResourceAccessGroupAct();

      if (result.is === `ok`) {
        setLoadOperation({ is: `ok`, userProfiles: result.data.userProfiles });
        return;
      }

      setLoadOperation(result);
    })();
  }, []);

  const phraseValid = phrase.length >= 2 && phrase.length <= 30;

  return (
    <>
      <Modal2.Header
        title="Manual Visibility Management"
        closeButtonTitle="Close manual visibility management"
      />
      <Modal2.Body>
        <div>
          <p className="mb-4">
            Provide <strong>Email</strong> or <strong>Display Name</strong> and{" "}
            <strong>confirm</strong> to give access to this mindmap only for
            specific users/user groups. Remember to save changes.
          </p>
          <Field
            label="Email/Display Name"
            hint={<Hint trigger={`Press enter to find`} />}
          >
            <Input
              placeholder="tom@gmail.com or tom1994"
              onChange={(e) => setPhrase(e.target.value)}
              value={phrase}
              onKeyDown={(e) => {
                if (phraseValid && e.key === `Enter`) {
                  confirmPhrase();
                }
              }}
            />
          </Field>
          <Button
            className="w-fit ml-auto mt-2"
            title="Add user to shared list"
            auto
            disabled={operation.is === `busy` || !phraseValid}
            s={1}
            i={2}
            onClick={confirmPhrase}
          >
            Find <BiSearch />
          </Button>
          {loadOperation.is === "fail" && (
            <p className="mt-4 flex gap-2 text-sm justify-center items-center bg-red-300 dark:bg-red-700 p-2 rounded-md">
              <BiErrorAlt className="shrink-0" size={20} />
              {loadOperation.error.message}
            </p>
          )}
          {operation.is === "fail" && (
            <p className="mt-4 flex gap-2 text-sm justify-center items-center bg-red-300 dark:bg-red-700 p-2 rounded-md">
              <BiErrorAlt className="shrink-0" size={20} />
              {operation.error.message}
            </p>
          )}
          {loadOperation.is === "ok" && (
            <>
              <h6 className="text-md mt-2 mb-3">
                Shared for ({loadOperation.userProfiles.length})
              </h6>
              <div className="flex flex-wrap gap-3">
                {loadOperation.userProfiles.map((userProfile) => (
                  <button
                    className="focus:outline outline-2 outline-black dark:outline-white flex-1 cursor-pointer border-2 rounded-lg flex items-center gap-3 p-2 bg-zinc-200 dark:hover:bg-gray-900 dark:bg-gray-950 hover:bg-zinc-300 border-zinc-300 dark:border-zinc-800"
                    key={userProfile.id}
                  >
                    <Avatar
                      size="sm"
                      alt="User avatar"
                      className="bg-gray-300 dark:bg-slate-800"
                      char={
                        userProfile.displayName
                          ? userProfile.displayName.charAt(0)
                          : undefined
                      }
                      src={userProfile.avatar?.sm.src}
                    />
                    <div className="flex flex-col items-start">
                      <strong className="text-sm text-left">
                        {userProfile.displayName}
                      </strong>
                      <span className="text-sm text-left">
                        {userProfile.email}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
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
            disabled={operation.is === `busy`}
            title="Cancel manual visibility changes"
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            i={2}
            s={2}
            disabled={operation.is === `busy`}
            auto
            title="Confirm manual visibility changes"
          >
            Save
          </Button>
        </div>
      </Modal2.Footer>
    </>
  );
};

const MindmapDetailsModalContainer = () => {
  const { view } = useFeatureContext();
  const { operation: mindmapOperation } = useMindmapCreatorState();

  const disabled = mindmapOperation.is === `busy`;

  return (
    <Modal2 disabled={disabled} onClose={closeMindmapDetailsAction}>
      {view === ViewType.Details && <MindmapDetailsViewContainer />}
      {view === ViewType.Delete && <DeleteMindmapViewContainer />}
      {view === ViewType.ManualForm && <ManualFormViewContainer />}
    </Modal2>
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
