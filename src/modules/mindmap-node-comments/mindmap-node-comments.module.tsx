import React from "react";
import { MindmapNodeCommentsContainer } from "./containers/mindmap-node-comments.container";
import { MindmapNodeCommentsProvider } from "./providers/mindmap-node-comments.provider";
import { MindmapNodeCommentsModuleProps } from "./models";

const MindmapNodeCommentsModule = ({
  className,
  commentsCount,
  mindmapNodeId,
  onCountChange,
}: MindmapNodeCommentsModuleProps) => {
  return (
    <MindmapNodeCommentsProvider
      mindmapNodeId={mindmapNodeId}
      commentsCount={commentsCount}
      onCountChange={onCountChange}
    >
      <MindmapNodeCommentsContainer className={className} />
    </MindmapNodeCommentsProvider>
  );
};

export { MindmapNodeCommentsModule };
