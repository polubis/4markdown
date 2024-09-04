import React from 'react';
import { Button } from 'design-system/button';
import { BiHorizontalRight } from 'react-icons/bi';
import {
  mindmapsCreatorStoreActions,
  mindmapsCreatorStoreSelectors,
} from 'store/mindmaps-creator/mindmaps-creator.store';
import { useKeyPress } from '@xyflow/react';
// @TODO[PRIO=5]: [Add facade to classnames].
import c from 'classnames';
import { useViewCenter } from '../core/use-view-center';

const OrientationButtonContainer = () => {
  const orientationChangePressed = useKeyPress(`o`);
  const { centerViewWhenSafe } = useViewCenter();
  const mindmapsCreatorStore = mindmapsCreatorStoreSelectors.useOk();

  React.useEffect(() => {
    if (orientationChangePressed) {
      mindmapsCreatorStoreActions.toggleOrientation();
      centerViewWhenSafe();
    }
  }, [orientationChangePressed, centerViewWhenSafe]);

  return (
    <Button
      i={1}
      className="mb-3"
      s={2}
      title="Change mindmap orientation (o)"
      onClick={mindmapsCreatorStoreActions.toggleOrientation}
    >
      <BiHorizontalRight
        className={c({
          'rotate-90': mindmapsCreatorStore.mindmap.orientation === `y`,
        })}
      />
    </Button>
  );
};

export { OrientationButtonContainer };
