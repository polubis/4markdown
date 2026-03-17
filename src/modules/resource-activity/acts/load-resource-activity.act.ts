import { getAPI, parseError } from "api-4markdown";
import { useResourceActivityState } from "../store";
import { API4MarkdownDto, Atoms } from "api-4markdown-contracts";
import { ResourceActivityModel } from "../store/models";

const DEFAULT_ACTIVITY_LIMIT = 10;

type LoadResourceActivityActMode = "replace" | "append";

const normalizeDocumentActivity = (
  documentActivity:
    | API4MarkdownDto<"getDocumentActivity">
    | API4MarkdownDto<"getMindmapNodeActivity">,
): ResourceActivityModel[] => {
  return documentActivity.activities.map(
    (item): ResourceActivityModel => ({
      id: item.id,
      type: item.type,
      cdate: item.cdate,
      authorProfile: item.appliedByProfile,
      previousContent: item.previousContent,
      newContent: item.newContent,
    }),
  );
};

const loadResourceActivityAct = async (
  resourceId: Atoms["ResourceId"],
  resourceType: Atoms["ResourceType"],
  mode: LoadResourceActivityActMode = "replace",
  resourceCdate?: Atoms["UTCDate"],
  resourceParentId?: Atoms["MindmapId"],
): Promise<void> => {
  try {
    if (resourceType !== "document" && resourceType !== "mindmap-node") {
      useResourceActivityState.swap({
        is: `ok`,
        data: [],
        hasMore: false,
        nextCursor: null,
        isLoadingMore: false,
      });
      return;
    }

    const currentState = useResourceActivityState.get();
    const isAppend = mode === "append" && currentState.is === "ok";
    const nextCursor = isAppend ? currentState.nextCursor : null;

    if (
      mode === "append" &&
      currentState.is === "ok" &&
      !currentState.hasMore
    ) {
      return;
    }

    if (isAppend) {
      useResourceActivityState.swap({
        ...currentState,
        isLoadingMore: true,
      });
    } else {
      useResourceActivityState.swap({ is: `busy` });
    }

    const response =
      resourceType === "document"
        ? await getAPI().call("getDocumentActivity")({
            documentId: resourceId as Atoms["DocumentId"],
            nextCursor:
              nextCursor as API4MarkdownDto<"getDocumentActivity">["nextCursor"],
            limit: DEFAULT_ACTIVITY_LIMIT,
          })
        : resourceParentId
          ? await getAPI().call("getMindmapNodeActivity")({
              mindmapId: resourceParentId,
              nodeId: resourceId as Atoms["MindmapNodeId"],
              nextCursor:
                nextCursor as API4MarkdownDto<"getMindmapNodeActivity">["nextCursor"],
              limit: DEFAULT_ACTIVITY_LIMIT,
            })
          : null;

    if (response == null) {
      useResourceActivityState.swap({
        is: `ok`,
        data: [],
        hasMore: false,
        nextCursor: null,
        isLoadingMore: false,
      });
      return;
    }

    const activity = normalizeDocumentActivity(response);
    const previousData = isAppend ? currentState.data : [];
    const mergedData = [...previousData, ...activity];
    const hasCreated = mergedData.some((item) => item.type === "created");
    const shouldAppendCreated =
      Boolean(resourceCdate) && !response.hasMore && !hasCreated;
    const data = shouldAppendCreated
      ? [
          ...mergedData,
          {
            id: `created-${resourceId}`,
            type: "created",
            cdate: resourceCdate as Atoms["UTCDate"],
            authorProfile: null,
          } satisfies ResourceActivityModel,
        ]
      : mergedData;

    useResourceActivityState.swap({
      is: `ok`,
      data,
      hasMore: response.hasMore,
      nextCursor: response.nextCursor,
      isLoadingMore: false,
    });
  } catch (error) {
    const currentState = useResourceActivityState.get();

    if (mode === "append" && currentState.is === "ok") {
      useResourceActivityState.swap({
        ...currentState,
        isLoadingMore: false,
      });
      return;
    }

    useResourceActivityState.swap({
      is: `fail`,
      error: parseError(error),
    });
  }
};

export { loadResourceActivityAct };
