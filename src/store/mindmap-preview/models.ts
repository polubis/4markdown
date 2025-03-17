import type { API4MarkdownDto } from 'api-4markdown-contracts';
import type { Transaction } from 'development-kit/utility-types';

type GetMindmapDto = API4MarkdownDto<`getMindmap`>;

type MindmapPreviewState = {
  nodePreview: { is: `off` } | ({ is: `on` } & GetMindmapDto);
  mindmap: Transaction<GetMindmapDto>;
};

type MindmapPreviewNode = GetMindmapDto['nodes'][number];

type MindmapPreviewExternalNode = Extract<
  MindmapPreviewNode,
  { type: `external` }
>;

type MindmapPreviewEmbeddedNode = Extract<
  MindmapPreviewNode,
  { type: `embedded` }
>;

type MindmapPreviewEdge = GetMindmapDto['edges'][number];

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
