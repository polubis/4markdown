import { Button } from 'design-system/button';
import { usePortal } from 'development-kit/use-portal';
import React from 'react';
import { BiAddToQueue } from 'react-icons/bi';
import { useMindmapModalsContext } from '../providers/mindmap-widgets.provider';
import { CreateNodeModalContainer } from './create-node-modal.container';

const MindmapToolboxContainer = () => {
  const { render } = usePortal();
  const { creation } = useMindmapModalsContext();

  return (
    <>
      {render(
        <nav className="fixed flex justify-center bottom-0 rounded-tr-md rounded-tl-md p-2 max-w-sm mx-auto left-0 right-0 bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 border">
          <Button
            i={1}
            s={2}
            onClick={creation.on}
            title="Add new mindmap node"
          >
            <BiAddToQueue />
          </Button>
        </nav>,
      )}

      {creation.isOn && <CreateNodeModalContainer />}
    </>
  );
};

export { MindmapToolboxContainer };
