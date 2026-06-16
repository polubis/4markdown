import { getAPI, parseError } from "api-4markdown";
import type {
  API4MarkdownPayload,
  Atoms,
  DocumentCommentDto,
  MindmapNodeCommentDto,
  UserProfileCommentDto,
  UserProfileDto,
} from "api-4markdown-contracts";
import {
  type Comment,
  type CommentId,
  type CommentsNextCursor,
  type Rating,
  RatingCategory,
  ResourceId,
  type Score,
  type ScoreValue,
  type OperationError,
} from "../domain/models";

const toScoreFromApi = (dto: Atoms["Score"]): Score => ({
  average: dto.scoreAverage,
  count: dto.scoreCount,
  values: dto.scoreValues,
});

const toCommentsNextCursor = (
  cursor: {
    cdate: Atoms["UTCDate"];
    id:
      | Atoms["DocumentCommentId"]
      | Atoms["MindmapNodeCommentId"]
      | Atoms["UserProfileCommentId"];
  } | null,
): CommentsNextCursor | null =>
  cursor
    ? {
        createdAt: cursor.cdate,
        id: cursor.id,
      }
    : null;

const toCommentFromDocument = (dto: DocumentCommentDto): Comment => ({
  id: dto.id,
  content: dto.content,
  createdAt: dto.cdate,
  updatedAt: dto.mdate,
  authorProfileId: dto.ownerProfile.id,
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

export const toCommentFromUserProfile = (dto: UserProfileCommentDto): Comment => ({
  id: dto.id,
  content: dto.content,
  createdAt: dto.cdate,
  updatedAt: dto.mdate,
  authorProfileId: dto.ownerProfile.id,
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

export const toRatingFromUserProfile = (profile: UserProfileDto): Rating => ({
  ugly: profile.ugly ?? 0,
  bad: profile.bad ?? 0,
  decent: profile.decent ?? 0,
  good: profile.good ?? 0,
  perfect: profile.perfect ?? 0,
});

export const toScoreFromUserProfile = (profile: UserProfileDto): Score => ({
  average: profile.scoreAverage ?? 0,
  count: profile.scoreCount ?? 0,
  values: profile.scoreValues ?? [],
});

const toCommentFromMindmapNode = (dto: MindmapNodeCommentDto): Comment => ({
  id: dto.id,
  content: dto.content,
  createdAt: dto.cdate,
  updatedAt: dto.mdate,
  authorProfileId: dto.ownerProfile.id,
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
      documentId: resourceId as Atoms["DocumentId"],
      category,
    })
    .then(() => null);

export const rateMindmapNode = async (
  resourceId: ResourceId,
  category: RatingCategory,
): Promise<null> =>
  getAPI()
    .call("rateMindmapNode")({
      nodeId: resourceId as Atoms["MindmapNodeId"],
      category,
    } as API4MarkdownPayload<"rateMindmapNode">)
    .then(() => null);

export const addDocumentScore = async (
  resourceId: ResourceId,
  score: ScoreValue,
): Promise<Score> =>
  getAPI().call("addDocumentScore")({
    documentId: resourceId as Atoms["DocumentId"],
    score: score as Atoms["ScoreValue"],
  });

export const addMindmapNodeScore = async (
  resourceId: ResourceId,
  score: ScoreValue,
): Promise<Score> =>
  getAPI().call("addMindmapNodeScore")({
    nodeId: resourceId as Atoms["MindmapNodeId"],
    score: score as Atoms["ScoreValue"],
  } as API4MarkdownPayload<"addMindmapNodeScore">);

export const getDocumentComments = async (
  resourceId: ResourceId,
  nextCursor: CommentsNextCursor | null,
  limit: number | null,
) => {
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

  return {
    data: data.comments.map(toCommentFromDocument),
    hasMore: data.hasMore,
    nextCursor: toCommentsNextCursor(data.nextCursor),
  };
};

export const getMindmapNodeComments = async (
  resourceId: ResourceId,
  nextCursor: CommentsNextCursor | null,
  limit: number | null,
) => {
  const data = await getAPI().call("getMindmapNodeComments")({
    nodeId: resourceId as Atoms["MindmapNodeId"],
    nextCursor: nextCursor
      ? {
          cdate: nextCursor.createdAt as Atoms["UTCDate"],
          id: nextCursor.id as Atoms["MindmapNodeCommentId"],
        }
      : null,
    limit,
  } as API4MarkdownPayload<"getMindmapNodeComments">);

  return {
    data: data.comments.map(toCommentFromMindmapNode),
    hasMore: data.hasMore,
    nextCursor: toCommentsNextCursor(data.nextCursor),
  };
};

export const rateDocumentComment = async (
  resourceId: ResourceId,
  commentId: CommentId,
  category: RatingCategory,
) =>
  getAPI().call("rateDocumentComment")({
    resourceId: resourceId as Atoms["DocumentId"],
    commentId: commentId as Atoms["DocumentCommentId"],
    category,
  });

export const rateMindmapNodeComment = async (
  resourceId: ResourceId,
  commentId: CommentId,
  category: RatingCategory,
) =>
  getAPI().call("rateMindmapNodeComment")({
    nodeId: resourceId as Atoms["MindmapNodeId"],
    commentId: commentId as Atoms["MindmapNodeCommentId"],
    category,
  } as API4MarkdownPayload<"rateMindmapNodeComment">);

export const addDocumentComment = async (
  resourceId: ResourceId,
  content: string,
): Promise<Comment> =>
  getAPI()
    .call("addDocumentComment")({
      resourceId: resourceId as Atoms["DocumentId"],
      comment: content,
    })
    .then(toCommentFromDocument);

export const addMindmapNodeComment = async (
  resourceId: ResourceId,
  content: string,
): Promise<Comment> =>
  getAPI()
    .call("addMindmapNodeComment")({
      nodeId: resourceId as Atoms["MindmapNodeId"],
      comment: content,
    } as API4MarkdownPayload<"addMindmapNodeComment">)
    .then(toCommentFromMindmapNode);

export const editDocumentComment = async (
  resourceId: ResourceId,
  commentId: CommentId,
  content: string,
): Promise<Comment> =>
  getAPI()
    .call("editDocumentComment")({
      resourceId: resourceId as Atoms["DocumentId"],
      commentId: commentId as Atoms["DocumentCommentId"],
      content,
    })
    .then(toCommentFromDocument);

export const editMindmapNodeComment = async (
  resourceId: ResourceId,
  commentId: CommentId,
  content: string,
): Promise<Comment> =>
  getAPI()
    .call("editMindmapNodeComment")({
      nodeId: resourceId as Atoms["MindmapNodeId"],
      commentId: commentId as Atoms["MindmapNodeCommentId"],
      content,
    } as API4MarkdownPayload<"editMindmapNodeComment">)
    .then(toCommentFromMindmapNode);

export const deleteDocumentComment = async (
  resourceId: ResourceId,
  commentId: CommentId,
) =>
  getAPI().call("deleteDocumentComment")({
    resourceId: resourceId as Atoms["DocumentId"],
    commentId: commentId as Atoms["DocumentCommentId"],
  });

export const deleteMindmapNodeComment = async (
  resourceId: ResourceId,
  commentId: CommentId,
) =>
  getAPI().call("deleteMindmapNodeComment")({
    nodeId: resourceId as Atoms["MindmapNodeId"],
    commentId: commentId as Atoms["MindmapNodeCommentId"],
  } as API4MarkdownPayload<"deleteMindmapNodeComment">);

export const rateUserProfile = async (
  resourceId: ResourceId,
  category: RatingCategory,
): Promise<null> =>
  getAPI()
    .call("rateUserProfile")({
      userProfileId: resourceId as Atoms["UserProfileId"],
      category,
    })
    .then(() => null);

export const addUserProfileScore = async (
  resourceId: ResourceId,
  score: ScoreValue,
): Promise<Score> =>
  getAPI()
    .call("addUserProfileScore")({
      userProfileId: resourceId as Atoms["UserProfileId"],
      score: score as Atoms["ScoreValue"],
    })
    .then(toScoreFromApi);

export const getUserProfileComments = async (
  resourceId: ResourceId,
  nextCursor: CommentsNextCursor | null,
  _limit: number | null,
) => {
  if (nextCursor) {
    return {
      data: [],
      hasMore: false,
      nextCursor: null,
    };
  }

  const data = await getAPI().call("getUserProfile")({
    profileId: resourceId as Atoms["UserProfileId"],
  });

  return {
    data: data.comments.map(toCommentFromUserProfile),
    hasMore: false,
    nextCursor: null,
  };
};

export const rateUserProfileComment = async (
  resourceId: ResourceId,
  commentId: CommentId,
  category: RatingCategory,
) =>
  getAPI().call("rateUserProfileComment")({
    profileId: resourceId as Atoms["UserProfileId"],
    commentId: commentId as Atoms["UserProfileCommentId"],
    category,
  });

export const addUserProfileComment = async (
  resourceId: ResourceId,
  content: string,
): Promise<Comment> =>
  getAPI()
    .call("addUserProfileComment")({
      receiverProfileId: resourceId as Atoms["UserProfileId"],
      comment: content,
    })
    .then(toCommentFromUserProfile);
