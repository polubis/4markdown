import type {
  Id,
  Name,
  DateStamp,
  MarkdownCode,
  Description,
  Tags,
  Path,
} from "../atoms";
import type { RatingDto } from "./rating.dto";
import type { UserProfileDto } from "./user-profile.dto";

type Base = {
  id: Id;
  name: Name;
  code: MarkdownCode;
  mdate: DateStamp;
  cdate: DateStamp;
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

type DocumentDto =
  | PrivateDocumentDto
  | PublicDocumentDto
  | PermanentDocumentDto;

export type {
  PrivateDocumentDto,
  PublicDocumentDto,
  PermanentDocumentDto,
  DocumentDto,
};
