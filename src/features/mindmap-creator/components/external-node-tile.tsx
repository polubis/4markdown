import React from "react";
import { HandleX, HandleY } from "./handles";
import { type NodeProps } from "@xyflow/react";
import { NodeTile } from "./node-tile";
import { Button } from "design-system/button";
import { BiPencil, BiWorld } from "react-icons/bi";
import type { MindmapCreatorExternalNode } from "store/mindmap-creator/models";
import { openNodeEditionAction } from "store/mindmap-creator/actions";

type ExternalNodeTileProps = NodeProps<MindmapCreatorExternalNode>;

const ExternalNodeTile = ({
	selected,
	id,
	positionAbsoluteX,
	positionAbsoluteY,
	data,
}: ExternalNodeTileProps) => {
	return (
		<NodeTile selected={selected}>
			<NodeTile.Label>External Resource</NodeTile.Label>
			<NodeTile.Name>{data.name}</NodeTile.Name>
			{data.description && (
				<NodeTile.Description>{data.description}</NodeTile.Description>
			)}
			<NodeTile.Toolbox>
				<Button
					i={2}
					s={1}
					title="Open node edition"
					onClick={(e) => {
						e.stopPropagation();
						openNodeEditionAction({
							type: `external`,
							id,
							position: {
								x: positionAbsoluteX,
								y: positionAbsoluteY,
							},
							data,
						});
					}}
				>
					<BiPencil />
				</Button>
				<a
					href={data.url}
					target="_blank"
					rel="noopener noreferrer"
					title="Open linked material in a new tab"
				>
					<Button
						i={2}
						s={1}
						onClick={(e) => {
							e.stopPropagation();
						}}
					>
						<BiWorld />
					</Button>
				</a>
			</NodeTile.Toolbox>
		</NodeTile>
	);
};

const ExternalNodeTileX = (props: ExternalNodeTileProps) => (
	<HandleX>
		<ExternalNodeTile {...props} />
	</HandleX>
);

const ExternalNodeTileY = (props: ExternalNodeTileProps) => (
	<HandleY>
		<ExternalNodeTile {...props} />
	</HandleY>
);

export { ExternalNodeTileX, ExternalNodeTileY };
