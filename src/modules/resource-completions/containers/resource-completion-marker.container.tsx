import React from "react";
import { useResourcesCompletionState } from "../store";
import { ResourceId } from "api-4markdown-contracts";
import { BiCheckboxChecked } from "react-icons/bi";
import { rawResourcesCompletionSelector } from "../store/selectors";
import { useShallow } from "zustand/react/shallow";
import c from "classnames";

type ResourceCompletionMarkerContainerProps = {
  resourceId: ResourceId;
  variant: "badge" | "info" | "icon";
  className?: string;
};

const ResourceCompletionMarkerContainer = ({
  resourceId,
  variant,
  className,
}: ResourceCompletionMarkerContainerProps) => {
  const completion = useResourcesCompletionState(
    useShallow((state) => rawResourcesCompletionSelector(state)[resourceId]),
  );

  if (!completion) {
    return null;
  }

  if (variant === "icon") {
    return (
      <span
        title="This resource is completed"
        className={c(
          "shrink-0 rounded-md bg-green-700 text-white p-0.5",
          className,
        )}
      >
        <BiCheckboxChecked aria-hidden="true" size={20} />
      </span>
    );
  }

  if (variant === "badge") {
    return (
      <span
        className={c(
          "flex items-center gap-0.5 text-sm font-medium uppercase w-fit rounded-md bg-green-700 text-white py-1 px-2 line-clamp-1",
          className,
        )}
      >
        <BiCheckboxChecked aria-hidden="true" className="shrink-0" size={20} />
        <span>Completed</span>
      </span>
    );
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
