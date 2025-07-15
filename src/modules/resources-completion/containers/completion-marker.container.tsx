import React from "react";
import { BiInfoCircle } from "react-icons/bi";
import { useResourcesCompletionState } from "../store";
import { ResourceId } from "api-4markdown-contracts";
import { c } from "design-system/c";
import { OkResourcesCompletionState } from "../store/models";
import { Loader } from "design-system/loader";

type CompletionMarkerContainerProps = {
  className?: string;
  resourceId: ResourceId;
};

const CompletionMarker = ({
  resourceId,
  className,
  completion,
}: CompletionMarkerContainerProps & {
  completion: OkResourcesCompletionState["completion"];
}) => {
  const isCompleted = React.useMemo(
    () => Boolean(completion[resourceId]),
    [completion, resourceId],
  );

  if (!isCompleted) {
    return null;
  }

  return (
    <p
      className={c(
        "flex gap-2 text-sm justify-center items-center border bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 p-2 rounded-md",
        className,
      )}
    >
      <BiInfoCircle className="shrink-0" size={20} />
      <span>
        You're browsing already <strong>completed resource</strong>.
      </span>
    </p>
  );
};

const CompletionMarkerContainer = (props: CompletionMarkerContainerProps) => {
  const state = useResourcesCompletionState();

  if (state.is === "idle" || state.is === "busy") {
    return <Loader />;
  }

  if (state.is !== `ok`) {
    return null;
  }

  return <CompletionMarker {...props} completion={state.completion} />;
};

export { CompletionMarkerContainer };
