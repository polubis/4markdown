import { context, useFeature } from "@greenonsoftware/react-kit";
import { loadMindmapNodeCommentsAct } from "../acts/load-mindmap-node-comments.act";
import {
  MindmapNodeCommentsModuleProps,
  type MindmapNodeCommentFormData,
} from "../models";
import { useQuery2 } from "core/use-query-2";

const [MindmapNodeCommentsProvider, useMindmapNodeCommentsContext] = context(
  ({
    mindmapId,
    mindmapNodeId,
    commentsCount,
  }: Pick<
    MindmapNodeCommentsModuleProps,
    "mindmapId" | "mindmapNodeId" | "commentsCount"
  >) => {
    const commentForm = useFeature<MindmapNodeCommentFormData>();

    const commentsQuery = useQuery2({
      handler: () =>
        loadMindmapNodeCommentsAct({
          mindmapId,
          nodeId: mindmapNodeId,
          nextCursor: null,
          limit: 10,
        }),
    });

    return {
      commentForm,
      commentsQuery,
      commentsCount,
      mindmapId,
      mindmapNodeId,
    };
  },
);

export { MindmapNodeCommentsProvider, useMindmapNodeCommentsContext };
