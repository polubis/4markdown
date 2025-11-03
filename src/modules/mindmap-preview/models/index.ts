import { Atoms } from "api-4markdown-contracts";
import { Prettify } from "development-kit/utility-types";
import {
  MindmapPreviewEmbeddedNode,
  MindmapPreviewExternalNode,
} from "store/mindmap-preview/models";

type MindmapPreviewEmbeddedNodeWithCompletion = Prettify<
  Omit<MindmapPreviewEmbeddedNode, "data"> & {
    data: Prettify<
      MindmapPreviewEmbeddedNode["data"] & {
        mindmapId: Atoms["MindmapId"];
      }
    >;
  }
>;

type MindmapPreviewExternalNodeWithCompletion = Prettify<
  Omit<MindmapPreviewExternalNode, "data"> & {
    data: Prettify<
      MindmapPreviewExternalNode["data"] & {
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
