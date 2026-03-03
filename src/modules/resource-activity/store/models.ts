import type {
  Atoms,
  UserProfileCommentDto,
  UserProfileDto,
} from "api-4markdown-contracts";
import { Transaction } from "development-kit/utility-types";

type ResourceActivityModel =
  | {
      id: string;
      type: "created";
      cdate: Atoms["UTCDate"];
      authorProfile: UserProfileDto | null;
    }
  | {
      id: string;
      type: "content-changed";
      cdate: Atoms["UTCDate"];
      authorProfile: UserProfileDto | null;
      previousContent: string;
      newContent: string;
    }
  | {
      id: string;
      type: "visibility-changed";
      cdate: Atoms["UTCDate"];
      authorProfile: UserProfileDto | null;
      previousVisibility: Atoms["ResourceVisibility"];
      newVisibility: Atoms["ResourceVisibility"];
    }
  | {
      id: string;
      type: "metadata-updated";
      cdate: Atoms["UTCDate"];
      authorProfile: UserProfileDto | null;
      previousMeta: {
        tags: string[];
        description: string | null;
      };
      newMeta: {
        tags: string[];
        description: string | null;
      };
    }
  | {
      id: string;
      type: "comment-added";
      cdate: Atoms["UTCDate"];
      authorProfile: UserProfileDto | null;
      comment: UserProfileCommentDto;
    }
  | {
      id: string;
      type: "rating-changed";
      cdate: Atoms["UTCDate"];
      authorProfile: UserProfileDto | null;
      previousRating: Atoms["Rating"];
      newRating: Atoms["Rating"];
    }
  | {
      id: string;
      type: "score-changed";
      cdate: Atoms["UTCDate"];
      authorProfile: UserProfileDto | null;
      previousScore: Atoms["Score"];
      newScore: Atoms["Score"];
    };

type ResourceActivityState = Transaction<{
  data: ResourceActivityModel[];
  hasMore: boolean;
  nextCursor: {
    cdate: Atoms["UTCDate"];
    id: Atoms["DocumentActivityId"];
  } | null;
  isLoadingMore: boolean;
}>;

type OkResourceActivityState = Extract<ResourceActivityState, { is: `ok` }>;

export type {
  ResourceActivityModel,
  ResourceActivityState,
  OkResourceActivityState,
};
