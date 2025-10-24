import { context, useSimpleFeature } from "@greenonsoftware/react-kit";
import { useQuery } from "core/use-query";
import { loadResourceCommentsAct } from "../acts/load-resource-comments.act";
import { ResourceId, ResourceType } from "api-4markdown-contracts";

const [ResourceCommentsProvider, useResourceCommentsContext] = context(
  ({
    resourceId,
    resourceType,
  }: {
    resourceId: ResourceId;
    resourceType: ResourceType;
  }) => {
    const addCommentWidget = useSimpleFeature();
    const commentsQuery = useQuery({
      handler: () =>
        loadResourceCommentsAct({
          resourceId,
          resourceType,
        }).then((data) => data.comments),
    });

    return {
      commentsQuery,
      addCommentWidget,
      resourceId,
      resourceType,
    };
  },
);

export { ResourceCommentsProvider, useResourceCommentsContext };
