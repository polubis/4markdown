import { API4MarkdownDto, API4MarkdownPayload } from "api-4markdown-contracts";
import { Transaction } from "development-kit/utility-types";

type AddUserProfileCommentFormValues = {
  content: API4MarkdownPayload<"addUserProfileComment">["comment"];
};

type UserProfileState = {
  stats: Transaction<{
    comments: API4MarkdownDto<"getUserProfile">["comments"];
    profile: API4MarkdownDto<"getUserProfile">["profile"];
  }>;
};

export type { AddUserProfileCommentFormValues, UserProfileState };
