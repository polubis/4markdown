import type {
  Id,
  Name,
  Date,
  MarkdownCode,
  Description,
  Tags,
  Path,
  AccessGroupId,
} from "../atoms";
import { RatingDto, UserProfileDto } from "../dtos-2";

type Base = {
  id: Id;
  name: Name;
  code: MarkdownCode;
  mdate: Date;
  cdate: Date;
  sharedForGroups?: AccessGroupId[];
  path: Path;
};
// @TODO[PRIO=2]: [Re-design contracts to be atomic, instead of creating huge shared objects...].
type PrivateDocumentDto = Base & {
  visibility: "private";
};

type PublicDocumentDto = Base & {
  visibility: "public";
  author: UserProfileDto | null;
  rating: RatingDto;
};

type PermanentDocumentDto = Base & {
  visibility: `permanent`;
  description: Description;
  tags: Tags;
  author: UserProfileDto | null;
  rating: RatingDto;
};

type ManualDocumentDto = Base & {
  visibility: "manual";
  author: UserProfileDto | null;
  rating: RatingDto;
};

type DocumentDto =
  | PrivateDocumentDto
  | PublicDocumentDto
  | PermanentDocumentDto
  | ManualDocumentDto;

export type {
  PrivateDocumentDto,
  PublicDocumentDto,
  PermanentDocumentDto,
  DocumentDto,
  ManualDocumentDto,
};
