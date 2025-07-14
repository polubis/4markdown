import { Prettify } from "development-kit/utility-types";
import { RatingDto } from "./rating.dto";
import { CommentId, Date } from "../atoms";
import { UserProfileDto } from "./user-profile.dto";

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
