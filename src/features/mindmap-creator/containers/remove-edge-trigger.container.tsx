import React from 'react';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';
import { removeNodesConnectionAction } from 'store/mindmap-creator/actions';

const RemoveEdgeTriggerContainer = ({
  labelX,
  labelY,
  id,
}: {
  id: string;
  labelX: number;
  labelY: number;
}) => (
  <Button
    i={2}
    s="auto"
    rounded
    style={{
      transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
      pointerEvents: `all`,
    }}
    className="nodrag nopan absolute h-5 w-5"
    onClick={() => removeNodesConnectionAction(id)}
  >
    <BiX />
  </Button>
);

export { RemoveEdgeTriggerContainer };
