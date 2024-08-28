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
import {
  openMindmapSettings,
  startAddingNode,
  toggleMindmapOrientation,
} from 'store/mindmaps-creator/mindmaps-creator.actions';
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
          onClick={toggleMindmapOrientation}
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
          onClick={toggleMindmapOrientation}
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
 * 2. Connect edit form for select element.
 * 3. Connect removal of nodes.
 * 4. Add auto placing in free space.
 * 5. Add grid alignments.
 * 6. Add undo/redo.
 * 7. Connect saving feature.
 * 8. Migrate to old actions way - do not provide any refactors that are not needed.
 * 9. Add support for external nodes.
 * 10. Connect to real API's
 * 11. Create abckend endpoints.
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
          <Button
            i={1}
            s={2}
            className="mb-3"
            title="Save mindmap"
            onClick={startAddingNode}
          >
            <BiSave />
          </Button>
          <Button
            i={1}
            className="mb-3"
            s={2}
            title="Create new mindmap node"
            onClick={startAddingNode}
          >
            <BiPlus />
          </Button>
          {mindmapsCreatorStore.is === `ok` && (
            <>
              <Button
                i={1}
                className="mb-3"
                s={2}
                title="Change mindmap orientation"
                onClick={toggleMindmapOrientation}
              >
                <BiHorizontalRight
                  className={c({
                    'rotate-90':
                      mindmapsCreatorStore.mindmap.orientation === `y`,
                  })}
                />
              </Button>
              <SelectionControlsContainer />
            </>
          )}
          <Button
            i={1}
            s={2}
            className="mt-auto"
            title="Open mindmap settings"
            onClick={openMindmapSettings}
          >
            <BiCog />
          </Button>
        </aside>
        {(mindmapsCreatorStore.is === `idle` ||
          mindmapsCreatorStore.is === `busy`) && <ScreenLoader />}
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
    </>
  );
};

export { MindmapsCreatorView };
