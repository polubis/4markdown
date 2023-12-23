import type { Id, Name, Code, Date } from './general';

interface Doc {
  id: Id;
  name: Name;
  code: Code;
  mdate: Date;
  cdate: Date;
  visiblity: 'private' | 'public';
}

type CreateDocPayload = Pick<Doc, 'name' | 'code'>;

type UpdateDocPayload = Pick<Doc, 'name' | 'code' | 'id' | 'visiblity'>;

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
