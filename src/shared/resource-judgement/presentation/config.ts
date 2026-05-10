import { BiBulb, BiDislike, BiHeart, BiLaugh, BiLike } from "react-icons/bi";
import { RatingCategory } from "../domain/models";
import { IconType } from "react-icons";

export const RATING_ICONS: { category: RatingCategory; Icon: IconType }[] = [
  { category: "perfect", Icon: BiHeart },
  { category: "good", Icon: BiBulb },
  { category: "decent", Icon: BiLike },
  { category: "bad", Icon: BiDislike },
  { category: "ugly", Icon: BiLaugh },
];

export const RATING_COLORS: Record<RatingCategory, string> = {
  perfect: "text-rose-500",
  good: "text-amber-500",
  decent: "text-emerald-500",
  bad: "text-blue-600",
  ugly: "text-purple-500",
};

export const RATING_BG_COLORS: Record<RatingCategory, string> = {
  perfect: "bg-rose-500",
  good: "bg-amber-500",
  decent: "bg-emerald-500",
  bad: "bg-blue-600",
  ugly: "bg-purple-500",
};

export const RATING_BURST_COUNT: Record<RatingCategory, number> = {
  perfect: 5,
  good: 4,
  decent: 3,
  bad: 2,
  ugly: 1,
};
