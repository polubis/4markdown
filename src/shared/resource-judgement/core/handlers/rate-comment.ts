import type {
  CommentId,
  RatingCategory,
  ResourceId,
  ResourceType,
} from "../../domain/models";
import {
  rateDocumentComment,
  rateMindmapNodeComment,
  rateUserProfileComment,
  toOperationError,
} from "../../integration/api";
import { type Bus } from "../bus";
import { type Store } from "../store";

const rate = async (
  resourceId: ResourceId,
  resourceType: ResourceType,
  commentId: CommentId,
  category: RatingCategory,
) => {
  switch (resourceType) {
    case "document":
      return rateDocumentComment(resourceId, commentId, category);
    case "mindmap-node":
      return rateMindmapNodeComment(resourceId, commentId, category);
    case "user-profile":
      return rateUserProfileComment(resourceId, commentId, category);
    case "mindmap":
      throw new Error(`Unsupported resource type: ${resourceType}`);
  }
};

export const rateComment =
  (store: Store, bus: Bus) =>
  async (commentId: CommentId, category: RatingCategory) => {
    const { comments, resourceId, resouceType } = store.getState();
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
      await rate(resourceId, resouceType, commentId, category);
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
