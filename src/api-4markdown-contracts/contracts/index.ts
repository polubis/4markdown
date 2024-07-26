import type { Base64 } from '../atoms';
import type {
  DocumentDto,
  PermanentDocumentDto,
  PrivateDocumentDto,
  PublicDocumentDto,
  ImageDto,
  UserProfileDto,
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
type GetPermanentDocsContract = Contract<
  `getPermanentDocs`,
  PermanentDocumentDto[]
>;
type DeleteDocContract = Contract<
  `deleteDoc`,
  Pick<DocumentDto, 'id'>,
  Pick<DocumentDto, 'id'>
>;
type UpdateDocumentCodeContract = Contract<
  `updateDocumentCode`,
  Pick<DocumentDto, 'mdate' | 'id' | 'code'>,
  Pick<DocumentDto, 'mdate'>
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
  | Omit<PublicDocumentDto, 'cdate' | 'author'>
  | Omit<PermanentDocumentDto, 'cdate' | 'path' | 'author'>
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

type API4MarkdownContracts =
  | GetDocsContract
  | GetPublicDocContract
  | GetPermanentDocsContract
  | DeleteDocContract
  | UpdateDocumentCodeContract
  | CreateDocContract
  | UpdateDocContract
  | UploadImageContract
  | GetYourUserProfileContract
  | UpdateYourUserProfileContract;

export type {
  API4MarkdownContracts,
  GetDocsContract,
  GetPublicDocContract,
  GetPermanentDocsContract,
  DeleteDocContract,
  UpdateDocumentCodeContract,
  CreateDocContract,
  UpdateDocContract,
  UploadImageContract,
  GetYourUserProfileContract,
  UpdateYourUserProfileContract,
};
