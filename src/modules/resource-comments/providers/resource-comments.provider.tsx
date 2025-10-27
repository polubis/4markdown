import { context, useSimpleFeature } from "@greenonsoftware/react-kit";
import { useQuery } from "core/use-query";
import { loadResourceCommentsAct } from "../acts/load-resource-comments.act";
import { ResourceCommentsModuleData } from "../models";

const [ResourceCommentsProvider, useResourceCommentsContext] = context(
  (props: ResourceCommentsModuleData) => {
    const addCommentWidget = useSimpleFeature();
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
      ...props,
    };
  },
);

export { ResourceCommentsProvider, useResourceCommentsContext };
