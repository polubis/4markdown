import { context, useFeature } from "@greenonsoftware/react-kit";
import { loadMindmapNodeCommentsAct } from "../acts/load-mindmap-node-comments.act";
import {
  MindmapNodeCommentsModuleProps,
  type MindmapNodeCommentFormData,
} from "../models";
import { useQuery2 } from "core/use-query-2";

const [MindmapNodeCommentsProvider, useMindmapNodeCommentsContext] = context(
  ({
    mindmapNodeId,
    commentsCount,
    onCountChange,
  }: Pick<
    MindmapNodeCommentsModuleProps,
    "mindmapNodeId" | "commentsCount" | "onCountChange"
  >) => {
    const commentForm = useFeature<MindmapNodeCommentFormData>();

    const commentsQuery = useQuery2({
      initialize: false,
      handler: () =>
        loadMindmapNodeCommentsAct({
          resourceId: mindmapNodeId,
          nextCursor: null,
          limit: 10,
        }),
      onOk: (newData) => {
        onCountChange(newData.comments.length);
      },
    });

    return {
      commentForm,
      commentsQuery,
      commentsCount,
      mindmapNodeId,
      onCountChange,
    };
  },
);

export { MindmapNodeCommentsProvider, useMindmapNodeCommentsContext };
