import type { API4MarkdownDto, ParsedError } from 'api-4markdown-contracts';

type YourUserProfileState = {
  busy: boolean;
  error: ParsedError | null;
  profile: API4MarkdownDto<`getYourUserProfile`>;
};

export type { YourUserProfileState };
