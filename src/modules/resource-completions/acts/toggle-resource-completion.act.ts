import {
  SetUserResourceCompletionItem,
  SetUserResourceCompletionPayload,
} from "api-4markdown-contracts";
import { getAPI, parseError, setCache } from "api-4markdown";
import { AsyncResult } from "development-kit/utility-types";
import { useResourcesCompletionState } from "../store";
import { okResourcesCompletionSelector } from "../store/selectors";

function toApiPayload(
  item: SetUserResourceCompletionItem,
): SetUserResourceCompletionPayload {
  const base = {
    title: item.title,
    description: item.description ?? "",
  };
  switch (item.type) {
    case "document":
      return { type: "document", resourceId: item.resourceId, ...base };
    case "mindmap":
      return { type: "mindmap", resourceId: item.resourceId, ...base };
    case "mindmap-node":
      return {
        type: "mindmap-node",
        resourceId: item.resourceId,
        parentId: item.parentId,
        ...base,
      };
  }
}

const toggleResourceCompletionAct = async (
  payload: SetUserResourceCompletionItem,
): AsyncResult => {
  try {
    const apiPayload = toApiPayload(payload);
    const result = await getAPI().call("setUserResourceCompletion")(apiPayload);

    const currentCompletions = {
      ...okResourcesCompletionSelector(useResourcesCompletionState.get()).data,
    };

    if (result === null) {
      const { [payload.resourceId]: _, ...newCompletions } = currentCompletions;
      useResourcesCompletionState.swap({ is: `ok`, data: newCompletions });
      setCache("getUserResourceCompletions", newCompletions);
    } else {
      const newCompletions = {
        ...currentCompletions,
        [payload.resourceId]: result,
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
