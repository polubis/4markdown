import { getAPI, setCache } from "api-4markdown";
import {
  type Atoms,
  ResourceLikeDto,
  SetUserResourceLikeItem,
} from "api-4markdown-contracts";
import { useResourcesLikeState } from "../store";
import { okResourcesLikeSelector } from "../store/selectors";

function toSetUserResourceLikeItem(
  entry: ResourceLikeDto,
): SetUserResourceLikeItem {
  const base = {
    title: entry.title,
    description: entry.description,
    liked: false as const,
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

  const payload: SetUserResourceLikeItem[] = entries.map(
    toSetUserResourceLikeItem,
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
