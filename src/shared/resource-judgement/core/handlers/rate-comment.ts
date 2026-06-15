import type { CommentId, RatingCategory } from "../../domain/models";
import {
  rateComment as rateCommentApi,
  toOperationError,
} from "../../integration/api";
import { type Bus } from "../bus";
import { type Store } from "../store";

export const rateComment =
  (store: Store, bus: Bus) =>
  async (commentId: CommentId, category: RatingCategory) => {
    const { comments, resourceId } = store.getState();
    const comment = comments.data.find((item) => item.id === commentId);

    if (!comment) {
      return;
    }

    const prevRating = comment.rating;
    const prevMyCategory = comment.myCategory ?? null;

    store.setState({
      comments: {
        ...comments,
        data: comments.data.map((item) =>
          item.id === commentId
            ? {
                ...item,
                rating: {
                  ...prevRating,
                  [category]: prevRating[category] + 1,
                },
                myCategory: category,
              }
            : item,
        ),
      },
    });

    try {
      await rateCommentApi(resourceId, commentId, category);
    } catch (error) {
      store.setState({
        comments: {
          ...store.getState().comments,
          data: store.getState().comments.data.map((item) =>
            item.id === commentId
              ? { ...item, rating: prevRating, myCategory: prevMyCategory }
              : item,
          ),
        },
      });
      bus.next({ type: "fail", message: toOperationError(error) });
    }
  };
