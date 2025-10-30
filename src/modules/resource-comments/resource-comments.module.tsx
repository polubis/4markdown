import { c } from "design-system/c";
import React from "react";
import { AddCommentTriggerContainer } from "./containers/add-comment-trigger.container";
import { ResourceCommentsContainer } from "./containers/resource-comments.container";
import {
  ResourceCommentsProvider,
  useResourceCommentsContext,
} from "./providers/resource-comments.provider";
import { ResourceCommentsProviderProps } from "./models";

type ResourceCommentsModuleProps = {
  className?: string;
} & ResourceCommentsProviderProps;

const ResourceCommentsModule = ({
  className,
}: Pick<ResourceCommentsModuleProps, "className">) => {
  const { commentsQuery } = useResourceCommentsContext();

  return (
    <div className={c("flex flex-col", className)}>
      <h2 className="mb-4 flex items-center gap-2 justify-between">
        <span className="text-lg">
          Comments{" "}
          {commentsQuery.is === "ok" ? `(${commentsQuery.data.length})` : ""}
        </span>
        <AddCommentTriggerContainer />
      </h2>

      <ResourceCommentsContainer />
    </div>
  );
};

const ConnectedResourceCommentsModule = ({
  className,
  ...props
}: ResourceCommentsModuleProps) => {
  return (
    <ResourceCommentsProvider {...props}>
      <ResourceCommentsModule className={className} />
    </ResourceCommentsProvider>
  );
};

export type { ResourceCommentsModuleProps };
export { ConnectedResourceCommentsModule as ResourceCommentsModule };
