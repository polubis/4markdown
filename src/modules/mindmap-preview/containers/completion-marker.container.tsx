import React from "react";
import { ResourceId } from "api-4markdown-contracts";
import { useResourcesCompletion } from "modules/resources-completion";
import { BiCheck } from "react-icons/bi";
import { useMindmapPreviewState } from "store/mindmap-preview";
import { onMindmapPreviewNodeSelector } from "store/mindmap-preview/selectors";

const CompletionMarkerContainer = () => {
  const nodePreview = useMindmapPreviewState(onMindmapPreviewNodeSelector);
  const { isCompleted } = useResourcesCompletion(
    nodePreview.id as ResourceId,
    "mindmap-node",
  );

  if (!isCompleted) {
    return null;
  }

  return (
    <p className="flex mt-4 mx-4 gap-2 text-sm justify-center items-center border bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 p-2 rounded-md">
      <BiCheck className="shrink-0" size={20} />
      <span>
        You're browsing already <strong>completed resource</strong>.
      </span>
    </p>
  );
};

export { CompletionMarkerContainer };
