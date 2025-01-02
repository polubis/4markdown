import type {
  Id,
  Name,
  Date,
  MarkdownCode,
  Description,
  Tags,
  Path,
} from '../atoms';
import type { RatingDto } from './rating.dto';
import type { UserProfileDto } from './user-profile.dto';

type Base = {
  id: Id;
  name: Name;
  code: MarkdownCode;
  mdate: Date;
  cdate: Date;
  path: Path;
};
// @TODO[PRIO=2]: [Re-design contracts to be atomic, instead of creating huge shared objects...].
type PrivateDocumentDto = Base & {
  visibility: 'private';
};

type PublicDocumentDto = Base & {
  visibility: 'public';
  authorId: Id;
  author: UserProfileDto | null;
  rating: RatingDto;
};

type PermanentDocumentDto = Base & {
  visibility: `permanent`;
  authorId: Id;
  description: Description;
  tags: Tags;
  author: UserProfileDto | null;
  rating: RatingDto;
};

type AccessibleDocumentDto = PublicDocumentDto | PermanentDocumentDto;

type DocumentDto = PrivateDocumentDto | AccessibleDocumentDto;

export type {
  PrivateDocumentDto,
  PublicDocumentDto,
  PermanentDocumentDto,
  DocumentDto,
  AccessibleDocumentDto,
};
