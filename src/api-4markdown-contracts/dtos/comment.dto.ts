import { Prettify } from "development-kit/utility-types";
import { CommentId, Date } from "../atoms";
import { UserProfileDto } from "./user-profile.dto";
import { RatingDto } from "../dtos-2";

type CommentDto = Prettify<
  RatingDto & {
    id: CommentId;
    ownerProfile: UserProfileDto;
    cdate: Date;
    mdate: Date;
    content: string;
  }
>;

export type { CommentDto };
