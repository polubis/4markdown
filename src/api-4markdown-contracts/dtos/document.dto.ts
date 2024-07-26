import type {
  Id,
  Name,
  Date,
  MarkdownCode,
  Description,
  Tags,
  Path,
} from '../atoms';
import type { UserProfileDto } from './user-profile.dto';

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
  author: UserProfileDto;
};

type PermanentDocumentDto = Base & {
  visibility: `permanent`;
  description: Description;
  path: Path;
  tags: Tags;
  author: UserProfileDto;
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
