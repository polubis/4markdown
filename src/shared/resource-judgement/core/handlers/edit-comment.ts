import type { CommentId, ResourceId, ResourceType } from "../../domain/models";
import {
  editDocumentComment,
  editMindmapNodeComment,
  toOperationError,
} from "../../integration/api";
import { type Bus } from "../bus";
import { type Store } from "../store";

const saveComment = async (
  resourceId: ResourceId,
  resourceType: ResourceType,
  commentId: CommentId,
  content: string,
) => {
  switch (resourceType) {
    case "document":
      return editDocumentComment(resourceId, commentId, content);
    case "mindmap-node":
      return editMindmapNodeComment(resourceId, commentId, content);
    case "user-profile":
      throw new Error(`Unsupported resource type: ${resourceType}`);
    case "mindmap":
      throw new Error(`Unsupported resource type: ${resourceType}`);
  }
};

export const editComment =
  (store: Store, bus: Bus) =>
  async (commentId: CommentId, content: string) => {
    const { comments, resourceId, resouceType } = store.getState();

    try {
      const updated = await saveComment(
        resourceId,
        resouceType,
        commentId,
        content,
      );

      store.setState({
        comments: {
          ...comments,
          data: comments.data.map((comment) =>
            comment.id === commentId ? updated : comment,
          ),
        },
      });
    } catch (error) {
      bus.next({ type: "fail", message: toOperationError(error) });
    }
  };
