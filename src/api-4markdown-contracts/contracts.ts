import { type Prettify } from "development-kit/utility-types";
import type {
  DocumentDto,
  PermanentDocumentDto,
  PrivateDocumentDto,
  PublicDocumentDto,
  ManualDocumentDto,
  DocumentCommentDto,
  MindmapNodeCommentDto,
} from "./dtos";
import {
  AccessGroupDto,
  Atoms,
  UserProfileCommentDto,
  FullMindmapDto,
  ImageDto,
  MindmapDto,
  ResourceActivityDto,
  ResourceCompletionDto,
  ResourceLikeDto,
  UserProfileDto,
  YourAccountDto,
} from "./dtos";

type Contract<TKey extends string, TDto, TPayload = undefined> = {
  key: TKey;
  dto: TDto;
  payload: TPayload;
};

type AccessGroupsContracts =
  | Contract<
      "getAccessGroup",
      Pick<
        AccessGroupDto,
        "cdate" | "description" | "etag" | "id" | "mdate" | "name"
      > & { members: UserProfileDto[] },
      { id: AccessGroupDto["id"] }
    >
  | Contract<
      "getYourAccessGroups",
      {
        hasMore: boolean;
        nextCursor: Pick<AccessGroupDto, "mdate" | "name"> | null;
        accessGroups: AccessGroupDto[];
      },
      {
        limit: number | null;
        cursor: Pick<AccessGroupDto, "mdate" | "name"> | null;
      }
    >
  | Contract<
      "createAccessGroup",
      AccessGroupDto,
      Pick<AccessGroupDto, "name" | "description">
    >
  | Contract<
      "editAccessGroup",
      AccessGroupDto,
      Pick<AccessGroupDto, "name" | "description" | "etag" | "id">
    >
  | Contract<
      "addAccessGroupMember",
      Pick<
        AccessGroupDto,
        "mdate" | "etag" | "id" | "cdate" | "description" | "name"
      > & { member: UserProfileDto },
      Pick<AccessGroupDto, "id" | "etag"> & {
        memberProfileId: Atoms["UserProfileId"];
      }
    >
  | Contract<
      "removeAccessGroupMember",
      Pick<
        AccessGroupDto,
        "mdate" | "etag" | "id" | "cdate" | "description" | "name"
      > & { member: UserProfileDto },
      Pick<AccessGroupDto, "id" | "etag"> & {
        memberProfileId: Atoms["UserProfileId"];
      }
    >
  | Contract<"removeAccessGroup", null, Pick<AccessGroupDto, "id">>;

type DocumentCommentsContracts =
  | Contract<
      `addDocumentComment`,
      DocumentCommentDto,
      {
        comment: string;
        resourceId: Atoms["DocumentId"];
      }
    >
  | Contract<
      `editDocumentComment`,
      DocumentCommentDto,
      {
        commentId: Atoms["DocumentCommentId"];
        resourceId: Atoms["DocumentId"];
        content: string;
      }
    >
  | Contract<
      `getDocumentComments`,
      {
        comments: DocumentCommentDto[];
        hasMore: boolean;
        nextCursor: {
          cdate: Atoms["UTCDate"];
          id: Atoms["DocumentCommentId"];
        } | null;
      },
      {
        resourceId: Atoms["DocumentId"];
        nextCursor: {
          cdate: Atoms["UTCDate"];
          id: Atoms["DocumentCommentId"];
        } | null;
        limit: number | null;
      }
    >
  | Contract<
      `deleteDocumentComment`,
      null,
      {
        resourceId: Atoms["DocumentId"];
        commentId: Atoms["DocumentCommentId"];
      }
    >
  | Contract<
      `rateDocumentComment`,
      null,
      {
        resourceId: Atoms["DocumentId"];
        commentId: Atoms["DocumentCommentId"];
        category: Atoms["RatingCategory"];
      }
    >;

type MindmapNodeCommentsContracts =
  | Contract<
      `addMindmapNodeComment`,
      MindmapNodeCommentDto,
      {
        comment: string;
        resourceId: Atoms["MindmapNodeId"];
      }
    >
  | Contract<
      `editMindmapNodeComment`,
      MindmapNodeCommentDto,
      {
        commentId: Atoms["MindmapNodeCommentId"];
        resourceId: Atoms["MindmapNodeId"];
        content: string;
      }
    >
  | Contract<
      `getMindmapNodeComments`,
      {
        comments: MindmapNodeCommentDto[];
        hasMore: boolean;
        nextCursor: {
          cdate: Atoms["UTCDate"];
          id: Atoms["MindmapNodeCommentId"];
        } | null;
      },
      {
        resourceId: Atoms["MindmapNodeId"];
        nextCursor: {
          cdate: Atoms["UTCDate"];
          id: Atoms["MindmapNodeCommentId"];
        } | null;
        limit: number | null;
      }
    >
  | Contract<
      `deleteMindmapNodeComment`,
      null,
      {
        resourceId: Atoms["MindmapNodeId"];
        commentId: Atoms["MindmapNodeCommentId"];
      }
    >
  | Contract<
      `rateMindmapNodeComment`,
      null,
      {
        resourceId: Atoms["MindmapNodeId"];
        commentId: Atoms["MindmapNodeCommentId"];
        category: Atoms["RatingCategory"];
      }
    >;

