import { Button } from 'design-system/button';
import { usePortal } from 'development-kit/use-portal';
import React from 'react';
import {
  BiAddToQueue,
  BiHorizontalRight,
  BiSave,
  BiTrash,
} from 'react-icons/bi';
import { useMindmapModalsContext } from '../providers/mindmap-widgets.provider';
import { updateMindmapShapeAct } from 'acts/update-mindmap-shape.act';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { mindmapCreatorReadySelector } from 'store/mindmap-creator/selectors';
import { toggleOrientationAction } from 'store/mindmap-creator/actions';
import { useReactFlow } from '@xyflow/react';
import c from 'classnames';

const MindmapToolboxContainer = () => {
  const { render } = usePortal();
  const { savingDisabled, activeMindmap, saving } = useMindmapCreatorState(
    mindmapCreatorReadySelector,
  );
  const { nodeCreation, nodesRemovalConfirm } = useMindmapModalsContext();
  const { fitView } = useReactFlow();

  const toggleOrientation = (): void => {
    toggleOrientationAction();
    window.requestAnimationFrame(() => {
      fitView();
    });
  };

  const hasSelectedNode = React.useMemo(
    () => activeMindmap.nodes.some((node) => node.selected),
    [activeMindmap],
  );

  if (saving) return null;

  return render(
    <nav className="fixed flex justify-center space-x-2 bottom-0 py-2 max-w-sm mx-auto left-0 right-0">
      <Button i={2} s={1} title="Center mindmap" onClick={toggleOrientation}>
        <BiHorizontalRight
          className={c({
            'rotate-90': activeMindmap.orientation === `y`,
          })}
        />
      </Button>
      <Button
        i={2}
        s={1}
        title="Save mindmap changes"
        disabled={savingDisabled}
        onClick={updateMindmapShapeAct}
      >
        <BiSave />
      </Button>
      <Button
        i={2}
        disabled={!hasSelectedNode}
        s={1}
        title="Remove selected nodes"
        onClick={nodesRemovalConfirm.on}
      >
        <BiTrash />
      </Button>
      <Button
        i={2}
        s={1}
        onClick={nodeCreation.on}
        title="Add new mindmap node"
      >
        <BiAddToQueue />
      </Button>
    </nav>,
  );
};

export { MindmapToolboxContainer };
