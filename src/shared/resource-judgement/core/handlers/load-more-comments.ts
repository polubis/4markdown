import { fetchCommentsByResource } from "../../integration/api";
import { type Store } from "../store";

export const loadMoreComments = (store: Store) => async () => {
  const { comments, resourceId, resourceType } = store.getState();

  if (!comments.loaded || !comments.hasMore || comments.isLoadingMore) {
    return;
  }

  store.setState({ comments: { ...comments, isLoadingMore: true } });

  try {
    const result = await fetchCommentsByResource(
      resourceId,
      resourceType,
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
