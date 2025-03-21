import type { FullMindmapDto } from 'api-4markdown-contracts';
import type { Transaction } from 'development-kit/utility-types';

type MindmapPreviewNode = FullMindmapDto['nodes'][number];

type MindmapPreviewExternalNode = Extract<
  MindmapPreviewNode,
  { type: `external` }
>;

type MindmapPreviewEmbeddedNode = Extract<
  MindmapPreviewNode,
  { type: `embedded` }
>;

type MindmapPreviewState = {
  nodePreview: { is: `off` } | ({ is: `on` } & MindmapPreviewEmbeddedNode);
  mindmap: Transaction<FullMindmapDto>;
};

type MindmapPreviewEdge = FullMindmapDto['edges'][number];

type MindmapPreviewSolidEdge = Extract<MindmapPreviewEdge, { type: `solid` }>;

type MindmapPreviewOkMindmap = Extract<
  MindmapPreviewState['mindmap'],
  { is: `ok` }
>;

export type {
  MindmapPreviewState,
  MindmapPreviewExternalNode,
  MindmapPreviewNode,
  MindmapPreviewEmbeddedNode,
  MindmapPreviewEdge,
  MindmapPreviewSolidEdge,
  MindmapPreviewOkMindmap,
};
