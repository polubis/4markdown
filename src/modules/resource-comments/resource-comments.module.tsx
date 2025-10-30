import { c } from "design-system/c";
import React, { useEffect } from "react";
import { AddCommentTriggerContainer } from "./containers/add-comment-trigger.container";
import { ResourceCommentsContainer } from "./containers/resource-comments.container";
import { loadResourceCommentsAct } from "./acts/load-resource-comments.act";
import { MindmapId, ResourceId, ResourceType } from "api-4markdown-contracts";
import {
  setResourceCommentsStoreMeta,
  useResourceCommentsStore,
} from "./store";
import { DeleteResourceCommentModalContainer } from "./containers/delete-resource-comment-modal.container";
import { ResourceCommentFormContainer } from "./containers/resource-comment-form.container";

type ResourceCommentsModuleProps = {
  className?: string;
  type: ResourceType;
  resourceId: ResourceId;
  parentId?: MindmapId;
};

const HeaderContainer = () => {
  const comments = useResourceCommentsStore.use.comments();

  return (
    <span className="text-lg">
      Comments {comments.length > 0 ? `(${comments.length})` : ""}
    </span>
  );
};

const ResourceCommentsModule = ({
  className,
  type,
  resourceId,
  parentId,
}: ResourceCommentsModuleProps) => {
  useEffect(() => {
    setResourceCommentsStoreMeta({
      type,
      resourceId,
      parentId,
    });

    loadResourceCommentsAct();
  }, [type, resourceId, parentId]);

  useEffect(() => {
    return () => {
      useResourceCommentsStore.reset();
    };
  }, []);

  return (
    <div className={c("flex flex-col", className)}>
      <h2 className="mb-4 flex items-center gap-2 justify-between">
        <HeaderContainer />
        <AddCommentTriggerContainer />
      </h2>

      <ResourceCommentsContainer />
      <ResourceCommentFormContainer />
      <DeleteResourceCommentModalContainer />
    </div>
  );
};

export { ResourceCommentsModule, type ResourceCommentsModuleProps };
