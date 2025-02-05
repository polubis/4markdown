import { Button } from 'design-system/button';
import { usePortal } from 'development-kit/use-portal';
import React from 'react';
import { BiAddToQueue, BiSave } from 'react-icons/bi';
import { useMindmapModalsContext } from '../providers/mindmap-widgets.provider';
import type { Transaction } from 'development-kit/utility-types';
import { ScreenLoader } from 'design-system/screen-loader';
import { updateMindmapShapeAct } from 'acts/update-mindmap-shape.act';
import ErrorModal from 'components/error-modal';

const MindmapToolboxContainer = () => {
  const { render } = usePortal();
  const { creation } = useMindmapModalsContext();
  const [operation, setOperation] = React.useState<Transaction>({ is: `idle` });

  const updateMindmapShape = async (): Promise<void> => {
    setOperation({ is: `busy` });
    setOperation(await updateMindmapShapeAct());
  };

  if (operation.is === `busy`) {
    return render(<ScreenLoader />);
  }

  if (operation.is === `fail`) {
    return (
      <ErrorModal
        heading="Cannot update mindmap shape"
        message={operation.error.message}
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
        onClick={updateMindmapShape}
      >
        <BiSave />
      </Button>
      <Button i={2} s={2} onClick={creation.on} title="Add new mindmap node">
        <BiAddToQueue />
      </Button>
    </nav>,
  );
};

export { MindmapToolboxContainer };
