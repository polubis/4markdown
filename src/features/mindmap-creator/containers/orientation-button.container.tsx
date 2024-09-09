import React from 'react';
import { Button } from 'design-system/button';
import { BiHorizontalRight } from 'react-icons/bi';
import {
  mindmapCreatorStoreActions,
  mindmapCreatorStoreSelectors,
} from 'store/mindmap-creator/mindmap-creator.store';
import { useKeyPress } from '@xyflow/react';
// @TODO[PRIO=5]: [Add facade to classnames].
import c from 'classnames';
import { useViewCenter } from '../core/use-view-center';

const OrientationButtonContainer = () => {
  const orientationChangePressed = useKeyPress(`o`);
  const { centerView } = useViewCenter();
  const mindmapCreatorStore = mindmapCreatorStoreSelectors.useOk();

  React.useEffect(() => {
    if (orientationChangePressed) {
      mindmapCreatorStoreActions.toggleOrientation();
      centerView();
    }
  }, [orientationChangePressed, centerView]);

  return (
    <Button
      i={1}
      className="mb-3"
      s={2}
      title="Change mindmap orientation (o)"
      onClick={mindmapCreatorStoreActions.toggleOrientation}
    >
      <BiHorizontalRight
        className={c({
          'rotate-90': mindmapCreatorStore.mindmap.orientation === `y`,
        })}
      />
    </Button>
  );
};

export { OrientationButtonContainer };
