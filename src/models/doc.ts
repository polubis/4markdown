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

type CreateDocDto = Doc;

type UpdateDocDto = Doc;

export type {
  Doc,
  CreateDocPayload,
  UpdateDocPayload,
  CreateDocDto,
  UpdateDocDto,
};
