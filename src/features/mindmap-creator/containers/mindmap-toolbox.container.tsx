import { Button } from 'design-system/button';
import { usePortal } from 'development-kit/use-portal';
import React from 'react';
import { BiAddToQueue, BiSave } from 'react-icons/bi';
import { useMindmapModalsContext } from '../providers/mindmap-widgets.provider';
import type { Transaction } from 'development-kit/utility-types';
import { ScreenLoader } from 'design-system/screen-loader';
import { updateMindmapShapeAct } from 'acts/update-mindmap-shape.act';
import ErrorModal from 'components/error-modal';
import { reloadYourMindmapsAct } from 'acts/reload-your-mindmaps.act';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { mindmapReadySelector } from 'store/mindmap-creator/selectors';

const MindmapToolboxContainer = () => {
  const { render } = usePortal();
  const { savingDisabled } = useMindmapCreatorState(mindmapReadySelector);
  const { nodeCreation } = useMindmapModalsContext();
  const [operation, setOperation] = React.useState<Transaction>({ is: `idle` });

  const updateMindmapShape = async (): Promise<void> => {
    setOperation({ is: `busy` });
    setOperation(await updateMindmapShapeAct());
  };

  if (operation.is === `busy`) {
    return <ScreenLoader />;
  }

  if (operation.is === `fail`) {
    return (
      <ErrorModal
        heading="Cannot update mindmap shape"
        message={operation.error.message}
        footer={
          operation.error.symbol === `out-of-date` && (
            <Button
              i={2}
              s={2}
              auto
              title="Sync mindmap"
              onClick={reloadYourMindmapsAct}
            >
              Sync
            </Button>
          )
        }
        onClose={() => {
          setOperation({ is: `idle` });
        }}
      />
    );
  }

  return render(
    <nav className="fixed flex justify-center space-x-2 bottom-0 py-2 max-w-sm mx-auto left-0 right-0">
      <Button
        i={2}
        s={2}
        title="Save mindmap changes"
        disabled={savingDisabled}
        onClick={updateMindmapShape}
      >
        <BiSave />
      </Button>
      <Button
        i={2}
        s={2}
        onClick={nodeCreation.on}
        title="Add new mindmap node"
      >
        <BiAddToQueue />
      </Button>
    </nav>,
  );
};

export { MindmapToolboxContainer };
