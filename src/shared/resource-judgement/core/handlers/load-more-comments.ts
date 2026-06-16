import type {
  CommentsNextCursor,
  ResourceId,
  ResourceType,
} from "../../domain/models";
import {
  getDocumentComments,
  getMindmapNodeComments,
  getUserProfileComments,
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

export const loadMoreComments = (store: Store) => async () => {
  const { comments, resourceId, resouceType } = store.getState();

  if (!comments.loaded || !comments.hasMore || comments.isLoadingMore) {
    return;
  }

  store.setState({ comments: { ...comments, isLoadingMore: true } });

  try {
    const result = await fetchComments(
      resourceId,
      resouceType,
      comments.nextCursor,
      10,
    );
    const current = store.getState().comments;

    store.setState({
      comments: {
        ...current,
        data: [...current.data, ...result.data],
        hasMore: result.hasMore,
        nextCursor: result.nextCursor,
        isLoadingMore: false,
      },
    });
  } catch {
    store.setState({
      comments: {
        ...store.getState().comments,
        isLoadingMore: false,
      },
    });
  }
};
