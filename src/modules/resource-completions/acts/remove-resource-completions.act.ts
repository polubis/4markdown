import { getAPI, setCache } from "api-4markdown";
import {
  type Atoms,
  type ResourceCompletionDto,
  type SetUserResourceCompletionPayload,
  type SetUserResourceCompletionPayloadItem,
} from "api-4markdown-contracts";
import { useResourcesCompletionState } from "../store";
import { okResourcesCompletionSelector } from "../store/selectors";

/** Request body item for backend: only defined fields (backend schema matches). */
function toPayloadItem(
  entry: ResourceCompletionDto,
): SetUserResourceCompletionPayloadItem {
  const opt = {
    ...(entry.title !== undefined && { title: entry.title }),
    ...(entry.description !== undefined && { description: entry.description }),
  };
  switch (entry.type) {
    case "mindmap-node":
      return {
        type: "mindmap-node",
        resourceId: entry.resourceId as Atoms["MindmapNodeId"],
        parentId: entry.parentId!,
        completed: false,
        ...opt,
      };
    case "mindmap":
      return {
        type: "mindmap",
        resourceId: entry.resourceId as Atoms["MindmapId"],
        completed: false,
        ...opt,
      };
    case "document":
      return {
        type: "document",
        resourceId: entry.resourceId as Atoms["DocumentId"],
        completed: false,
        ...opt,
      };
  }
}

const removeResourceCompletionsAct = async (
  entries: ResourceCompletionDto[],
): Promise<void> => {
  const current = useResourcesCompletionState.get();
  if (current.is !== "ok") return;
  if (entries.length === 0) return;

  const payload: SetUserResourceCompletionPayload = entries.map((e) =>
    toPayloadItem(e),
  ) as SetUserResourceCompletionPayload;
  await getAPI().call("setUserResourceCompletion")(payload);

  const currentData = okResourcesCompletionSelector(current).data;
  const toRemoveIds = new Set(entries.map((e) => e.resourceId));
  const newData = { ...currentData };
  for (const id of toRemoveIds) {
    delete newData[id as keyof typeof newData];
  }

  useResourcesCompletionState.swap({
    is: "ok",
    data: newData,
  });
  setCache("getUserResourceCompletions", newData);
};

export { removeResourceCompletionsAct };
