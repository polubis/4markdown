import { Prettify } from "development-kit/utility-types";
import { RatingDto } from "./rating.dto";
import { CommentId, DateStamp } from "../atoms";
import { UserProfileDto } from "./user-profile.dto";

type CommentDto = Prettify<
  RatingDto & {
    id: CommentId;
    ownerProfile: UserProfileDto;
    cdate: DateStamp;
    mdate: DateStamp;
    content: string;
  }
>;

export type { CommentDto };
