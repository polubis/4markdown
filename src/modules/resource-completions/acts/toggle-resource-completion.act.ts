import type {
  SetUserResourceCompletionItem,
  SetUserResourceCompletionPayload,
  SetUserResourceCompletionPayloadItem,
} from "api-4markdown-contracts";
import { getAPI, parseError, setCache } from "api-4markdown";
import { AsyncResult } from "development-kit/utility-types";
import { useResourcesCompletionState } from "../store";
import { okResourcesCompletionSelector } from "../store/selectors";

/** Request body item for backend: only defined fields (backend schema matches). */
function toRequestItem(
  item: SetUserResourceCompletionItem,
): SetUserResourceCompletionPayloadItem {
  const opt = {
    ...(item.title !== undefined && { title: item.title }),
    ...(item.description !== undefined && { description: item.description }),
  };
  switch (item.type) {
    case "document":
      return {
        type: "document",
        resourceId: item.resourceId,
        completed: item.completed,
        ...opt,
      };
    case "mindmap":
      return {
        type: "mindmap",
        resourceId: item.resourceId,
        completed: item.completed,
        ...opt,
      };
    case "mindmap-node":
      return {
        type: "mindmap-node",
        resourceId: item.resourceId,
        parentId: item.parentId,
        completed: item.completed,
        ...opt,
      };
  }
}

const toggleResourceCompletionAct = async (
  payload: SetUserResourceCompletionItem,
): AsyncResult => {
  try {
    const requestPayload: SetUserResourceCompletionPayload = [
      toRequestItem(payload),
    ];
    const results = await getAPI().call("setUserResourceCompletion")(
      requestPayload,
    );
    const result = results[0];
    if (!result) return { is: `ok` };

    const currentCompletions = {
      ...okResourcesCompletionSelector(useResourcesCompletionState.get()).data,
    };

    if (result.removed) {
      const { [payload.resourceId]: _, ...newCompletions } = currentCompletions;
      useResourcesCompletionState.swap({ is: `ok`, data: newCompletions });
      setCache("getUserResourceCompletions", newCompletions);
    } else {
      const { removed: _, ...dto } = result;
      const newCompletions = {
        ...currentCompletions,
        [payload.resourceId]: dto,
      };
      useResourcesCompletionState.swap({ is: `ok`, data: newCompletions });
      setCache("getUserResourceCompletions", newCompletions);
    }

    return { is: `ok` };
  } catch (error) {
    return {
      is: `fail`,
      error: parseError(error),
    };
  }
};

export { toggleResourceCompletionAct };
