import React from 'react';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';
import { removeEdgeAction } from '../store/actions';
import type { MindmapCreatorEdge } from '../store/models';

const RemoveEdgeTriggerContainer = ({
  labelX,
  labelY,
  id,
}: {
  id: MindmapCreatorEdge['id'];
  labelX: number;
  labelY: number;
}) => (
  <Button
    i={2}
    s="auto"
    style={{
      transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
      pointerEvents: `all`,
    }}
    className="nodrag nopan absolute h-5 w-5"
    onClick={() => removeEdgeAction(id)}
  >
    <BiX />
  </Button>
);

export { RemoveEdgeTriggerContainer };
