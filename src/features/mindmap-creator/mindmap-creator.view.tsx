import React from 'react';
import { Button } from 'design-system/button';
import { BiArrowBack } from 'react-icons/bi';
import { ThemeSwitcher } from 'design-system/theme-switcher';
import {
  mindmapCreatorStoreActions,
  mindmapCreatorStoreSelectors,
} from 'store/mindmap-creator/mindmap-creator.store';
import { AppNavLink } from 'components/app-nav-link';
import '@xyflow/react/dist/base.css';
import './mindmap-creator.css';
import MoreNav from 'components/more-nav';
import { ScreenLoader } from 'design-system/screen-loader';
import { MindmapPreviewContainer } from './containers/mindmap-preview.container';
import { ReactFlowProvider } from '@xyflow/react';
import { SaveButtonContainer } from './containers/save-button.container';
import { NewNodeButtonContainer } from './containers/new-node-button.container';
import { OrientationButtonContainer } from './containers/orientation-button.container';
import { AlignButtonContainer } from './containers/align-button.container';
import { SettingsButtonContainer } from './containers/settings-button.container';
import { EditNodeButtonContainer } from './containers/edit-node-button.container';
import { RemoveNodesButtonContainer } from './containers/remove-nodes-button.container';
import UserPopover from 'components/user-popover';

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

const ErrorScreenContainer = React.lazy(() =>
  import(`./containers/error-screen.container`).then((m) => ({
    default: m.ErrorScreenContainer,
  })),
);

const SelectionControlsContainer = () => {
  const selectedNodes = mindmapCreatorStoreSelectors.useSelectedNodes();

  return (
    <>
      {selectedNodes.length > 0 && (
        <div className="bg-zinc-400 dark:border-zinc-800 w-6 h-0.5 mt-3 mb-6" />
      )}
      {selectedNodes.length === 1 && <EditNodeButtonContainer />}
      {selectedNodes.length > 0 && <RemoveNodesButtonContainer />}
    </>
  );
};

/**
 * @TODO
 *
 * 6. Add undo/redo.
 * 10. Connect to real API's
 * 11. Tab Index in modals - something is weird
 * 11. Create abckend endpoints.
 * 12. Create search docs endpont.
 * Improve auto selection - add animation after edit or smeth else.
 * 13. Connect search docs to endpoint.
 * 17. Think about tracking progress
 * 18. Show loaded details of document and preview in some section
 * 19 Connect addinew new mindmap (new modal an doption to choose).
 * 22. Vsibility of the documents
 * 23. Block multiple modals apperance.
Error screen for saving 
put element in the place where last interaction has been done
*/

const MindmapCreatorView = () => {
  const mindmapCreatorStore = mindmapCreatorStoreSelectors.useState();

  React.useEffect(() => {
    mindmapCreatorStoreActions.load();
  }, []);

  return (
    <ReactFlowProvider>
      <header className="flex items-center px-4 h-[72px] border-b-2 bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800">
        <AppNavLink to="/" title="Back to home page">
          <Button i={1} s={2}>
            <BiArrowBack />
          </Button>
        </AppNavLink>
        {mindmapCreatorStore.is === `ok` && (
          <h1 className="text-lg font-bold ml-9">
            {mindmapCreatorStore.mindmap.name}
          </h1>
        )}
        <ThemeSwitcher className="ml-auto" />
        <UserPopover className="ml-3" />
        <MoreNav className="ml-3" />
      </header>
      <main className="flex h-[calc(100svh-72px)]">
        <aside className="flex flex-col items-center w-[72px] shrink-0 p-4 border-r-2 bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800">
          {mindmapCreatorStore.is === `ok` && (
            <>
              <SaveButtonContainer />
              <NewNodeButtonContainer />
              <div className="bg-zinc-400 dark:border-zinc-800 w-6 h-0.5 mt-3 mb-6" />
              <OrientationButtonContainer />
              <AlignButtonContainer />
              <SelectionControlsContainer />
              <SettingsButtonContainer />
            </>
          )}
        </aside>
        {(mindmapCreatorStore.is === `idle` ||
          mindmapCreatorStore.is === `busy` ||
          mindmapCreatorStore.saving.is === `busy`) && <ScreenLoader />}
        {mindmapCreatorStore.is === `ok` && <MindmapPreviewContainer />}
        {mindmapCreatorStore.is === `fail` && (
          <React.Suspense>
            <ErrorScreenContainer />
          </React.Suspense>
        )}
      </main>
      {mindmapCreatorStore.nodeFormOpened && (
        <React.Suspense>
          <NodeFormModalContainer />
        </React.Suspense>
      )}
      {mindmapCreatorStore.settingsOpened && (
        <React.Suspense>
          <MindmapSettingsModalContainer />
        </React.Suspense>
      )}
      {mindmapCreatorStore.removalConfirmationOpened && (
        <React.Suspense>
          <NodesRemovalConfirmationContainer />
        </React.Suspense>
      )}
    </ReactFlowProvider>
  );
};

export { MindmapCreatorView };
