import React from "react";
import { ResourceId } from "api-4markdown-contracts";
import { Button } from "design-system/button";
import { Status } from "design-system/status";
import {
  useResourcesCompletion,
  useResourcesCompletionState,
} from "modules/resources-completion";
import { BiCheckboxChecked, BiCheckboxMinus } from "react-icons/bi";
import { useMindmapPreviewState } from "store/mindmap-preview";
import { onMindmapPreviewNodeSelector } from "store/mindmap-preview/selectors";

const CompletionTriggerContainer = () => {
  const nodePreview = useMindmapPreviewState(onMindmapPreviewNodeSelector);
  const state = useResourcesCompletionState();
  const { toggle, isCompleted, message } = useResourcesCompletion(
    nodePreview.id as ResourceId,
    "document",
  );

  if (state.is !== "ok") {
    return null;
  }

  return (
    <>
      {message.is === "copied" && <Status>{message.value}</Status>}
      <Button
        className="mx-auto"
        s={1}
        i={2}
        onClick={toggle}
        title={isCompleted ? "Mark as uncompleted" : "Mark as completed"}
      >
        {isCompleted ? <BiCheckboxMinus /> : <BiCheckboxChecked />}
      </Button>
    </>
  );
};

export { CompletionTriggerContainer };
