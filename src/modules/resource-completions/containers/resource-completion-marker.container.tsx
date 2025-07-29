import React from "react";
import { useResourcesCompletionState } from "../store";
import { ResourceCompletionDto, ResourceId } from "api-4markdown-contracts";
import { BiCheckboxChecked } from "react-icons/bi";
import { c } from "design-system/c";

type ResourceCompletionMarkerContainerProps = {
  resourceId: ResourceId;
  className?: string;
};

const ResourceCompletionMarkerContainer = ({
  resourceId,
  className,
}: ResourceCompletionMarkerContainerProps) => {
  const completions = useResourcesCompletionState.use.completions();
  const completion = completions[resourceId] as
    | ResourceCompletionDto
    | undefined;

  if (!completion) {
    return null;
  }

  return (
    <p
      className={c(
        "flex gap-1 text-sm justify-center items-center border bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 p-2 rounded-md",
        className,
      )}
    >
      <BiCheckboxChecked className="shrink-0" size={24} />
      <span>
        You're browsing already <strong>completed resource</strong>.
      </span>
    </p>
  );
};

export { ResourceCompletionMarkerContainer };
