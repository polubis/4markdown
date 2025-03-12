import { Button } from 'design-system/button';
import { Modal } from 'design-system/modal';
import React, { type FormEventHandler } from 'react';
import c from 'classnames';
import { BiPencil, BiTrash } from 'react-icons/bi';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import {
  closeMindmapDetailsAction,
  openMindmapFormAction,
} from 'store/mindmap-creator/actions';
import { safeActiveMindmapSelector } from 'store/mindmap-creator/selectors';
import { navigate } from 'gatsby';
import { formatDistance } from 'date-fns';
import { Tabs } from 'design-system/tabs';
import { Input } from 'design-system/input';
import { Field } from 'design-system/field';
import { context } from 'development-kit/context';
import { meta } from '../../../../meta';
import { deleteMindmapAct } from 'acts/delete-mindmap.act';
import { updateMindmapVisibilityAct } from 'acts/update-mindmap-visibility.act';
import type { MindmapDto } from 'api-4markdown-contracts';

const enum ViewType {
  Details = `details`,
  Delete = `delete`,
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

  const handleConfirm: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    deleteMindmapAct();
  };

  return (
    <>
      <Modal.Header
        title="Remove Mindmap"
        closeButtonTitle="Close mindmap details"
      />
      <form onSubmit={handleConfirm}>
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
        <footer className="mt-6 flex space-x-3">
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
          >
            Remove
          </Button>
        </footer>
      </form>
    </>
  );
};

const MindmapDetailsViewContainer = () => {
  const { setView } = useFeatureContext();
  const { operation } = useMindmapCreatorState();

  const disabled = operation.is === `busy`;
  const activeMindmap = useMindmapCreatorState(safeActiveMindmapSelector);

  const changeVisibility = (visibility: MindmapDto['visibility']): void => {
    if (activeMindmap.visibility === visibility) return;

    updateMindmapVisibilityAct(visibility);
  };

  return (
    <>
      <Modal.Header
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
      </Modal.Header>
      <section className="flex flex-col space-y-1">
        <p>
          Name: <strong>{activeMindmap.name}</strong>
        </p>
        {activeMindmap.description && (
          <p>
            Description:{` `}
            <strong className="break-words">{activeMindmap.description}</strong>
          </p>
        )}
        {Array.isArray(activeMindmap.tags) && activeMindmap.tags.length > 0 && (
          <p>
            Tags:{` `}
            <strong className="break-words">
              {activeMindmap.tags.join(`, `)}
            </strong>
          </p>
        )}
        <p>
          Visibility:{` `}
          <strong
            className={c(
              `capitalize`,
              {
                'text-green-700 dark:text-green-600':
                  activeMindmap.visibility === `public` ||
                  activeMindmap.visibility === `permanent`,
              },
              {
                'text-gray-600 dark:text-gray-400':
                  activeMindmap.visibility === `private`,
              },
            )}
          >
            {activeMindmap.visibility}
          </strong>
        </p>
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
          {(activeMindmap.visibility === `public` ||
            activeMindmap.visibility === `permanent`) && (
            <button
              className="underline underline-offset-2 text-blue-800 dark:text-blue-500"
              title="Mindmap preview"
              onClick={() =>
                navigate(
                  `${meta.routes.mindmaps.preview}?id=${activeMindmap.id}`,
                )
              }
            >
              <strong>Preview</strong>
            </button>
          )}
          {activeMindmap.visibility === `permanent` && (
            <button
              className="underline underline-offset-2 text-blue-800 dark:text-blue-500 ml-3"
              title="Mindmap URL"
              onClick={() => navigate(activeMindmap.path)}
            >
              <strong>URL</strong>
            </button>
          )}
        </footer>
      </section>

      <Tabs className="mt-8">
        <Tabs.Item
          title="Make this mindmap private"
          active={activeMindmap.visibility === `private`}
          onClick={() => changeVisibility(`private`)}
          disabled={disabled}
        >
          Private
        </Tabs.Item>
        <Tabs.Item
          title="Make this mindmap public"
          active={activeMindmap.visibility === `public`}
          onClick={() => changeVisibility(`public`)}
          disabled={disabled}
        >
          Public
        </Tabs.Item>
        <Tabs.Item
          title="Make this mindmap permanent"
          active={activeMindmap.visibility === `permanent`}
          onClick={() => changeVisibility(`permanent`)}
          disabled={disabled}
        >
          Permanent
        </Tabs.Item>
      </Tabs>
    </>
  );
};

const MindmapDetailsModalContainer = () => {
  const { view } = useFeatureContext();
  const { operation } = useMindmapCreatorState();

  const disabled = operation.is === `busy`;

  return (
    <Modal disabled={disabled} onClose={closeMindmapDetailsAction}>
      {view === ViewType.Details && <MindmapDetailsViewContainer />}
      {view === ViewType.Delete && <DeleteMindmapViewContainer />}
    </Modal>
  );
};

const ConnectedMindmapDetailsModalContainer = () => {
  return (
    <FeatureProvider>
      <MindmapDetailsModalContainer />
    </FeatureProvider>
  );
};

export { ConnectedMindmapDetailsModalContainer as MindmapDetailsModalContainer };
