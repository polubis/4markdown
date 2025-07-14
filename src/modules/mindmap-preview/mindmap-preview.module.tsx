import {
  Background,
  MiniMap,
  type NodeTypes,
  type EdgeTypes,
  ReactFlow,
  type EdgeProps,
  type NodeProps,
  Controls,
} from "@xyflow/react";
import React, { type ComponentType } from "react";
import { useMindmapPreviewState } from "store/mindmap-preview";
import { readyMindmapPreviewSelector } from "store/mindmap-preview/selectors";
import {
  ExternalNodeTileX,
  ExternalNodeTileY,
} from "./components/external-node-tile";
import { SolidEdge } from "./components/solid-edge";
import type {
  MindmapPreviewEdge,
  MindmapPreviewNode,
  MindmapPreviewOkMindmap,
} from "store/mindmap-preview/models";
import {
  EmbeddedNodeTileContainerX,
  EmbeddedNodeTileContainerY,
} from "./containers/embedded-node-tile.container";
import { closeNodePreviewAction } from "store/mindmap-preview/actions";
import { MarkdownWidget } from "components/markdown-widget";

type MindmapNodeTypes = {
  [Orientation in MindmapPreviewOkMindmap["orientation"]]: {
    [Type in MindmapPreviewNode["type"]]: ComponentType<
      NodeProps<Extract<MindmapPreviewNode, { type: Type }>>
    >;
  };
};

type MindmapEdgeTypes = {
  [Type in MindmapPreviewEdge["type"]]: ComponentType<
    EdgeProps<Extract<MindmapPreviewEdge, { type: Type }>>
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
  solid: SolidEdge,
};

const MindmapPreviewModule = () => {
  const mindmap = useMindmapPreviewState((state) =>
    readyMindmapPreviewSelector(state.mindmap),
  );
  const nodePreview = useMindmapPreviewState((state) => state.nodePreview);

  return (
    <>
      <ReactFlow
        nodes={mindmap.nodes}
        edges={mindmap.edges}
        nodeTypes={mindmapNodeTypes[mindmap.orientation] as NodeTypes}
        edgeTypes={edgeTypes as EdgeTypes}
        fitView
      >
        <Controls />
        <Background />
        <MiniMap className="hidden md:block" />
      </ReactFlow>
      {nodePreview.is === `on` && (
        <MarkdownWidget
          chunksActive={false}
          onClose={closeNodePreviewAction}
          markdown={nodePreview.data.content || `No content for this node`}
        />
      )}
    </>
  );
};

export { MindmapPreviewModule };
