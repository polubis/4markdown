import { API4MarkdownDto } from "api-4markdown-contracts";
import { Transaction } from "development-kit/utility-types";

type UserProfileState = {
  stats: Transaction<{
    comments: API4MarkdownDto<"getUserProfile">["comments"];
    profile: API4MarkdownDto<"getUserProfile">["profile"];
  }>;
};

export type { UserProfileState };
