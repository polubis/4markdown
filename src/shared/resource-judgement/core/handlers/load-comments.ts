import type {
  CommentsNextCursor,
  ResourceId,
  ResourceType,
} from "../../domain/models";
import {
  getDocumentComments,
  getMindmapNodeComments,
  getUserProfileComments,
  toOperationError,
} from "../../integration/api";
import { type Store } from "../store";

const fetchComments = async (
  resourceId: ResourceId,
  resourceType: ResourceType,
  nextCursor: CommentsNextCursor | null,
  limit: number | null,
) => {
  switch (resourceType) {
    case "document":
      return getDocumentComments(resourceId, nextCursor, limit);
    case "mindmap-node":
      return getMindmapNodeComments(resourceId, nextCursor, limit);
    case "user-profile":
      return getUserProfileComments(resourceId, nextCursor, limit);
    case "mindmap":
      throw new Error(`Unsupported resource type: ${resourceType}`);
  }
};

export const loadComments = (store: Store) => async () => {
  const state = store.getState();

  store.setState({
    comments: { ...state.comments, isLoading: true, error: null },
  });

  try {
    const result = await fetchComments(
      state.resourceId,
      state.resouceType,
      null,
      10,
    );
    const { comments } = store.getState();

    store.setState({
      comments: {
        ...comments,
        ...result,
        isLoading: false,
        isLoadingMore: false,
        error: null,
        loaded: true,
        totalCount: Math.max(comments.totalCount, result.data.length),
      },
    });
  } catch (error) {
    store.setState({
      comments: {
        ...store.getState().comments,
        isLoading: false,
        error: toOperationError(error),
      },
    });
  }
};
