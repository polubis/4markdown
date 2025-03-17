import type { API4MarkdownDto } from 'api-4markdown-contracts';
import type { Transaction } from 'development-kit/utility-types';

type MindmapPreviewState = Transaction<{
  mindmap: API4MarkdownDto<`getMindmap`>;
}>;

type MindmapPreviewOkState = Extract<MindmapPreviewState, { is: `ok` }>;

type MindmapPreviewNode = MindmapPreviewOkState['mindmap']['nodes'][number];

type MindmapPreviewExternalNode = Extract<
  MindmapPreviewNode,
  { type: `external` }
>;

type MindmapPreviewEmbeddedNode = Extract<
  MindmapPreviewNode,
  { type: `embedded` }
>;

type MindmapPreviewEdge = MindmapPreviewOkState['mindmap']['edges'][number];

type MindmapPreviewSolidEdge = Extract<MindmapPreviewEdge, { type: `solid` }>;

export type {
  MindmapPreviewState,
  MindmapPreviewOkState,
  MindmapPreviewExternalNode,
  MindmapPreviewNode,
  MindmapPreviewEmbeddedNode,
  MindmapPreviewEdge,
  MindmapPreviewSolidEdge,
};
