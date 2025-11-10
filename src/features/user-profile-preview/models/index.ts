import { UserProfileCommentDto, UserProfileDto } from "api-4markdown-contracts";
import { Transaction } from "development-kit/utility-types";

type UserProfileState = {
  stats: Transaction<{
    comments: UserProfileCommentDto[];
    profile: UserProfileDto;
  }>;
};

export type { UserProfileState };
