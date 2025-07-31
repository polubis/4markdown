import { useShallow } from "zustand/react/shallow";
import { useResourcesCompletionState } from "../store";
import { rawResourcesCompletionSelector } from "../store/selectors";
import { ResourceCompletionDto, ResourceId } from "api-4markdown-contracts";

const useResourceCompletion = (resourceId: ResourceId) => {
  const completion = useResourcesCompletionState(
    useShallow(
      (state) =>
        rawResourcesCompletionSelector(state)[resourceId] as
          | ResourceCompletionDto
          | undefined,
    ),
  );

  return completion;
};

export { useResourceCompletion };
