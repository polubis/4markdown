import { useSimpleFeature } from "@greenonsoftware/react-kit";
import { useAppEvent } from "core/app-events";
import { c } from "design-system/c";
import { Empty } from "design-system/empty";
import { type ResourceCommentsModuleProps } from "modules/resource-comments";
import React from "react";
import { BiComment } from "react-icons/bi";

const ResourceCommentsModule = React.lazy(() =>
  import("modules/resource-comments").then(({ ResourceCommentsModule }) => ({
    default: ResourceCommentsModule,
  })),
);

const EmptyTemplate = ({
  className,
  loading,
  onClick,
}: {
  className?: string;
  loading?: boolean;
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
      <Empty.Title>Click To Show Comments</Empty.Title>
      <Empty.Description>
        To save some server bandwidth, comments are hidden by default. Click to
        show them or to add a new comment.
      </Empty.Description>
      <Empty.Action
        title="Show comments"
        auto
        s={2}
        i={2}
        disabled={loading}
        onClick={onClick}
      >
        Show Comments
      </Empty.Action>
    </Empty>
  );
};

type CommentsSectionExpanderProps = {
  className?: string;
} & ResourceCommentsModuleProps;

const CommentsSectionExpander = ({
  className,
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
        fallback={<EmptyTemplate className={className} loading />}
      >
        <ResourceCommentsModule className={c("mt-10", className)} {...props} />
      </React.Suspense>
    );
  }

  return <EmptyTemplate className={className} onClick={comments.on} />;
};

export { CommentsSectionExpander };
