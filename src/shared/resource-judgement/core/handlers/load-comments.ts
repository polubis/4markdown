import {
  fetchCommentsByResource,
  toOperationError,
} from "../../integration/api";
import { type Store } from "../store";

export const loadComments = (store: Store) => async () => {
  const state = store.getState();

  store.setState({
    comments: { ...state.comments, isLoading: true, error: null },
  });

  try {
    const result = await fetchCommentsByResource(
      state.resourceId,
      state.resourceType,
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
