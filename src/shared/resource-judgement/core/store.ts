import { create } from "zustand";
import {
  Comment,
  Configuration,
  type Rating,
  type RatingCategory,
  type ResourceId,
  type ResourceType,
  type Score,
  type ScoreValue,
} from "../domain/models";
import { Transaction } from "development-kit/utility-types";

export type State = {
  rating: Rating;
  score: Score;
  resourceId: ResourceId;
  resouceType: ResourceType;
  myCategory: RatingCategory | null;
  myScore: ScoreValue | null;
  comments: Transaction<{ data: Comment[] }>;
};

export const createStore = ({
  rating,
  score,
  resourceId,
  resouceType,
  myCategory = null,
  myScore = null,
}: Configuration) => {
  return create<State>(() => ({
    rating,
    score,
    resourceId,
    resouceType,
    myCategory,
    myScore,
    comments: { is: "idle" },
  }));
};

export type Store = ReturnType<typeof createStore>;
