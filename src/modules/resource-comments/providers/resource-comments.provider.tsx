import {
  context,
  useFeature,
  useSimpleFeature,
} from "@greenonsoftware/react-kit";
import { useQuery } from "core/use-query";
import { loadResourceCommentsAct } from "../acts/load-resource-comments.act";
import { ResourceCommentsModuleData } from "../models";
import { CommentId, Etag } from "api-4markdown-contracts";

const [ResourceCommentsProvider, useResourceCommentsContext] = context(
  (props: ResourceCommentsModuleData) => {
    const addCommentWidget = useSimpleFeature();
    const editCommentWidget = useFeature<{
      id: CommentId;
      etag: Etag;
      content: string;
    }>();
    const commentsQuery = useQuery({
      handler: () =>
        loadResourceCommentsAct({
          ...props,
          cursor: null,
          limit: null,
        }).then((data) => data.comments),
    });

    return {
      commentsQuery,
      addCommentWidget,
      editCommentWidget,
      ...props,
    };
  },
);

export { ResourceCommentsProvider, useResourceCommentsContext };
