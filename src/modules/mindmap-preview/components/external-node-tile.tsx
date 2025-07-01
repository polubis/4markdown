import type { NodeProps } from "@xyflow/react";
import { Button } from "design-system/button";
import React from "react";
import { BiWorld } from "react-icons/bi";
import type { MindmapPreviewExternalNode } from "store/mindmap-preview/models";
import { HandleX, HandleY } from "./handles";
import { NodeTile } from "./node-tile";

type ExternalNodeTileProps = NodeProps<MindmapPreviewExternalNode>;

const ExternalNodeTile = ({ data }: ExternalNodeTileProps) => {
	return (
		<NodeTile selected={false}>
			<NodeTile.Label>External Resource</NodeTile.Label>
			<NodeTile.Name>{data.name}</NodeTile.Name>
			{data.description && (
				<NodeTile.Description>{data.description}</NodeTile.Description>
			)}
			<NodeTile.Toolbox>
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
