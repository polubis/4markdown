export type RatingCategory = "ugly" | "bad" | "decent" | "good" | "perfect";

export type Rating = Record<RatingCategory, number>;
export type ScoreValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type Score = {
  average: number;
  count: number;
  values: ScoreValue[];
};

export type ResourceId = string | number;
export type CommentId = string | number;
export type ResourceType = "document" | "mindmap" | "mindmap-node";

export type Comment = {
  id: CommentId;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorDisplayName: string;
  authorAvatarUrl?: string | null;
  repliesCount: number;
  rating: Rating;
};

export type Configuration = {
  resourceId: ResourceId;
  resouceType: ResourceType;
  rating: Rating;
  score: Score;
  /** Current viewer's chosen category; drives picker and summary highlight. */
  myCategory?: RatingCategory | null;
  /** Current viewer's chosen score; drives score picker highlight. */
  myScore?: ScoreValue | null;
};

export type OperationError = string;

export type BusEvent =
  | {
      type: "fail";
      message: OperationError;
    }
  | {
      type: "success";
      message: string;
    };
