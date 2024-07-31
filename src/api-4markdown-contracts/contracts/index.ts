import type { Base64 } from '../atoms';
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

type GetDocsContract = Contract<`getDocs`, DocumentDto[]>;
type GetPublicDocContract = Contract<
  `getPublicDoc`,
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
type CreateDocContract = Contract<
  `createDoc`,
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
  UserProfileDto | null
>;
type UpdateYourUserProfileContract = Contract<
  `updateYourUserProfile`,
  UserProfileDto,
  Omit<UserProfileDto, 'avatar'> & {
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
  | GetDocsContract
  | GetPublicDocContract
  | GetPermanentDocumentsContract
  | DeleteDocumentContract
  | UpdateDocumentCodeContract
  | CreateDocContract
  | UpdateDocContract
  | UploadImageContract
  | GetYourUserProfileContract
  | UpdateYourUserProfileContract
  | RateDocumentContract;

type API4MarkdownContractKey = API4MarkdownContracts['key'];
type API4MarkdownDto<TKey extends API4MarkdownContractKey> = Promise<
  Extract<API4MarkdownContracts, { key: TKey }>['dto']
>;
type API4MarkdownPayload<TKey extends API4MarkdownContractKey> = Extract<
  API4MarkdownContracts,
  { key: TKey }
>['payload'];

type API4MarkdownContract<TKey extends API4MarkdownContractKey> =
  API4MarkdownPayload<TKey> extends undefined
    ? () => API4MarkdownDto<TKey>
    : (payload: API4MarkdownPayload<TKey>) => API4MarkdownDto<TKey>;

export type {
  API4MarkdownContracts,
  API4MarkdownContractKey,
  API4MarkdownContract,
  API4MarkdownDto,
  API4MarkdownPayload,
  GetDocsContract,
  GetPublicDocContract,
  GetPermanentDocumentsContract,
  DeleteDocumentContract,
  UpdateDocumentCodeContract,
  CreateDocContract,
  UpdateDocContract,
  UploadImageContract,
  GetYourUserProfileContract,
  UpdateYourUserProfileContract,
  RateDocumentContract,
};
