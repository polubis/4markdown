import { getAPI, setCache } from "api-4markdown";
import {
  type Atoms,
  ResourceLikeDto,
  SetUserResourceLikeRequestItem,
} from "api-4markdown-contracts";
import { useResourcesLikeState } from "../store";
import { okResourcesLikeSelector } from "../store/selectors";

function toSetUserResourceLikeRequestItem(
  entry: ResourceLikeDto,
): SetUserResourceLikeRequestItem {
  const description =
    entry.description != null && entry.description !== ""
      ? entry.description
      : undefined;
  const base = {
    title: entry.title,
    liked: false as const,
    ...(description !== undefined && { description }),
  };
  switch (entry.type) {
    case "mindmap-node":
      return {
        type: "mindmap-node",
        resourceId: entry.resourceId as Atoms["MindmapNodeId"],
        parentId: entry.parentId!,
        ...base,
      };
    case "mindmap":
      return {
        type: "mindmap",
        resourceId: entry.resourceId as Atoms["MindmapId"],
        ...base,
      };
    case "document":
      return {
        type: "document",
        resourceId: entry.resourceId as Atoms["DocumentId"],
        ...base,
      };
  }
}

const removeResourceLikesAct = async (
  entries: ResourceLikeDto[],
): Promise<void> => {
  const current = useResourcesLikeState.get();
  if (current.is !== "ok") return;
  if (entries.length === 0) return;

  const payload: SetUserResourceLikeRequestItem[] = entries.map(
    toSetUserResourceLikeRequestItem,
  );
  await getAPI().call("setUserResourceLike")(payload);

  const currentData = okResourcesLikeSelector(current).data;
  const toRemoveIds = new Set(entries.map((e) => e.resourceId));
  const newData = { ...currentData };
  for (const id of toRemoveIds) {
    delete newData[id as keyof typeof newData];
  }

  useResourcesLikeState.swap({
    is: "ok",
    data: newData,
  });
  setCache("getUserResourceLikes", newData);
};

export { removeResourceLikesAct };
