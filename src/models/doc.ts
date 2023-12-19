import type { Id } from './general';

interface Doc {
  id: Id;
  name: string;
  code: string;
  mdate: string;
  cdate: string;
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
