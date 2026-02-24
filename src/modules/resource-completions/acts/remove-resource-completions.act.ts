import { getAPI, setCache } from "api-4markdown";
import {
  type Atoms,
  ResourceCompletionDto,
  SetUserResourceCompletionPayload,
} from "api-4markdown-contracts";
import { useResourcesCompletionState } from "../store";
import { okResourcesCompletionSelector } from "../store/selectors";

function toSetUserResourceCompletionPayload(
  entry: ResourceCompletionDto,
): SetUserResourceCompletionPayload {
  const base = {
    title: entry.title,
    description: entry.description ?? "",
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

const removeResourceCompletionsAct = async (
  entries: ResourceCompletionDto[],
): Promise<void> => {
  const current = useResourcesCompletionState.get();
  if (current.is !== "ok") return;
  if (entries.length === 0) return;

  for (const entry of entries) {
    const payload = toSetUserResourceCompletionPayload(entry);
    await getAPI().call("setUserResourceCompletion")(payload);
  }

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