type ResourceCompletionsContracts =
  | Contract<
      "getUserResourceCompletions",
      Record<Atoms["ResourceId"], ResourceCompletionDto>
    >
  | Contract<
      "setUserResourceCompletion",
      ResourceCompletionDto | null,
      {
        type: Atoms["ResourceType"];
        resourceId: Atoms["ResourceId"];
        parentId?: Atoms["MindmapId"];
      }
    >;

type ResourceLikesContracts =
  | Contract<
      "getUserResourceLikes",
      Record<Atoms["ResourceId"], ResourceLikeDto>
    >
  | Contract<
      "setUserResourceLike",
      ResourceLikeDto | null,
      {
        type: Atoms["ResourceType"];
        resourceId: Atoms["ResourceId"];
        parentId?: Atoms["MindmapId"];
        liked: boolean;
      }
    >;

type ResourceActivityContracts = Contract<
  "getResourceActivity",
  ResourceActivityDto[],
  {
    resourceId: Atoms["ResourceId"];
    resourceType: Atoms["ResourceType"];
  }
>;

type UserProfilesContracts =
  | Contract<
      "rateUserProfile",
      null,
      {
        userProfileId: Atoms["UserProfileId"];
        category: Atoms["RatingCategory"];
      }
    >
  | Contract<
      "addUserProfileScore",
      Atoms["Score"],
      {
        userProfileId: Atoms["UserProfileId"];
        score: Atoms["ScoreValue"];
      }
    >
  | Contract<
      `getYourUserProfile`,
      {
        profile: UserProfileDto;
        mdate: Atoms["UTCDate"];
      } | null
    >
  | Contract<
      `updateYourUserProfileV2`,
      {
        profile: UserProfileDto;
        mdate: Atoms["UTCDate"];
      },
      Pick<
        UserProfileDto,
        | "bio"
        | "blogUrl"
        | "displayName"
        | "fbUrl"
        | "githubUrl"
        | "linkedInUrl"
        | "twitterUrl"
      > & {
        mdate: Atoms["UTCDate"] | null;
        avatar:
          | {
              type: `noop`;
            }
          | { type: `remove` }
          | { type: `update`; data: string };
      }
    >
  | Contract<
      `getUserProfile`,
      {
        profile: UserProfileDto;
        comments: UserProfileCommentDto[];
      },
      {
        profileId: Atoms["UserProfileId"];
      }
    >
  | Contract<
      "findUserProfiles",
      {
        hasMore: boolean;
        userProfiles: UserProfileDto[];
      },
      { query: string; by: "displayName" | "id"; limit?: number }
    >;

type UserProfileCommentsContracts =
  | Contract<
      `addUserProfileComment`,
      UserProfileCommentDto,
      {
        receiverProfileId: Atoms["UserProfileId"];
        comment: string;
      }
    >
  | Contract<
      `rateUserProfileComment`,
      null,
      {
        profileId: Atoms["UserProfileId"];
        commentId: Atoms["UserProfileCommentId"];
        category: Atoms["RatingCategory"];
      }
    >;

type AccountsContracts = Contract<`getYourAccount`, YourAccountDto>;

type DocumentsContracts =
  | Contract<
      `addDocumentScore`,
      {
        average: number;
        count: number;
        values: Atoms["ScoreValue"][];
      },
      {
        documentId: Atoms["DocumentId"];
        score: Atoms["ScoreValue"];
      }
    >
  | Contract<
      `getYourDocuments`,
      (
        | PrivateDocumentDto
        | Omit<PublicDocumentDto, "author" | "rating">
        | Omit<PermanentDocumentDto, "author" | "rating">
        | Omit<ManualDocumentDto, "author" | "rating">
      )[]
    >
  | Contract<
      `getAccessibleDocument`,
      PublicDocumentDto | PermanentDocumentDto,
      { documentId: Atoms["DocumentId"] }
    >
  | Contract<
      `getPermanentDocuments`,
      Prettify<PermanentDocumentDto & { isAuthorTrusted: boolean }>[]
    >
  | Contract<`deleteDocument`, Pick<DocumentDto, "id">, Pick<DocumentDto, "id">>
  | Contract<
      `updateDocumentCode`,
      Pick<DocumentDto, "mdate">,
      Pick<DocumentDto, "mdate" | "id" | "code">
    >
  | Contract<
      `createDocument`,
      PrivateDocumentDto,
      Pick<PrivateDocumentDto, "name" | "code">
    >
  | Contract<
      `updateDocumentVisibility`,
      | PrivateDocumentDto
      | Omit<PublicDocumentDto, "author" | "rating">
      | Omit<PermanentDocumentDto, "author" | "rating">,
      | Omit<ManualDocumentDto, "author" | "rating">
      | Pick<PrivateDocumentDto, "id" | "mdate" | "visibility">
      | Pick<PublicDocumentDto, "id" | "mdate" | "visibility">
      | Pick<
          PermanentDocumentDto,
          "id" | "mdate" | "visibility" | "description" | "tags" | "name"
        >
      | Pick<ManualDocumentDto, "id" | "mdate" | "visibility">
    >
  | Contract<
      `rateDocument`,
      Atoms["Rating"],
      {
        documentId: DocumentDto["id"];
        category: Atoms["RatingCategory"];
      }
    >
  | Contract<
      `updateDocumentName`,
      Pick<DocumentDto, "mdate" | "name">,
      Pick<DocumentDto, "mdate" | "id" | "name">
    >;

