import { Button } from 'design-system/button';
import React from 'react';
import { mindmapCreatorStoreActions } from 'store/mindmap-creator/mindmap-creator.store';
// @TODO[PRIO=4]: [Add the same error screen component for every place].
const ErrorScreenContainer = () => {
  return (
    <div className="flex mx-auto flex-col justify-center items-center h-screen">
      <div className="p-4 flex flex-col items-center max-w-[400px]">
        <h6 className="text-xl text-center">
          The mindmap cannot be loaded. Please ensure that the mindmap you are
          trying to display <strong>still exists</strong>.
        </h6>

        <Button
          title="Reload mindmap"
          className="mt-4"
          auto
          s={2}
          i={2}
          onClick={mindmapCreatorStoreActions.load}
        >
          Reload
        </Button>
      </div>
    </div>
  );
};

export { ErrorScreenContainer };
