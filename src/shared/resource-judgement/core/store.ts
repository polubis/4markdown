import { create } from "zustand";
import {
  Comment,
  Configuration,
  type CommentsNextCursor,
  type OperationError,
  type Rating,
  type RatingCategory,
  type ResourceId,
  type ResourceType,
  type Score,
  type ScoreValue,
} from "../domain/models";
type State = {
  rating: Rating;
  score: Score;
  resourceId: ResourceId;
  resouceType: ResourceType;
  myCategory: RatingCategory | null;
  myScore: ScoreValue | null;
  comments: {
    data: Comment[];
    hasMore: boolean;
    nextCursor: CommentsNextCursor | null;
    isLoading: boolean;
    isLoadingMore: boolean;
    error: OperationError | null;
    totalCount: number;
    loaded: boolean;
  };
};

export const createStore = ({
  rating,
  score,
  resourceId,
  resouceType,
  myCategory = null,
  myScore = null,
  commentsCount = 0,
  comments,
}: Configuration) => {
  return create<State>(() => ({
    rating,
    score,
    resourceId,
    resouceType,
    myCategory,
    myScore,
    comments: {
      data: comments ?? [],
      hasMore: false,
      nextCursor: null,
      isLoading: false,
      isLoadingMore: false,
      error: null,
      totalCount: commentsCount || comments?.length || 0,
      loaded: comments !== undefined,
    },
  }));
};

export type Store = ReturnType<typeof createStore>;
