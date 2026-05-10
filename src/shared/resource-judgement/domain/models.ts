import { Brand } from "development-kit/utility-types";

export type RatingCategory = "ugly" | "bad" | "decent" | "good" | "perfect";

export type Rating = Record<RatingCategory, number>;

export type JudgementConfiguration = {
  rating: Rating;
};

export type DocumentId = Brand<string, `DocumentId`>;

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
