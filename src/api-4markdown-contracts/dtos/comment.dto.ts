import { Prettify } from "development-kit/utility-types";
import { RatingDto } from "./rating.dto";
import { CommentId, Date } from "../atoms";
import { CreatedUserProfileDto } from "./user-profile.dto";

type CommentDto = Prettify<
	RatingDto & {
		id: CommentId;
		ownerProfile: CreatedUserProfileDto;
		cdate: Date;
		mdate: Date;
		content: string;
	}
>;

export type { CommentDto };
