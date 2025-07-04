import type {
	EdgeProps,
	EdgeTypes,
	NodeProps,
	NodeTypes,
	Viewport,
} from "@xyflow/react";
import { Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";
import React, { type ComponentType } from "react";
import { setLastViewport, useMindmapCreatorState } from "store/mindmap-creator";
import { Button } from "design-system/button";
import {
	BiAddToQueue,
	BiCollapse,
	BiExpand,
	BiGrid,
	BiHorizontalRight,
	BiTrash,
} from "react-icons/bi";
import c from "classnames";
import {
	alignViewAction,
	connectNodesAction,
	openNodeFormAction,
	resetOperationAction,
	rotateViewAction,
	startNodesRemovalAction,
	toggleHeaderAction,
	updateEdgesAction,
	updateNodesAction,
} from "store/mindmap-creator/actions";
import type {
	MindmapCreatorEdge,
	MindmapCreatorNode,
	MindmapCreatorState,
} from "store/mindmap-creator/models";
import {
	ExternalNodeTileX,
	ExternalNodeTileY,
} from "../components/external-node-tile";
import {
	EmbeddedNodeTileContainerX,
	EmbeddedNodeTileContainerY,
} from "./embedded-node-tile.container";
import { SolidEdgeContainer } from "./solid-edge.container";
import { selectedNodesSelector } from "store/mindmap-creator/selectors";
import { NodesRemovalConfirmationContainer } from "./nodes-removal-confirmation.container";
import ErrorModal from "components/error-modal";
import { reloadYourMindmapsAct } from "acts/reload-your-mindmaps.act";
import { NodePreviewModalContainer } from "./node-preview-modal.container";
import { ScreenLoader } from "design-system/screen-loader";
import { MindmapDetailsModalContainer } from "./mindmap-details-modal.container";

const NodeFormModalContainer = React.lazy(() =>
	import(`./node-form-modal.container`).then((m) => ({
		default: m.NodeFormModalContainer,
	})),
);

const RemoveSelectedNodesContainer = () => {
	const selectedNodes = useMindmapCreatorState(selectedNodesSelector);

	return (
		<Button
			i={2}
			disabled={selectedNodes.length === 0}
			s={1}
			title="Remove selected nodes"
			onClick={startNodesRemovalAction}
		>
			<BiTrash />
		</Button>
	);
};

const ToolboxContainer = () => {
	const { headerVisible } = useMindmapCreatorState();

	return (
		<nav
			className={c(
				"fixed flex justify-center space-x-2 max-w-sm mx-auto right-3 md:right-0 md:left-0",
				headerVisible ? "bottom-[134px] md:bottom-3" : "bottom-3",
			)}
		>
			<RemoveSelectedNodesContainer />
			<Button
				i={2}
				s={1}
				onClick={() => openNodeFormAction()}
				title="Add new mindmap node"
			>
				<BiAddToQueue />
			</Button>
		</nav>
	);
};

type MindmapNodeTypes = {
	[Orientation in MindmapCreatorState["orientation"]]: {
		[Type in MindmapCreatorNode["type"]]: ComponentType<
			NodeProps<Extract<MindmapCreatorNode, { type: Type }>>
		>;
	};
};

type MindmapEdgeTypes = {
	[Type in MindmapCreatorEdge["type"]]: ComponentType<
		EdgeProps<Extract<MindmapCreatorEdge, { type: Type }>>
	>;
};

const mindmapNodeTypes: MindmapNodeTypes = {
	x: {
		external: ExternalNodeTileX,
		embedded: EmbeddedNodeTileContainerX,
	},
	y: {
		external: ExternalNodeTileY,
		embedded: EmbeddedNodeTileContainerY,
	},
};

const edgeTypes: MindmapEdgeTypes = {
	solid: SolidEdgeContainer,
};

const MindmapCreatorContainer = () => {
	const ref = React.useRef<HTMLDivElement | null>(null);
	const {
		orientation,
		nodes,
		edges,
		operation,
		mindmapDetails,
		activeMindmapId,
		nodeForm,
		nodesRemovalConfirmation,
		headerVisible,
	} = useMindmapCreatorState();

	const updateLatestViewport = React.useCallback((viewport: Viewport) => {
		const rect = ref.current?.getBoundingClientRect();

		if (!rect) return;

		setLastViewport({
			...viewport,
			width: rect.width,
			height: rect.height,
		});
	}, []);

	return (
		<>
			<ReactFlow
				ref={ref}
				key={activeMindmapId + orientation}
				nodes={nodes}
				edges={edges}
				onNodesChange={updateNodesAction}
				onEdgesChange={updateEdgesAction}
				onConnect={connectNodesAction}
				nodeTypes={mindmapNodeTypes[orientation] as NodeTypes}
				edgeTypes={edgeTypes as EdgeTypes}
				onViewportChange={updateLatestViewport}
				fitView
			>
				<Controls>
					<Button
						i={2}
						s={1}
						title={
							headerVisible
								? `Enter full screen mode`
								: `Finish full screen mode`
						}
						onClick={toggleHeaderAction}
					>
						{headerVisible ? <BiExpand /> : <BiCollapse />}
					</Button>
					<Button
						i={2}
						s={1}
						title="Change mindmap orientation"
						onClick={rotateViewAction}
					>
						<BiHorizontalRight
							className={c({
								"rotate-90": orientation === `y`,
							})}
						/>
					</Button>
					<Button i={2} s={1} title="Align mindmap" onClick={alignViewAction}>
						<BiGrid />
					</Button>
				</Controls>
				<Background />
				<MiniMap className="hidden md:block" />
			</ReactFlow>
			<ToolboxContainer />
			{nodeForm.is !== `closed` && (
				<React.Suspense>
					<NodeFormModalContainer />
				</React.Suspense>
			)}
			{mindmapDetails.is === `on` && <MindmapDetailsModalContainer />}
			{nodesRemovalConfirmation.is === `active` && (
				<NodesRemovalConfirmationContainer />
			)}
			<NodePreviewModalContainer />
			{operation.is === `busy` && <ScreenLoader />}
			{operation.is === `fail` && (
				<ErrorModal
					heading="Ups, something went wrong"
					message={operation.error.message}
					footer={
						operation.error.symbol === `out-of-date` && (
							<Button
								type="button"
								i={2}
								s={2}
								auto
								title="Sync your mindmaps"
								onClick={reloadYourMindmapsAct}
							>
								Sync
							</Button>
						)
					}
					onClose={resetOperationAction}
				/>
			)}
		</>
	);
};

export { MindmapCreatorContainer };
