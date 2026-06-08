import { getAPI, parseError } from "api-4markdown";
import { Atoms, type DocumentCommentDto } from "api-4markdown-contracts";
import {
  type Comment,
  type CommentId,
  RatingCategory,
  ResourceId,
  ResourceType,
  type Score,
  type ScoreValue,
  type OperationError,
} from "../domain/models";

const toComment = (dto: DocumentCommentDto): Comment => ({
  id: dto.id,
  content: dto.content,
  createdAt: dto.cdate,
  updatedAt: dto.mdate,
  authorDisplayName: dto.ownerProfile.displayName ?? "Anonymous",
  authorAvatarUrl: dto.ownerProfile.avatar?.sm?.src ?? null,
  repliesCount: 0,
  rating: {
    ugly: dto.ugly,
    bad: dto.bad,
    decent: dto.decent,
    good: dto.good,
    perfect: dto.perfect,
  },
});

export const toOperationError = (error: unknown): OperationError => {
  return parseError(error).message;
};

export const rateDocument = async (
  resourceId: ResourceId,
  category: RatingCategory,
): Promise<null> =>
  getAPI()
    .call("rateDocument")({
      documentId: resourceId as unknown as Atoms["DocumentId"],
      category,
    })
    .then(() => null);

export const addDocumentScore = async (
  resourceId: ResourceId,
  score: ScoreValue,
): Promise<Score> =>
  getAPI().call("addDocumentScore")({
    documentId: resourceId as unknown as Atoms["DocumentId"],
    score: score as Atoms["ScoreValue"],
  });

export const getComments = async (
  resourceId: ResourceId,
  resourceType: ResourceType,
  nextCursor: { createdAt: string; id: CommentId } | null = null,
  limit: number | null = null,
): Promise<Comment[]> => {
  if (resourceType !== "document") {
    throw new Error(`Unsupported resource type: ${resourceType}`);
  }

  const data = await getAPI().call("getDocumentComments")({
    resourceId: resourceId as Atoms["DocumentId"],
    nextCursor: nextCursor
      ? {
          cdate: nextCursor.createdAt as Atoms["UTCDate"],
          id: nextCursor.id as Atoms["DocumentCommentId"],
        }
      : null,
    limit,
  });

  return data.comments.map(toComment);
};
