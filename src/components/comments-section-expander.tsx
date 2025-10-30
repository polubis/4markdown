import { useSimpleFeature } from "@greenonsoftware/react-kit";
import { useAppEvent } from "core/app-events";
import { c } from "design-system/c";
import { Empty } from "design-system/empty";
import { type ResourceCommentsModuleProps } from "modules/resource-comments";
import React from "react";
import { BiComment, BiPlus } from "react-icons/bi";

const ResourceCommentsModule = React.lazy(() =>
  import("modules/resource-comments").then(({ ResourceCommentsModule }) => ({
    default: ResourceCommentsModule,
  })),
);

const EmptyTemplate = ({
  className,
  loading,
  commentsCount,
  onClick,
}: {
  className?: string;
  loading?: boolean;
  commentsCount: number;
  onClick?: () => void;
}) => {
  return (
    <Empty
      className={c(
        "mt-10 border border-zinc-300 dark:border-zinc-800 rounded-lg p-6",
        className,
      )}
    >
      <Empty.Icon>
        <BiComment size={80} />
      </Empty.Icon>
      <Empty.Title>
        {commentsCount > 0 ? `Click To Show Comments` : `Click To Add Comment`}
      </Empty.Title>
      <Empty.Description>
        {commentsCount > 0
          ? `To save some server bandwidth, comments are hidden by default. Click to show them.`
          : `Be the first to comment on this resource and share your thoughts and ideas`}
      </Empty.Description>
      <Empty.Action
        title="Show comments"
        auto
        s={2}
        i={2}
        disabled={loading}
        onClick={onClick}
      >
        {commentsCount > 0 ? (
          `Show Comments (${commentsCount})`
        ) : (
          <>
            <BiPlus /> Add Comment
          </>
        )}
      </Empty.Action>
    </Empty>
  );
};

type CommentsSectionExpanderProps = {
  className?: string;
  commentsCount: number;
} & ResourceCommentsModuleProps;

const CommentsSectionExpander = ({
  className,
  commentsCount,
  ...props
}: CommentsSectionExpanderProps) => {
  const comments = useSimpleFeature();

  useAppEvent((event) => {
    if (
      event.type === "SHOW_DOCUMENT_COMMENTS_PANEL" ||
      event.type === "SHOW_MINDMAP_NODE_COMMENTS_PANEL"
    ) {
      comments.on();
    }
  });

  if (comments.isOn) {
    return (
      <React.Suspense
        fallback={
          <EmptyTemplate
            className={className}
            loading
            commentsCount={commentsCount}
          />
        }
      >
        <ResourceCommentsModule className={c("mt-10", className)} {...props} />
      </React.Suspense>
    );
  }

  return (
    <EmptyTemplate
      className={className}
      commentsCount={commentsCount}
      onClick={comments.on}
    />
  );
};

export { CommentsSectionExpander };
