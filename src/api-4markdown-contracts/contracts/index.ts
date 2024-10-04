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

type GetYourDocumentsContract = Contract<`getYourDocuments`, DocumentDto[]>;
type GetAccessibleDocumentContract = Contract<
  `getAccessibleDocument`,
  PublicDocumentDto | PermanentDocumentDto,
  Pick<DocumentDto, 'id'>
>;
type GetPermanentDocumentsContract = Contract<
  `gerPermanentDocuments`,
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
type CreateDocumentContract = Contract<
  `createDocument`,
  PrivateDocumentDto,
  Pick<PrivateDocumentDto, 'name' | 'code'>
>;
type UpdateDocContract = Contract<
  `updateDoc`,
  DocumentDto,
  | Omit<PrivateDocumentDto, 'cdate'>
  | Omit<PublicDocumentDto, 'cdate' | 'author' | 'rating'>
  | Omit<PermanentDocumentDto, 'cdate' | 'path' | 'author' | 'rating'>
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
  `updateYourUserProfile`,
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

type GetEducationDashboardContract = Contract<
  `getEducationDashboard`,
  {
    documents: {
      top: (Pick<PermanentDocumentDto, 'id' | 'path' | 'name' | 'rating'> & {
        author: {
          avatar: NonNullable<UserProfileDto['avatar']>['sm'] | null;
          displayName: NonNullable<UserProfileDto['displayName']>;
        } | null;
      })[];
    };
  }
>;

type API4MarkdownContracts =
  | GetYourDocumentsContract
  | GetAccessibleDocumentContract
  | GetPermanentDocumentsContract
  | DeleteDocumentContract
  | UpdateDocumentCodeContract
  | CreateDocumentContract
  | UpdateDocContract
  | UploadImageContract
  | GetYourUserProfileContract
  | UpdateYourUserProfileContract
  | RateDocumentContract
  | GetEducationDashboardContract;

type API4MarkdownContractKey = API4MarkdownContracts['key'];
type API4MarkdownDto<TKey extends API4MarkdownContractKey> = Extract<
  API4MarkdownContracts,
  { key: TKey }
>['dto'];

type API4MarkdownPayload<TKey extends API4MarkdownContractKey> = Extract<
  API4MarkdownContracts,
  { key: TKey }
>['payload'];

type API4MarkdownContract<TKey extends API4MarkdownContractKey> =
  API4MarkdownPayload<TKey> extends undefined
    ? () => Promise<API4MarkdownDto<TKey>>
    : (payload: API4MarkdownPayload<TKey>) => Promise<API4MarkdownDto<TKey>>;

type API4MarkdownContractCall = <TKey extends API4MarkdownContractKey>(
  key: TKey,
) => API4MarkdownPayload<TKey> extends undefined
  ? () => Promise<API4MarkdownDto<TKey>>
  : (payload: API4MarkdownPayload<TKey>) => Promise<API4MarkdownDto<TKey>>;

export type {
  API4MarkdownContracts,
  API4MarkdownContractKey,
  API4MarkdownContract,
  API4MarkdownDto,
  API4MarkdownPayload,
  GetYourDocumentsContract,
  GetAccessibleDocumentContract,
  GetPermanentDocumentsContract,
  DeleteDocumentContract,
  UpdateDocumentCodeContract,
  CreateDocumentContract,
  UpdateDocContract,
  UploadImageContract,
  GetYourUserProfileContract,
  UpdateYourUserProfileContract,
  RateDocumentContract,
  GetEducationDashboardContract,
  API4MarkdownContractCall,
};
