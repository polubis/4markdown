export type RatingCategory = "ugly" | "bad" | "decent" | "good" | "perfect";

export type Rating = Record<RatingCategory, number>;

export type ResourceId = string | number;

export type JudgementConfiguration = {
  resourceId: ResourceId;
  rating: Rating;
  /** Current viewer's chosen category; drives picker and summary highlight. */
  myCategory?: RatingCategory | null;
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
