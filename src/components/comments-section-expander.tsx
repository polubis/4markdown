import { useSimpleFeature } from "@greenonsoftware/react-kit";
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

const CommentsSectionExpander = ({
  className,
  ...props
}: ResourceCommentsModuleProps) => {
  const comments = useSimpleFeature();

  if (comments.isOn) {
    return (
      <React.Suspense>
        <ResourceCommentsModule className={c("mt-10", className)} {...props} />
      </React.Suspense>
    );
  }

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
        show them.
      </Empty.Description>
      <Empty.Action
        title="Show comments"
        auto
        s={2}
        i={2}
        onClick={comments.on}
      >
        Show Comments
      </Empty.Action>
    </Empty>
  );
};

export { CommentsSectionExpander };
