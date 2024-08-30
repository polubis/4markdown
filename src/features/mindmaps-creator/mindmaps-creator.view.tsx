import React from 'react';
import { Button } from 'design-system/button';
import {
  BiArrowBack,
  BiCog,
  BiEdit,
  BiHorizontalRight,
  BiPlus,
  BiSave,
  BiTrash,
} from 'react-icons/bi';
import { ThemeSwitcher } from 'design-system/theme-switcher';
import {
  mindmapsCreatorStoreActions,
  mindmapsCreatorStoreSelectors,
} from 'store/mindmaps-creator/mindmaps-creator.store';
import { AppNavLink } from 'components/app-nav-link';
import '@xyflow/react/dist/base.css';
import './mindmaps-creator.css';
import MoreNav from 'components/more-nav';
import { ScreenLoader } from 'design-system/screen-loader';
import { MindmapPreviewContainer } from './containers/mindmap-preview.container';
// @TODO[PRIO=5]: [Add facade to classnames].
import c from 'classnames';

const NodeFormModalContainer = React.lazy(() =>
  import(`./containers/node-form-modal.container`).then((m) => ({
    default: m.NodeFormModalContainer,
  })),
);

const MindmapSettingsModalContainer = React.lazy(() =>
  import(`./containers/mindmap-settings-modal.container`).then((m) => ({
    default: m.MindmapSettingsModalContainer,
  })),
);

const NodesRemovalConfirmationContainer = React.lazy(() =>
  import(`./containers/nodes-removal-confirmation.container`).then((m) => ({
    default: m.NodesRemovalConfirmationContainer,
  })),
);

const SelectionControlsContainer = () => {
  const selectedNodes = mindmapsCreatorStoreSelectors.useSelectedNodes();

  return (
    <>
      {selectedNodes.length > 0 && (
        <div className="bg-zinc-400 dark:border-zinc-800 w-6 h-0.5 mt-3 mb-6" />
      )}
      {selectedNodes.length === 1 && (
        <Button
          i={1}
          className="mb-3"
          s={2}
          title="Edit selected node"
          onClick={() =>
            mindmapsCreatorStoreActions.beginNodeEdition(selectedNodes[0].id)
          }
        >
          <BiEdit />
        </Button>
      )}
      {selectedNodes.length > 0 && (
        <Button
          i={1}
          className="mb-3"
          s={2}
          title="Delete selected mindmap nodes"
          onClick={mindmapsCreatorStoreActions.startNodesRemoval}
        >
          <BiTrash />
        </Button>
      )}
    </>
  );
};

/**
 * @TODO
 *
 * 1. Better error screen for loading.
 * 5. Add grid alignments.
 * 6. Add undo/redo.
 * 7. Connect saving feature.
 * 10. Connect to real API's
 * 11. Tab Index in modals - something is weird
 * 11. Create abckend endpoints.
 * 12. Create search docs endpont.
 * 13. Connect search docs to endpoint.
 * 16. Think about directions
 * 17. Think about tracking progress
 * 18. Show loaded details of document and preview in some section
 * 19 Connect addinew new mindmap (new modal an doption to choose).
 * 20. Add measureent sto store model.
 */

const MindmapsCreatorView = () => {
  const mindmapsCreatorStore = mindmapsCreatorStoreSelectors.useState();

  React.useEffect(() => {
    mindmapsCreatorStoreActions.load();
  }, []);

  return (
    <>
      <header className="flex items-center px-4 h-[72px] border-b-2 bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800">
        <AppNavLink to="/" title="Back to home page">
          <Button i={1} s={2}>
            <BiArrowBack />
          </Button>
        </AppNavLink>
        {mindmapsCreatorStore.is === `ok` && (
          <h1 className="text-lg font-bold ml-9">
            {mindmapsCreatorStore.mindmap.name}
          </h1>
        )}
        <ThemeSwitcher className="ml-auto" />
        <MoreNav className="ml-3" />
      </header>
      <main className="flex h-[calc(100svh-72px)]">
        <aside className="flex flex-col items-center w-[72px] shrink-0 p-4 border-r-2 bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800">
          {mindmapsCreatorStore.is === `ok` && (
            <>
              <Button
                i={1}
                s={2}
                className="mb-3"
                title="Save mindmap"
                disabled={mindmapsCreatorStore.saving.is === `busy`}
                onClick={mindmapsCreatorStoreActions.save}
              >
                <BiSave />
              </Button>
              <Button
                i={1}
                className="mb-3"
                s={2}
                title="Create new mindmap node"
                onClick={mindmapsCreatorStoreActions.startAddingNode}
              >
                <BiPlus />
              </Button>
              <div className="bg-zinc-400 dark:border-zinc-800 w-6 h-0.5 mt-3 mb-6" />
              <Button
                i={1}
                className="mb-3"
                s={2}
                title="Change mindmap orientation"
                onClick={mindmapsCreatorStoreActions.toggleOrientation}
              >
                <BiHorizontalRight
                  className={c({
                    'rotate-90':
                      mindmapsCreatorStore.mindmap.orientation === `y`,
                  })}
                />
              </Button>
              <SelectionControlsContainer />
              <Button
                i={1}
                s={2}
                className="mt-auto"
                title="Open mindmap settings"
                onClick={mindmapsCreatorStoreActions.openSettings}
              >
                <BiCog />
              </Button>
            </>
          )}
        </aside>
        {(mindmapsCreatorStore.is === `idle` ||
          mindmapsCreatorStore.is === `busy` ||
          mindmapsCreatorStore.saving.is === `busy`) && <ScreenLoader />}
        {mindmapsCreatorStore.is === `ok` && <MindmapPreviewContainer />}
        {mindmapsCreatorStore.is === `fail` && <div>error</div>}
      </main>
      {mindmapsCreatorStore.nodeFormOpened && (
        <React.Suspense>
          <NodeFormModalContainer />
        </React.Suspense>
      )}
      {mindmapsCreatorStore.settingsOpened && (
        <React.Suspense>
          <MindmapSettingsModalContainer />
        </React.Suspense>
      )}
      {mindmapsCreatorStore.removalConfirmationOpened && (
        <React.Suspense>
          <NodesRemovalConfirmationContainer />
        </React.Suspense>
      )}
    </>
  );
};

export { MindmapsCreatorView };
