import type { Atoms } from "api-4markdown-contracts";

export type PreviousWorkEntryDocument = {
  type: "document";
  resourceId: Atoms["DocumentId"];
  title: string;
  lastTouched: number;
};

export type PreviousWorkEntryMindmap = {
  type: "mindmap";
  resourceId: Atoms["MindmapId"];
  title: string;
  lastTouched: number;
};

export type PreviousWorkEntryMindmapNode = {
  type: "mindmap-node";
  resourceId: Atoms["MindmapNodeId"];
  mindmapId: Atoms["MindmapId"];
  title: string;
  lastTouched: number;
};

export type PreviousWorkEntry =
  | PreviousWorkEntryDocument
  | PreviousWorkEntryMindmap
  | PreviousWorkEntryMindmapNode;

export type PreviousWorkState = {
  entries: PreviousWorkEntry[];
  openRequested: boolean;
};
