import type {
  Id,
  Name,
  Code,
  Date,
  Path,
  Tags,
  ImageNode,
  Base64,
} from './general';
import type { UserAvatarVariantObj, UserProfile } from './user';

interface DocBase {
  id: Id;
  name: Name;
  code: Code;
  mdate: Date;
  cdate: Date;
}

type DocAuthor = UserProfile | null;

type DocThumbnailAction =
  | { type: `noop` }
  | { type: `remove` }
  | { type: `update`; data: Base64 };

type DocThumbnail =
  | (Record<'xl' | 'lg' | 'md' | 'sm' | 'tn', ImageNode> & {
      placeholder: Path;
    })
  | null;

interface PrivateDoc extends DocBase {
  visibility: 'private';
}

interface PublicDoc extends DocBase {
  visibility: 'public';
  author: DocAuthor;
}

interface PermanentDoc extends DocBase {
  visibility: `permanent`;
  description: string;
  path: Path;
  tags: Tags;
  author: DocAuthor;
  thumbnail: DocThumbnail;
}

type PermamentSlimDoc = Omit<
  PermanentDoc,
  'visibility' | 'code' | 'author' | 'thumbnail'
> & {
  author: {
    displayName: NonNullable<UserProfile['displayName']>;
    avatar: UserAvatarVariantObj | null;
  } | null;
};

type Doc = PrivateDoc | PublicDoc | PermanentDoc;

type CreateDocPayload = Pick<Doc, 'name' | 'code'>;

type UpdateDocPrivatePayload = Omit<PrivateDoc, 'cdate'>;
type UpdateDocPublicPayload = Omit<PublicDoc, 'cdate' | 'author'>;
type UpdateDocPermanentPayload = Omit<
  PermanentDoc,
  'cdate' | 'path' | 'author' | 'thumbnail'
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

type GetPermanentDocsDto = PermanentDoc[];

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
  GetPermanentDocsDto,
  DeleteDocDto,
  DocBase,
  PrivateDoc,
  PublicDoc,
  PermanentDoc,
  PermamentSlimDoc,
  DocAuthor,
  DocThumbnail,
  DocThumbnailAction,
};
