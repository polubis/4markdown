import type {
  Id,
  Name,
  Date,
  MarkdownCode,
  Description,
  Tags,
  Path,
} from '../atoms';
import { UserProfileDto } from './user-profile.dto';

type Author = UserProfileDto | null;

type Base = {
  id: Id;
  name: Name;
  code: MarkdownCode;
  mdate: Date;
  cdate: Date;
};

type PrivateDocumentDto = Base & {
  visibility: 'private';
};

type PublicDocumentDto = Base & {
  visibility: 'public';
  author: Author;
};

type PermanentDocumentDto = Base & {
  visibility: `permanent`;
  description: Description;
  path: Path;
  tags: Tags;
  author: Author;
};

type DocumentDto =
  | PrivateDocumentDto
  | PublicDocumentDto
  | PermanentDocumentDto;

export {
  PrivateDocumentDto,
  PublicDocumentDto,
  PermanentDocumentDto,
  DocumentDto,
};
