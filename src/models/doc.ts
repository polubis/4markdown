import type { Id, Name, Code, Date, Path } from './general';

interface DocBase {
  id: Id;
  name: Name;
  code: Code;
  mdate: Date;
  cdate: Date;
}

interface PrivateDoc extends DocBase {
  visibility: 'private';
}

interface PublicDoc extends DocBase {
  visibility: 'public';
}

interface PermanentBlog extends DocBase {
  visibility: `permanent`;
  description: string;
  path: Path;
}

type Doc = PrivateDoc | PublicDoc | PermanentBlog;

type CreateDocPayload = Pick<Doc, 'name' | 'code'>;

type UpdateDocPrivatePayload = Omit<PrivateDoc, 'cdate' | 'mdate'>;
type UpdateDocPublicPayload = Omit<PublicDoc, 'cdate' | 'mdate'>;
type UpdateDocPermanentPayload = Omit<
  PermanentBlog,
  'cdate' | 'mdate' | 'path'
>;

type UpdateDocPayload =
  | UpdateDocPrivatePayload
  | UpdateDocPublicPayload
  | UpdateDocPermanentPayload;

type DeleteDocPayload = Pick<Doc, 'id'>;

type GetDocPayload = Pick<Doc, 'id'>;
type CreateDocDto = Doc;
type UpdateDocDto = Doc;
type DeleteDocDto = Pick<Doc, 'id'>;
type GetDocDto = Doc;

export type {
  Doc,
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
  DeleteDocDto,
  DocBase,
  PrivateDoc,
  PublicDoc,
  PermanentBlog,
};
