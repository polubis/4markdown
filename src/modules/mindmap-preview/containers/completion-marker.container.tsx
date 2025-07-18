import { ResourceId } from "api-4markdown-contracts";
import { SUID } from "development-kit/suid";
import {
  rawResourcesCompletionSelector,
  useResourcesCompletionState,
} from "modules/resources-completion";
import React from "react";
import { BiCheckboxChecked } from "react-icons/bi";

const CompletionMarkerContainer = ({
  mindmapNodeId,
}: {
  mindmapNodeId: SUID;
}) => {
  const completion = useResourcesCompletionState(
    rawResourcesCompletionSelector,
  );

  const isCompleted = completion[mindmapNodeId as ResourceId];

  if (!isCompleted) return null;

  return (
    <div
      title="This resource is completed"
      className="shrink-0 rounded-md bg-green-700 text-white p-0.5 w-fit"
    >
      <BiCheckboxChecked aria-hidden="true" size={24} />
    </div>
  );
};

export { CompletionMarkerContainer };
