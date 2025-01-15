import { Button } from 'design-system/button';
import Popover from 'design-system/popover';
import { useToggle } from 'development-kit/use-toggle';
import React from 'react';
import { BiPlusCircle } from 'react-icons/bi';
import { CreatorToolbox, type CreatorToolboxProps } from './creator-toolbox';

type MobileCreatorToolboxProps = {
  creator: CreatorToolboxProps['creator'];
};

const MobileCreatorToolbox = ({ creator }: MobileCreatorToolboxProps) => {
  const toolbox = useToggle();

  return (
    <div className="mx-auto relative md:hidden">
      <Button title="Open markdown toolbox" i={1} s={2} onClick={toolbox.open}>
        <BiPlusCircle />
      </Button>
      {toolbox.opened && (
        <Popover
          className="bottom-0 left-0 right-0 flex flex-wrap items-center justify-center gap-2 w-full rounded-br-none rounded-bl-none"
          onBackdropClick={toolbox.close}
        >
          <CreatorToolbox creator={creator} />
        </Popover>
      )}
    </div>
  );
};

export { MobileCreatorToolbox };
