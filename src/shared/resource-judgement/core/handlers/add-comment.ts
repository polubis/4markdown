import type {
  Comment,
  CommentAuthor,
  CommentId,
  ResourceId,
  ResourceType,
} from "../../domain/models";
import {
  addDocumentComment,
  addMindmapNodeComment,
  addUserProfileComment,
  formatCommentUpdatedAt,
  toOperationError,
} from "../../integration/api";
import { createOptimisticCommentId } from "../../domain/value-objects";
import { type Bus } from "../bus";
import { type Store } from "../store";

const createOptimisticComment = (
  tempId: CommentId,
  content: string,
  author: CommentAuthor,
): Comment => ({
  id: tempId,
  content,
  createdAt: new Date().toISOString(),
  updatedAt: formatCommentUpdatedAt(new Date().toISOString()),
  authorProfileId: author.authorProfileId,
  authorDisplayName: author.authorDisplayName,
  authorAvatarUrl: author.authorAvatarUrl ?? null,
  repliesCount: 0,
  rating: { ugly: 0, bad: 0, decent: 0, good: 0, perfect: 0 },
  myCategory: null,
});

const saveComment = async (
  resourceId: ResourceId,
  resourceType: ResourceType,
  content: string,
) => {
  switch (resourceType) {
    case "document":
      return addDocumentComment(resourceId, content);
    case "mindmap-node":
      return addMindmapNodeComment(resourceId, content);
    case "user-profile":
      return addUserProfileComment(resourceId, content);
    case "mindmap":
      throw new Error(`Unsupported resource type: ${resourceType}`);
  }
};

export const addComment =
  (store: Store, bus: Bus) =>
  async (content: string, author: CommentAuthor) => {
    const { comments, resourceId, resourceType } = store.getState();
    const tempId = createOptimisticCommentId();
    const trimmedContent = content.trim();
    const optimisticComment = createOptimisticComment(
      tempId,
      trimmedContent,
      author,
    );
    const prevData = comments.data;
    const prevTotalCount = comments.totalCount;

    store.setState({
      comments: {
        ...comments,
        data: [optimisticComment, ...comments.data],
        totalCount: comments.totalCount + 1,
      },
    });

    try {
      const created = await saveComment(
        resourceId,
        resourceType,
        trimmedContent,
      );
      const current = store.getState().comments;

      if (!current.data.some((item) => item.id === tempId)) {
        return;
      }

      store.setState({
        comments: {
          ...current,
          data: current.data.map((item) =>
            item.id === tempId ? created : item,
          ),
        },
      });
    } catch (error) {
      store.setState({
        comments: {
          ...store.getState().comments,
          data: prevData,
          totalCount: prevTotalCount,
        },
      });
      bus.next({ type: "fail", message: toOperationError(error) });
    }
  };
