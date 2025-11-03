import { useShallow } from "zustand/react/shallow";
import { useResourcesCompletionState } from "../store";
import { rawResourcesCompletionSelector } from "../store/selectors";
import { Atoms, ResourceCompletionDto } from "api-4markdown-contracts";

const useResourceCompletion = (resourceId: Atoms["ResourceId"]) => {
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
