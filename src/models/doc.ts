import type {
  DocumentDto,
  PermanentDocumentDto,
  PrivateDocumentDto,
  PublicDocumentDto,
} from 'api-4markdown';
import type { UserAvatarVariantObj, UserProfile } from './user';

type PermamentSlimDoc = Omit<
  PermanentDocumentDto,
  'visibility' | 'code' | 'author'
> & {
  author: {
    displayName: NonNullable<UserProfile['displayName']>;
    avatar: UserAvatarVariantObj | null;
  } | null;
};

type CreateDocPayload = Pick<DocumentDto, 'name' | 'code'>;

type UpdateDocPrivatePayload = Omit<PrivateDocumentDto, 'cdate'>;
type UpdateDocPublicPayload = Omit<PublicDocumentDto, 'cdate' | 'author'>;
type UpdateDocPermanentPayload = Omit<
  PermanentDocumentDto,
  'cdate' | 'path' | 'author'
>;

type UpdateDocPayload =
  | UpdateDocPrivatePayload
  | UpdateDocPublicPayload
  | UpdateDocPermanentPayload;

type DeleteDocPayload = Pick<DocumentDto, 'id'>;

type GetDocPayload = Pick<DocumentDto, 'id'>;
type CreateDocDto = DocumentDto;
type UpdateDocDto = DocumentDto;
type DeleteDocDto = Pick<DocumentDto, 'id'>;
type GetDocDto = DocumentDto;

type GetPermanentDocsDto = PermanentDocumentDto[];
type UpdateDocumentCodePayload = Pick<DocumentDto, 'mdate' | 'id' | 'code'>;
type UpdateDocumentCodeResponse = Pick<DocumentDto, 'mdate'>;

export type {
  CreateDocPayload,
  UpdateDocPayload,
  CreateDocDto,
  GetDocDto,
  GetDocPayload,
  UpdateDocDto,
  UpdateDocPrivatePayload,
  UpdateDocPublicPayload,
  UpdateDocPermanentPayload,
  DeleteDocPayload,
  GetPermanentDocsDto,
  DeleteDocDto,
  PermamentSlimDoc,
  UpdateDocumentCodePayload,
  UpdateDocumentCodeResponse,
};
