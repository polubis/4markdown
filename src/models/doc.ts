import type { Id, Name, Code, Date } from './general';

interface Doc {
  id: Id;
  name: Name;
  code: Code;
  mdate: Date;
  cdate: Date;
  visibility: 'private' | 'public';
}

type CreateDocPayload = Pick<Doc, 'name' | 'code'>;

type UpdateDocPayload = Pick<Doc, 'name' | 'code' | 'id' | 'visibility'>;

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
  DeleteDocPayload,
  DeleteDocDto,
};
