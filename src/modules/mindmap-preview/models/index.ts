import { Atoms } from "api-4markdown-contracts";
import { Prettify } from "development-kit/utility-types";
import {
  MindmapPreviewEmbeddedNode,
  MindmapPreviewExternalNode,
} from "store/mindmap-preview/models";

type MindmapNodeEngagementData = {
  rating?: Atoms["Rating"];
  score?: {
    average: number;
    count: number;
    values: Atoms["ScoreValue"][];
  };
  commentsCount?: number;
};

type MindmapPreviewEmbeddedNodeWithCompletion = Prettify<
  Omit<MindmapPreviewEmbeddedNode, "data"> & {
    data: Prettify<
      MindmapPreviewEmbeddedNode["data"] &
        MindmapNodeEngagementData & {
          mindmapId: Atoms["MindmapId"];
        }
    >;
  }
>;

type MindmapPreviewExternalNodeWithCompletion = Prettify<
  Omit<MindmapPreviewExternalNode, "data"> & {
    data: Prettify<
      MindmapPreviewExternalNode["data"] &
        MindmapNodeEngagementData & {
          mindmapId: Atoms["MindmapId"];
        }
    >;
  }
>;

type MindmapPreviewNodeWithCompletion =
  | MindmapPreviewEmbeddedNodeWithCompletion
  | MindmapPreviewExternalNodeWithCompletion;

export type {
  MindmapPreviewNodeWithCompletion,
  MindmapPreviewEmbeddedNodeWithCompletion,
  MindmapPreviewExternalNodeWithCompletion,
};
