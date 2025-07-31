import { Brand, type Prettify } from "development-kit/utility-types";
import type {
  Base64,
  Date,
  DocumentId,
  Id,
  MindmapId,
  MindmapNodeId,
  ResourceId,
  ResourceType,
  Url,
  UserProfileId,
} from "../atoms";
import type {
  DocumentDto,
  PermanentDocumentDto,
  PrivateDocumentDto,
  PublicDocumentDto,
  ImageDto,
  UserProfileDto,
  RatingCategory,
  RatingDto,
  MindmapDto,
  FullMindmapDto,
  RewriteAssistantPersona,
  YourAccountDto,
  CommentDto,
  ResourceCompletionDto,
} from "../dtos";
// @TODO[PRIO=1]: [Add better error handling and throwing custom errors].

type Contract<TKey extends string, TDto, TPayload = undefined> = {
  key: TKey;
  dto: TDto;
  payload: TPayload;
};

type GetYourAccountContract = Contract<`getYourAccount`, YourAccountDto>;

type CreateContentWithAIContract = Contract<
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
type RewriteWithAssistantContract = Contract<
  `rewriteWithAssistant`,
  { output: string; tokensAfter: number },
  {
    input: string;
    persona: RewriteAssistantPersona;
  }
>;

type ReportBugContract = Contract<
  `reportBug`,
  null,
  {
    title: string;
    description: string;
    url: Url;
  }
>;

type GetPermanentMindmapsContract = Contract<
  `getPermanentMindmaps`,
  FullMindmapDto[],
  { limit?: number }
>;

type GetAccessibleMindmapContract = Contract<
  `getAccessibleMindmap`,
  FullMindmapDto,
  { authorId: Id; mindmapId: Id }
>;

type CreateMindmapContract = Contract<
  `createMindmap`,
  MindmapDto,
  Pick<
    MindmapDto,
    "name" | "description" | "tags" | "nodes" | "edges" | "orientation"
  >
>;

type UpdateMindmapNameContract = Contract<
  `updateMindmapName`,
  Pick<MindmapDto, "name" | "mdate" | "path">,
  Pick<MindmapDto, "name" | "mdate" | "id">
>;

type UpdateMindmapShapeContract = Contract<
  `updateMindmapShape`,
  Pick<MindmapDto, "nodes" | "mdate" | "edges" | "orientation">,
  Pick<MindmapDto, "nodes" | "mdate" | "id" | "edges" | "orientation">
>;

type DeleteMindmapContract = Contract<
  `deleteMindmap`,
  null,
  Pick<MindmapDto, "id">
>;

type UpdateMindmapVisibilityContract = Contract<
  `updateMindmapVisibility`,
  Pick<MindmapDto, "mdate">,
  Pick<MindmapDto, "mdate" | "id" | "visibility">
>;

type UpdateMindmapContract = Contract<
  "updateMindmap",
  Pick<MindmapDto, "mdate" | "name" | "description" | "tags" | "path">,
  Pick<MindmapDto, "mdate" | "name" | "description" | "tags" | "id">
>;

type GetYourMindmapsContract = Contract<
  `getYourMindmaps`,
  {
    mindmapsCount: number;
    mindmaps: MindmapDto[];
  }
>;

type GetYourDocumentsContract = Contract<
  `getYourDocuments`,
  (
    | PrivateDocumentDto
    | Omit<PublicDocumentDto, "author" | "rating">
    | Omit<PermanentDocumentDto, "author" | "rating">
  )[]
>;
type GetAccessibleDocumentContract = Contract<
  `getAccessibleDocument`,
  PublicDocumentDto | PermanentDocumentDto,
  { documentId: DocumentDto["id"] }
>;
type GetPermanentDocumentsContract = Contract<
  `getPermanentDocuments`,
  Prettify<PermanentDocumentDto & { isAuthorTrusted: boolean }>[]
>;
type DeleteDocumentContract = Contract<
  `deleteDocument`,
  Pick<DocumentDto, "id">,
  Pick<DocumentDto, "id">
>;
type UpdateDocumentCodeContract = Contract<
  `updateDocumentCode`,
  Pick<DocumentDto, "mdate">,
  Pick<DocumentDto, "mdate" | "id" | "code">
>;
type UpdateDocumentNameContract = Contract<
  `updateDocumentName`,
  Pick<DocumentDto, "mdate" | "name">,
  Pick<DocumentDto, "mdate" | "id" | "name">
>;
type CreateDocumentContract = Contract<
  `createDocument`,
  PrivateDocumentDto,
  Pick<PrivateDocumentDto, "name" | "code">
>;
type UpdateDocumentVisibilityContract = Contract<
  `updateDocumentVisibility`,
  | PrivateDocumentDto
  | Omit<PublicDocumentDto, "author" | "rating">
  | Omit<PermanentDocumentDto, "author" | "rating">,
  | Pick<PrivateDocumentDto, "id" | "mdate" | "visibility">
  | Pick<PublicDocumentDto, "id" | "mdate" | "visibility">
  | Pick<
      PermanentDocumentDto,
      "id" | "mdate" | "visibility" | "description" | "tags" | "name"
    >
>;

type UploadImageContract = Contract<
  `uploadImage`,
  ImageDto,
  { image: FileReader["result"] }
>;

type GetYourUserProfileContract = Contract<
  `getYourUserProfile`,
  {
    profile: UserProfileDto;
    mdate: Date;
  } | null
>;
type UpdateYourUserProfileContract = Contract<
  `updateYourUserProfileV2`,
  {
    profile: UserProfileDto;
    mdate: Date;
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
    mdate: Date | null;
    avatar:
      | {
          type: `noop`;
        }
      | { type: `remove` }
      | { type: `update`; data: Base64 };
  }