type MindmapNodeEngagementContracts =
  | Contract<
      `addMindmapNodeScore`,
      {
        average: number;
        count: number;
        values: Atoms["ScoreValue"][];
      },
      {
        mindmapNodeId: Atoms["MindmapNodeId"];
        score: Atoms["ScoreValue"];
      }
    >
  | Contract<
      `rateMindmapNode`,
      Atoms["Rating"],
      {
        mindmapNodeId: Atoms["MindmapNodeId"];
        category: Atoms["RatingCategory"];
      }
    >;

type MindmapsContracts =
  | Contract<
      `createMindmap`,
      MindmapDto,
      Pick<
        MindmapDto,
        "name" | "description" | "tags" | "nodes" | "edges" | "orientation"
      >
    >
  | Contract<
      `getYourMindmaps`,
      {
        mindmapsCount: number;
        mindmaps: MindmapDto[];
      }
    >
  | Contract<
      `updateMindmapName`,
      Pick<MindmapDto, "name" | "mdate" | "path">,
      Pick<MindmapDto, "name" | "mdate" | "id">
    >
  | Contract<
      `updateMindmapShape`,
      Pick<MindmapDto, "nodes" | "mdate" | "edges" | "orientation">,
      Pick<MindmapDto, "nodes" | "mdate" | "id" | "edges" | "orientation">
    >
  | Contract<`deleteMindmap`, null, Pick<MindmapDto, "id">>
  | Contract<
      `updateMindmapVisibility`,
      Pick<MindmapDto, "mdate">,
      Pick<MindmapDto, "mdate" | "id" | "visibility" | "sharedForGroups">
    >
  | Contract<
      "updateMindmap",
      Pick<MindmapDto, "mdate" | "name" | "description" | "tags" | "path">,
      Pick<MindmapDto, "mdate" | "name" | "description" | "tags" | "id">
    >
  | Contract<
      `getAccessibleMindmap`,
      FullMindmapDto,
      { authorId: Atoms["UserProfileId"]; mindmapId: Atoms["MindmapId"] }
    >
  | Contract<`getPermanentMindmaps`, FullMindmapDto[], { limit?: number }>;

type AIContracts =
  | Contract<
      `rewriteWithAssistant`,
      { output: string; tokensAfter: number },
      {
        input: string;
        persona: Atoms["RewriteAssistantPersona"];
      }
    >
  | Contract<
      `createContentWithAI`,
      { output: string; tokensAfter: number },
      {
        name: string;
        description: string;
        profession: string;
        style: string[];
        structure: string;
        sample: string;
        prompt?: string;
      }
    >;

type AssetsContracts =
  | Contract<`uploadImage`, ImageDto, { image: FileReader["result"] }>
  | Contract<
      `getYourAssets`,
      {
        hasMore: boolean;
        nextCursor: Pick<ImageDto, "id"> | null;
        assets: ImageDto[];
      },
      {
        limit: number | null;
        cursor: Pick<ImageDto, "id"> | null;
      }
    >
  | Contract<
      `removeAssets`,
      null,
      {
        assetIds: Atoms["ImageId"][];
      }
    >;

type AnalyticsContracts = Contract<
  `reportBug`,
  null,
  {
    title: string;
    description: string;
    url: Atoms["Url"];
  }
>;

type API4MarkdownContracts =
  | DocumentCommentsContracts
  | MindmapNodeCommentsContracts
  | AssetsContracts
  | AnalyticsContracts
  | MindmapsContracts
  | AIContracts
  | DocumentsContracts
  | MindmapNodeEngagementContracts
  | AccountsContracts
  | ResourceCompletionsContracts
  | ResourceLikesContracts
  | ResourceActivityContracts
  | AccessGroupsContracts
  | UserProfilesContracts
  | UserProfileCommentsContracts;

export type API4MarkdownContractKey = API4MarkdownContracts["key"];
export type API4MarkdownDto<TKey extends API4MarkdownContractKey> = Extract<
  API4MarkdownContracts,
  { key: TKey }
>["dto"];

export type API4MarkdownPayload<TKey extends API4MarkdownContractKey> = Extract<
  API4MarkdownContracts,
  { key: TKey }
>["payload"];
