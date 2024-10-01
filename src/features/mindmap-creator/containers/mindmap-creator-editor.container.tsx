import '@xyflow/react/dist/base.css';
import './mindmap-creator-editor.css';

import React from 'react';
import { Button } from 'design-system/button';
import { BiArrowBack } from 'react-icons/bi';
import { ThemeSwitcher } from 'design-system/theme-switcher';
import { mindmapCreatorStoreSelectors } from 'store/mindmap-creator/mindmap-creator.store';
import { AppNavLink } from 'components/app-nav-link';
import MoreNav from 'components/more-nav';
import { ScreenLoader } from 'design-system/screen-loader';
import { MindmapPreviewContainer } from './mindmap-preview.container';
import { ReactFlowProvider } from '@xyflow/react';
import { SaveButtonContainer } from './save-button.container';
import { NewNodeButtonContainer } from './new-node-button.container';
import { OrientationButtonContainer } from './orientation-button.container';
import { AlignButtonContainer } from './align-button.container';
import { SettingsButtonContainer } from './settings-button.container';
import { EditNodeButtonContainer } from './edit-node-button.container';
import { RemoveNodesButtonContainer } from './remove-nodes-button.container';
import UserPopover from 'components/user-popover';

const SaveErrorModalContainer = React.lazy(() =>
  import(`./save-error-modal.container`).then((m) => ({
    default: m.SaveErrorModalContainer,
  })),
);

const NodeFormModalContainer = React.lazy(() =>
  import(`./node-form-modal.container`).then((m) => ({
    default: m.NodeFormModalContainer,
  })),
);

const MindmapSettingsModalContainer = React.lazy(() =>
  import(`./mindmap-settings-modal.container`).then((m) => ({
    default: m.MindmapSettingsModalContainer,
  })),
);

const NodesRemovalConfirmationContainer = React.lazy(() =>
  import(`./nodes-removal-confirmation.container`).then((m) => ({
    default: m.NodesRemovalConfirmationContainer,
  })),
);

const ErrorScreenContainer = React.lazy(() =>
  import(`./error-screen.container`).then((m) => ({
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

const MindmapCreatorNavigationContainer = () => {
  const mindmapCreatorStore = mindmapCreatorStoreSelectors.useState();

  return (
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
  );
};

const MindmapCreatorEditorContainer = () => {
  const mindmapCreatorStore = mindmapCreatorStoreSelectors.useState();

  return (
    <ReactFlowProvider>
      <MindmapCreatorNavigationContainer />
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
      {mindmapCreatorStore.saving.is === `fail` && (
        <React.Suspense>
          <SaveErrorModalContainer />
        </React.Suspense>
      )}
    </ReactFlowProvider>
  );
};

export { MindmapCreatorEditorContainer };
