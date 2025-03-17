import {
  Background,
  MiniMap,
  type NodeTypes,
  type EdgeTypes,
  ReactFlow,
  type EdgeProps,
  type NodeProps,
} from '@xyflow/react';
import React, { type ComponentType } from 'react';
import { useMindmapPreviewState } from 'store/mindmap-preview';
import { readyMindmapPreviewSelector } from 'store/mindmap-preview/selectors';
import {
  ExternalNodeTileX,
  ExternalNodeTileY,
} from '../components/external-node-tile';
import { SolidEdge } from '../components/solid-edge';
import type {
  MindmapPreviewEdge,
  MindmapPreviewNode,
  MindmapPreviewOkMindmap,
} from 'store/mindmap-preview/models';
import {
  EmbeddedNodeTileContainerX,
  EmbeddedNodeTileContainerY,
} from './embedded-node-tile.container';

type MindmapNodeTypes = {
  [Orientation in MindmapPreviewOkMindmap['orientation']]: {
    [Type in MindmapPreviewNode['type']]: ComponentType<
      NodeProps<Extract<MindmapPreviewNode, { type: Type }>>
    >;
  };
};

type MindmapEdgeTypes = {
  [Type in MindmapPreviewEdge['type']]: ComponentType<
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

const MindmapVisualizerContainer = () => {
  const mindmap = useMindmapPreviewState((state) =>
    readyMindmapPreviewSelector(state.mindmap),
  );

  return (
    <ReactFlow
      nodes={mindmap.nodes}
      edges={mindmap.edges}
      nodeTypes={mindmapNodeTypes[mindmap.orientation] as NodeTypes}
      edgeTypes={edgeTypes as EdgeTypes}
      fitView
    >
      <Background />
      <MiniMap className="hidden md:block" />
    </ReactFlow>
  );
};

export { MindmapVisualizerContainer };
