import {
  BaseEdge,
  EdgeLabelRenderer,
  getSimpleBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import React from "react";
import type { MindmapCreatorSolidEdge } from "store/mindmap-creator/models";
import { RemoveEdgeTriggerContainer } from "./remove-edge-trigger.container";

type SolidEdgeContainerProps = EdgeProps<MindmapCreatorSolidEdge>;

const SolidEdgeContainer = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: SolidEdgeContainerProps) => {
  const [edgePath, labelX, labelY] = getSimpleBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge
        className="!stroke-zinc-400 dark:!stroke-zinc-700"
        id={id}
        path={edgePath}
      />
      <EdgeLabelRenderer>
        <RemoveEdgeTriggerContainer labelX={labelX} labelY={labelY} id={id} />
      </EdgeLabelRenderer>
    </>
  );
};

export { SolidEdgeContainer };
