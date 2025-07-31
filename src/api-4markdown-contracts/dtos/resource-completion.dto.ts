import type {
  Date,
  DocumentId,
  MindmapId,
  MindmapNodeId,
  ResourceType,
} from "../atoms";

type ResourceCompletionDto =
  | {
      cdate: Date;
      type: Extract<ResourceType, "document">;
      resourceId: DocumentId;
    }
  | {
      cdate: Date;
      type: Extract<ResourceType, "mindmap">;
      resourceId: MindmapId;
    }
  | {
      cdate: Date;
      type: Extract<ResourceType, "mindmap-node">;
      resourceId: MindmapNodeId;
      parentId: MindmapId;
    };

export type { ResourceCompletionDto };
