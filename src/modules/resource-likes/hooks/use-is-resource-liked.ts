import { useShallow } from "zustand/shallow";
import { useResourcesLikeState } from "../store";
import { rawResourcesLikeSelector } from "../store/selectors";
import { Atoms, ResourceLikeDto } from "api-4markdown-contracts";

const useResourceLike = (resourceId: Atoms["ResourceId"]) => {
  const like = useResourcesLikeState(
    useShallow(
      (state) =>
        rawResourcesLikeSelector(state)[resourceId] as
          | ResourceLikeDto
          | undefined,
    ),
  );

  return like;
};

export { useResourceLike };
