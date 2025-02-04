import { Button } from 'design-system/button';
import { usePortal } from 'development-kit/use-portal';
import React from 'react';
import { BiAddToQueue, BiSave } from 'react-icons/bi';
import { useMindmapModalsContext } from '../providers/mindmap-widgets.provider';

const MindmapToolboxContainer = () => {
  const { render } = usePortal();
  const { creation } = useMindmapModalsContext();

  return render(
    <nav className="fixed flex justify-center space-x-2 bottom-0 py-2 max-w-sm mx-auto left-0 right-0">
      <Button i={2} s={2} title="Save mindmap changes">
        <BiSave />
      </Button>
      <Button i={2} s={2} onClick={creation.on} title="Add new mindmap node">
        <BiAddToQueue />
      </Button>
    </nav>,
  );
};

export { MindmapToolboxContainer };
