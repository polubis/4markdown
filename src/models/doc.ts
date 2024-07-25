import type {
  DocumentDto,
  PermanentDocumentDto,
  PrivateDocumentDto,
  PublicDocumentDto,
} from 'api-4markdown';

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
type GetDocDto = PublicDocumentDto | PermanentDocumentDto;

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
  UpdateDocumentCodePayload,
  UpdateDocumentCodeResponse,
};
