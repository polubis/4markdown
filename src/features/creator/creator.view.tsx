import React from 'react';
import Markdown from 'components/markdown';
import { BiBookContent, BiSolidBookContent, BiWindows } from 'react-icons/bi';
import { Button } from 'design-system/button';
import {
  creatorStoreActions,
  creatorStoreSelectors,
} from 'store/creator/creator.store';
import c from 'classnames';
import { useConfirm } from 'development-kit/use-confirm';
import TemplatesPopover from './components/templates-popover';
import AddDocPopover from 'components/add-doc-popover';
import { useLsSync } from 'development-kit/use-ls-sync';
import {
  docManagementStoreActions,
  useDocManagementStore,
} from 'store/doc-management/doc-management.store';
import { DocBarContainer } from './containers/doc-bar.container';
import { ImageUploaderContainer } from './containers/image-uploader.container';
import { AppNavContainer } from 'containers/app-nav.container';
import {
  CreatorProvider,
  useCreatorProvider,
} from './providers/creator.provider';

const ErrorModal = React.lazy(() => import(`../../components/error-modal`));

type DivideMode = 'both' | 'preview' | 'code';

const CreatorView: React.FC = () => {
  useLsSync();

  const creator = useCreatorProvider();

  const docManagementStore = useDocManagementStore();
  const [divideMode, setDivideMode] = React.useState<DivideMode>(`both`);
  const { code, initialCode } = creatorStoreSelectors.useReady();

  const handleChange = (value: string): void => {
    creatorStoreActions.change(value);
  };

  const clearConfirm = useConfirm(() => handleChange(``));
  const resetConfirm = useConfirm(() => handleChange(initialCode));

  const divide = (): void => {
    if (divideMode === `both`) {
      setDivideMode(`code`);
      return;
    }

    if (divideMode === `code`) {
      setDivideMode(`preview`);
      return;
    }

    setDivideMode(`both`);
  };

  return (
    <>
      {docManagementStore.is === `fail` && (
        <React.Suspense>
          <ErrorModal
            heading="Ups, something went wrong"
            message={docManagementStore.error}
            onClose={docManagementStoreActions.idle}
          />
        </React.Suspense>
      )}
      <main className="flex h-full md:flex-col flex-col-reverse">
        <AppNavContainer>
          <AddDocPopover />
          <ImageUploaderContainer />
          <TemplatesPopover />
          <Button i={1} s={2} title="Change view display" onClick={divide}>
            {divideMode === `both` && (
              <BiBookContent className="rotate-90 md:rotate-0" />
            )}
            {divideMode === `code` && (
              <BiSolidBookContent className="rotate-180" />
            )}
            {divideMode === `preview` && <BiSolidBookContent />}
          </Button>

          <Button
            className="md:flex hidden"
            title="Open in separate window"
            i={1}
            s={2}
            onClick={() => {
              window.open(
                window.location.href,
                `_blank`,
                `width=${screen.availWidth},height=${screen.availHeight}`,
              );
            }}
          >
            <BiWindows />
          </Button>
          <Button
            i={2}
            s={2}
            auto
            className="md:flex hidden"
            disabled={code === ``}
            title="Clear content"
            onClick={clearConfirm.confirm}
          >
            {clearConfirm.opened ? `Sure?` : `Clear`}
          </Button>
          <Button
            i={2}
            s={2}
            auto
            className="md:flex hidden"
            disabled={code === initialCode}
            title="Reset content"
            onClick={resetConfirm.confirm}
          >
            {resetConfirm.opened ? `Sure?` : `Reset`}
          </Button>
        </AppNavContainer>
        <DocBarContainer />
        <section
          className={c(`grid h-[calc(100svh-72px-50px)]`, {
            'md:grid-cols-2 grid-cols-1 grid-rows-2 md:grid-rows-1':
              divideMode === `both`,
          })}
        >
          <Button s={2} i={2} auto onClick={creator.increment}>
            Increment ({creator.count})
          </Button>
        </section>
      </main>
    </>
  );
};

const ConnectedCreatorView = () => (
  <CreatorProvider>
    <CreatorView />
  </CreatorProvider>
);

export default ConnectedCreatorView;
