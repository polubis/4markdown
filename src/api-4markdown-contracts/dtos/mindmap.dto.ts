import type { Date, Id, Name } from '../atoms';
import type { DocumentDto } from './document.dto';

const MINDMAP_NODE_SOURCE_HANDLERS = {
  BOTTOM: `source-handle-bottom`,
  RIGHT: `source-handle-right`,
} as const;

const MINDMAP_NODE_TARGET_HANDLERS = {
  TOP: `target-handle-top`,
  LEFT: `target-handle-left`,
} as const;

type MindmapNodeSourceHandler =
  (typeof MINDMAP_NODE_SOURCE_HANDLERS)[keyof typeof MINDMAP_NODE_SOURCE_HANDLERS];
type MindmapNodeTargetHandler =
  (typeof MINDMAP_NODE_TARGET_HANDLERS)[keyof typeof MINDMAP_NODE_TARGET_HANDLERS];

type MindmapInternalNode = {
  id: Id;
  data: {
    document: DocumentDto;
    name: Name;
    description?: string;
  };
  type: `internal`;
  position: {
    x: number;
    y: number;
  };
};

type MindmapBasicEdge = {
  id: Id;
  type: `basic`;
  source: Id;
  target: Id;
  sourceHandle: MindmapNodeSourceHandler | null;
  targetHandle: MindmapNodeTargetHandler | null;
};

type MindmapEdge = MindmapBasicEdge;
type MindmapNode = MindmapInternalNode;

type MindmapNodeType = MindmapNode['type'];
type MindmapEdgeType = MindmapEdge['type'];

type MindmapDto = {
  id: Id;
  name: Name;
  description?: string;
  cdate: Date;
  mdate: Date;
  nodes: MindmapNode[];
  edges: MindmapEdge[];
};

export { MINDMAP_NODE_TARGET_HANDLERS, MINDMAP_NODE_SOURCE_HANDLERS };

export type {
  MindmapDto,
  MindmapNodeType,
  MindmapBasicEdge,
  MindmapNode,
  MindmapInternalNode,
  MindmapEdgeType,
  MindmapEdge,
  MindmapNodeSourceHandler,
  MindmapNodeTargetHandler,
};
