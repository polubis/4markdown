import type { Atoms } from "api-4markdown-contracts";

type DocumentContributionInput = {
  type: "document";
  documentId: Atoms["DocumentId"];
  currentContent: string;
  isCompleted?: boolean;
};

type MindmapNodeContributionInput = {
  type: "mindmap-node";
  mindmapId: Atoms["MindmapId"];
  nodeId: Atoms["MindmapNodeId"];
  currentContent: string;
  isCompleted?: boolean;
};

type ResourceContributionInput =
  | DocumentContributionInput
  | MindmapNodeContributionInput;

export type {
  DocumentContributionInput,
  MindmapNodeContributionInput,
  ResourceContributionInput,
};
