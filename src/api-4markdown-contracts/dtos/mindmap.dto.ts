import type { Date, Id, Name } from '../atoms';
import type { DocumentDto } from './document.dto';

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

export type {
  MindmapDto,
  MindmapNodeType,
  MindmapBasicEdge,
  MindmapNode,
  MindmapInternalNode,
  MindmapEdgeType,
  MindmapEdge,
};
