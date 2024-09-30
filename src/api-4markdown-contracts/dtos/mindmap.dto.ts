import type { Date, Id, Name, Path } from '../atoms';
import type { PermanentDocumentDto, PublicDocumentDto } from './document.dto';

type MindmapInternalNode = {
  id: Id;
  data: {
    document: PublicDocumentDto | PermanentDocumentDto;
    name: Name;
    description?: string;
  };
  type: `internal`;
  position: {
    x: number;
    y: number;
  };
};

type MindmapExternalNode = {
  id: Id;
  data: {
    name: Name;
    url: Path;
    description?: string;
  };
  type: `external`;
  position: {
    x: number;
    y: number;
  };
};

type MindmapBasicEdge = {
  id: Id;
  type: `curved`;
  source: Id;
  target: Id;
};

type MindmapEdge = MindmapBasicEdge;
type MindmapNode = MindmapInternalNode | MindmapExternalNode;

type MindmapNodeType = MindmapNode['type'];
type MindmapEdgeType = MindmapEdge['type'];

type MindmapOrientation = 'x' | 'y';

type MindmapDtoBase = {
  id: Id;
  name: Name;
  description?: string;
  cdate: Date;
  mdate: Date;
  nodes: MindmapNode[];
  edges: MindmapEdge[];
  orientation: MindmapOrientation;
};

type PrivateMindmapDto = MindmapDtoBase & { visibility: `private` };
type PublicMindmapDto = MindmapDtoBase & { visibility: `public` };
type PermanentMindmapDto = MindmapDtoBase & { visibility: `permanent` };

type MindmapDto = PrivateMindmapDto | PublicMindmapDto | PermanentMindmapDto;

export type {
  MindmapDto,
  MindmapNodeType,
  MindmapBasicEdge,
  MindmapNode,
  MindmapInternalNode,
  MindmapEdgeType,
  MindmapEdge,
  MindmapExternalNode,
  MindmapOrientation,
  PrivateMindmapDto,
  PublicMindmapDto,
  PermanentMindmapDto,
};
