import { Button } from 'design-system/button';
import Popover from 'design-system/popover';
import { useToggle } from 'development-kit/use-toggle';
import React from 'react';
import { BiText } from 'react-icons/bi';
import { CreatorToolbox, type CreatorToolboxProps } from './creator-toolbox';

const MobileCreatorToolbox = ({ creator, onClick }: CreatorToolboxProps) => {
  const toolbox = useToggle();

  const handleToolboxItemClick: CreatorToolboxProps['onClick'] = (
    syntax,
  ): void => {
    toolbox.close();
    onClick(syntax);
  };

  return (
    <div className="relative md:hidden">
      <Button title="Open markdown toolbox" i={1} s={2} onClick={toolbox.open}>
        <BiText />
      </Button>
      {toolbox.opened && (
        <Popover
          className="bottom-0 left-0 right-0 flex flex-wrap items-center justify-center gap-2 w-full rounded-br-none rounded-bl-none"
          onBackdropClick={toolbox.close}
        >
          <CreatorToolbox creator={creator} onClick={handleToolboxItemClick} />
        </Popover>
      )}
    </div>
  );
};

export { MobileCreatorToolbox };
