import type { Mindmap, MindmapNode } from './mindmap.dto';

type MindmapNodeProgress = { visited: boolean; done: boolean };

type MindmapProgress = Record<
  Mindmap['id'],
  {
    nodes: Record<MindmapNode['id'], MindmapNodeProgress>;
  }
>;

export type { MindmapProgress, MindmapNodeProgress };
