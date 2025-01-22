import type { Base64, Date } from '../atoms';
import type {
  DocumentDto,
  PermanentDocumentDto,
  PrivateDocumentDto,
  PublicDocumentDto,
  ImageDto,
  UserProfileDto,
  DocumentRatingCategory,
  DocumentRatingDto,
} from '../dtos';

type Contract<TKey extends string, TDto, TPayload = undefined> = {
  key: TKey;
  dto: TDto;
  payload: TPayload;
};

type GetYourDocumentsContract = Contract<
  `getYourDocuments`,
  (
    | PrivateDocumentDto
    | Omit<PublicDocumentDto, 'author' | 'rating'>
    | Omit<PermanentDocumentDto, 'author' | 'rating'>
  )[]
>;
type GetAccessibleDocumentContract = Contract<
  `getAccessibleDocument`,
  PublicDocumentDto | PermanentDocumentDto,
  Pick<DocumentDto, 'id'>
>;
type GetPermanentDocumentsContract = Contract<
  `getPermanentDocuments`,
  PermanentDocumentDto[]
>;
type DeleteDocumentContract = Contract<
  `deleteDocument`,
  Pick<DocumentDto, 'id'>,
  Pick<DocumentDto, 'id'>
>;
type UpdateDocumentCodeContract = Contract<
  `updateDocumentCode`,
  Pick<DocumentDto, 'mdate'>,
  Pick<DocumentDto, 'mdate' | 'id' | 'code'>
>;
type UpdateDocumentNameContract = Contract<
  `updateDocumentName`,
  Pick<DocumentDto, 'mdate' | 'name'>,
  Pick<DocumentDto, 'mdate' | 'id' | 'name'>
>;
type CreateDocumentContract = Contract<
  `createDocument`,
  PrivateDocumentDto,
  Pick<PrivateDocumentDto, 'name' | 'code'>
>;
type UpdateDocumentVisibilityContract = Contract<
  `updateDocumentVisibility`,
  | PrivateDocumentDto
  | Omit<PublicDocumentDto, 'author' | 'rating'>
  | Omit<PermanentDocumentDto, 'author' | 'rating'>,
  | Pick<PrivateDocumentDto, 'id' | 'mdate' | 'visibility'>
  | Pick<PublicDocumentDto, 'id' | 'mdate' | 'visibility'>
  | Pick<
      PermanentDocumentDto,
      'id' | 'mdate' | 'visibility' | 'description' | 'tags' | 'name'
    >
>;

type UploadImageContract = Contract<
  `uploadImage`,
  ImageDto,
  { image: FileReader['result'] }
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
  Omit<UserProfileDto, 'avatar'> & {
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
  DocumentRatingDto,
  {
    documentId: DocumentDto['id'];
    category: DocumentRatingCategory;
  }
>;

type API4MarkdownContracts =
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
  | UpdateDocumentNameContract;

type API4MarkdownContractKey = API4MarkdownContracts['key'];
type API4MarkdownDto<TKey extends API4MarkdownContractKey> = Extract<
  API4MarkdownContracts,
  { key: TKey }
>['dto'];

type API4MarkdownPayload<TKey extends API4MarkdownContractKey> = Extract<
  API4MarkdownContracts,
  { key: TKey }
>['payload'];

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

type API4MarkdownCacheSignature<TKey extends API4MarkdownContractKey> = {
  __expiry__: number;
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
  symbol: 'unknown';
  content: string;
  message: string;
};

type NoInternetError = {
  symbol: 'no-internet';
  content: string;
  message: string;
};

type ParsedError = KnownError | UnknownError | NoInternetError;

export type {
  API4MarkdownContracts,
  API4MarkdownContractKey,
  API4MarkdownDto,
  API4MarkdownPayload,
  API4MarkdownResult,
  API4MarkdownCacheSignature,
  GetYourDocumentsContract,
  GetAccessibleDocumentContract,
  GetPermanentDocumentsContract,
  DeleteDocumentContract,
  UpdateDocumentCodeContract,
  CreateDocumentContract,
  UpdateDocumentVisibilityContract,
  UploadImageContract,
  GetYourUserProfileContract,
  UpdateYourUserProfileContract,
  RateDocumentContract,
  UpdateDocumentNameContract,
  API4MarkdownContractCall,
  ParsedError,
  UnknownError,
  KnownError,
  NoInternetError,
};
