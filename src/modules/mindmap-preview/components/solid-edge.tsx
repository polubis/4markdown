import { BaseEdge, getSimpleBezierPath, type EdgeProps } from "@xyflow/react";
import React from "react";
import type { MindmapPreviewSolidEdge } from "store/mindmap-preview/models";

type SolidEdgeProps = EdgeProps<MindmapPreviewSolidEdge>;

const SolidEdge = ({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
}: SolidEdgeProps) => {
	const [edgePath] = getSimpleBezierPath({
		sourceX,
		sourceY,
		targetX,
		targetY,
	});

	return (
		<BaseEdge
			className="!stroke-zinc-400 dark:!stroke-zinc-700"
			id={id}
			path={edgePath}
		/>
	);
};

export { SolidEdge };
