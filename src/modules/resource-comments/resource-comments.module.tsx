import { ResourceId, ResourceType } from "api-4markdown-contracts";
import { c } from "design-system/c";
import React from "react";
import { AddCommentTriggerContainer } from "./containers/add-comment-trigger.container";
import { ResourceCommentsContainer } from "./containers/resource-comments.container";
import {
  ResourceCommentsProvider,
  useResourceCommentsContext,
} from "./providers/resource-comments.provider";

type ResourceCommentsModuleProps = {
  className?: string;
  resourceId: ResourceId;
  resourceType: ResourceType;
};

const ResourceCommentsModule = ({
  className,
}: Pick<ResourceCommentsModuleProps, "className">) => {
  const { resourceId, resourceType, commentsQuery } =
    useResourceCommentsContext();

  return (
    <div className={c("flex flex-col", className)}>
      <h2 className="mb-4 flex items-center gap-2 justify-between">
        <span className="text-lg">
          Comments{" "}
          {commentsQuery.is === "ok" ? `(${commentsQuery.data.length})` : ""}
        </span>
        <AddCommentTriggerContainer
          resourceId={resourceId}
          resourceType={resourceType}
        />
      </h2>

      <ResourceCommentsProvider
        resourceId={resourceId}
        resourceType={resourceType}
      >
        <ResourceCommentsContainer />
      </ResourceCommentsProvider>
    </div>
  );
};

const ConnectedResourceCommentsModule = ({
  className,
  resourceId,
  resourceType,
}: ResourceCommentsModuleProps) => {
  return (
    <ResourceCommentsProvider
      resourceId={resourceId}
      resourceType={resourceType}
    >
      <ResourceCommentsModule className={className} />
    </ResourceCommentsProvider>
  );
};

export { ConnectedResourceCommentsModule as ResourceCommentsModule };
