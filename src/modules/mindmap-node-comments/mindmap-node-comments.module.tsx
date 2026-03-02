import React from "react";
import { MindmapNodeCommentsContainer } from "./containers/mindmap-node-comments.container";
import { MindmapNodeCommentsProvider } from "./providers/mindmap-node-comments.provider";
import { MindmapNodeCommentsModuleProps } from "./models";

const MindmapNodeCommentsModule = ({
  className,
  commentsCount,
  mindmapId,
  mindmapNodeId,
}: MindmapNodeCommentsModuleProps) => {
  return (
    <MindmapNodeCommentsProvider
      mindmapId={mindmapId}
      mindmapNodeId={mindmapNodeId}
      commentsCount={commentsCount}
    >
      <MindmapNodeCommentsContainer className={className} />
    </MindmapNodeCommentsProvider>
  );
};

export { MindmapNodeCommentsModule };