>;

type RateDocumentContract = Contract<
  `rateDocument`,
  RatingDto,
  {
    documentId: DocumentDto["id"];
    category: RatingCategory;
  }
>;

type GetUserProfileContract = Contract<
  `getUserProfile`,
  {
    profile: UserProfileDto;
    comments: CommentDto[];
  },
  {
    profileId: UserProfileId;
  }
>;

type AddUserProfileCommentContract = Contract<
  `addUserProfileComment`,
  CommentDto,
  {
    receiverProfileId: UserProfileId;
    comment: string;
  }
>;

type GetUserResourceCompletionsContract = Contract<
  `getUserResourceCompletions`,
  Record<ResourceId, ResourceCompletionDto>
>;

type SetUserResourceCompletionContract = Contract<
  "setUserResourceCompletion",
  ResourceCompletionDto | null,
  | {
      type: Extract<ResourceType, "document">;
      resourceId: DocumentId;
    }
  | {
      type: Extract<ResourceType, "mindmap">;
      resourceId: MindmapId;
    }
  | {
      type: Extract<ResourceType, "mindmap-node">;
      resourceId: MindmapNodeId;
      parentId: MindmapId;
    }
>;

type API4MarkdownContracts =
  | CreateMindmapContract
  | GetYourDocumentsContract
  | GetAccessibleDocumentContract
  | GetPermanentDocumentsContract
  | DeleteDocumentContract
  | UpdateDocumentCodeContract
  | CreateDocumentContract
  | UpdateDocumentVisibilityContract
  | UploadImageContract
  | GetYourUserProfileContract
  | UpdateYourUserProfileContract
  | RateDocumentContract
  | UpdateDocumentNameContract
  | GetYourMindmapsContract
  | UpdateMindmapNameContract
  | UpdateMindmapShapeContract
  | DeleteMindmapContract
  | UpdateMindmapVisibilityContract
  | UpdateMindmapContract
  | GetAccessibleMindmapContract
  | ReportBugContract
  | GetPermanentMindmapsContract
  | RewriteWithAssistantContract
  | CreateContentWithAIContract
  | GetYourAccountContract
  | GetUserProfileContract
  | AddUserProfileCommentContract
  | GetUserResourceCompletionsContract
  | SetUserResourceCompletionContract;

type API4MarkdownContractKey = API4MarkdownContracts["key"];
type API4MarkdownDto<TKey extends API4MarkdownContractKey> = Extract<
  API4MarkdownContracts,
  { key: TKey }
>["dto"];

type API4MarkdownPayload<TKey extends API4MarkdownContractKey> = Extract<
  API4MarkdownContracts,
  { key: TKey }
>["payload"];

type API4MarkdownContractCall = <TKey extends API4MarkdownContractKey>(
  key: TKey,
) => API4MarkdownPayload<TKey> extends undefined
  ? () => Promise<API4MarkdownDto<TKey>>
  : (payload: API4MarkdownPayload<TKey>) => Promise<API4MarkdownDto<TKey>>;

type API4MarkdownResult<TKey extends API4MarkdownContractKey> =
  | { is: `fail`; error: unknown }
  | {
      is: `ok`;
      payload: API4MarkdownPayload<TKey>;
      dto: API4MarkdownDto<TKey>;
    };

type CacheVersion = Brand<string, "CacheVersion">;

type API4MarkdownCacheSignature<TKey extends API4MarkdownContractKey> = {
  __expiry__: number;
  __version__: CacheVersion;
  value: API4MarkdownDto<TKey> | null;
};

type ErrorSymbol =
  | `already-exists`
  | `unauthenticated`
  | `internal`
  | `invalid-schema`
  | `not-found`
  | `out-of-date`
  | `bad-request`
  | `unauthorized`;
type ErrorContent = string | { key: string; message: string }[];

type ErrorVariant<
  TSymbol extends ErrorSymbol,
  TContent extends ErrorContent = string,
> = {
  symbol: TSymbol;
  content: TContent;
  message: string;
};

type AlreadyExistsError = ErrorVariant<`already-exists`>;
type UnauthenticatedError = ErrorVariant<`unauthenticated`>;
type Unauthorized = ErrorVariant<`unauthorized`>;
type InternalError = ErrorVariant<`internal`>;
type InvalidSchemaError = ErrorVariant<
  `invalid-schema`,
  { key: string; message: string }[]
>;
type NotFoundError = ErrorVariant<`not-found`>;
type OutOfDateError = ErrorVariant<`out-of-date`>;
type BadRequestError = ErrorVariant<`bad-request`>;

type KnownError =
  | AlreadyExistsError
  | UnauthenticatedError
  | Unauthorized
  | InternalError
  | InvalidSchemaError
  | NotFoundError
  | OutOfDateError
  | BadRequestError;

type UnknownError = {
  symbol: "unknown";
  content: string;
  message: string;
};

type NoInternetError = {
  symbol: "no-internet";
  content: string;
  message: string;
};

type ClientError = {
  symbol: "client-error";
  content: string;
  message: string;
};

type ParsedError = KnownError | UnknownError | NoInternetError | ClientError;

export type {
  API4MarkdownContracts,
  API4MarkdownContractKey,
  API4MarkdownDto,
  API4MarkdownPayload,
  API4MarkdownResult,
  API4MarkdownCacheSignature,
  API4MarkdownContractCall,
  ParsedError,
  UnknownError,
  KnownError,
  NoInternetError,
  ClientError,
  CacheVersion,
};
