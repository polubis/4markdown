import type {
  Id,
  Name,
  Date,
  MarkdownCode,
  Description,
  Tags,
  Path,
  Base64,
} from '../atoms';
import type { DocumentRatingDto } from './document-rating.dto';
import type { UserProfileDto } from './user-profile.dto';

type Document = {
  id: Id;
  name: Name;
  code: MarkdownCode;
  mdate: Date;
  cdate: Date;
};

type Image = {
  h: number;
  w: number;
  src: string;
  type: string;
  format: string;
  aspectRatio: [number, number];
};

type DocumentThumbnailDto = {
  variants: {
    xl: Image;
    lg: Image;
    md: Image;
    sm: Image;
    tn: Image;
  };
  placeholder: Base64;
};

type PrivateDocumentDto = Document & {
  visibility: 'private';
};

type PublicDocumentDto = Document & {
  visibility: 'public';
  author: UserProfileDto | null;
  rating: DocumentRatingDto;
  thumbnail?: DocumentThumbnailDto;
};

type PermanentDocumentDto = Document & {
  visibility: `permanent`;
  description: Description;
  path: Path;
  tags: Tags;
  author: UserProfileDto | null;
  rating: DocumentRatingDto;
  thumbnail?: DocumentThumbnailDto;
};

type DocumentDto =
  | PrivateDocumentDto
  | PublicDocumentDto
  | PermanentDocumentDto;

export type {
  PrivateDocumentDto,
  PublicDocumentDto,
  PermanentDocumentDto,
  DocumentDto,
  DocumentThumbnailDto,
};
