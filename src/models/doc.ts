import type { Id, Name, Code, Date } from './general';

interface Doc {
  id: Id;
  name: Name;
  code: Code;
  mdate: Date;
  cdate: Date;
}

type CreateDocPayload = Pick<Doc, 'name' | 'code'>;

type UpdateDocPayload = Pick<Doc, 'name' | 'code' | 'id'>;

type DeleteDocPayload = Pick<Doc, 'id'>;

type CreateDocDto = Doc;

type UpdateDocDto = Doc;

type DeleteDocDto = Pick<Doc, 'id'>;

export type {
  Doc,
  CreateDocPayload,
  UpdateDocPayload,
  CreateDocDto,
  UpdateDocDto,
  DeleteDocPayload,
  DeleteDocDto,
};
