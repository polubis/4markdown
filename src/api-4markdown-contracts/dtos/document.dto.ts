import type {
	DateFormat,
	Description,
	Id,
	MarkdownCode,
	Name,
	Path,
	Tags,
} from "../atoms";
import type { DocumentRatingDto } from "./document-rating.dto";
import type { UserProfileDto } from "./user-profile.dto";

type Base = {
	id: Id;
	name: Name;
	code: MarkdownCode;
	mdate: DateFormat;
	cdate: DateFormat;
	path: Path;
};
// @TODO[PRIO=2]: [Re-design contracts to be atomic, instead of creating huge shared objects...].
type PrivateDocumentDto = Base & {
	visibility: "private";
};

type PublicDocumentDto = Base & {
	visibility: "public";
	author: UserProfileDto | null;
	rating: DocumentRatingDto;
};

type PermanentDocumentDto = Base & {
	visibility: `permanent`;
	description: Description;
	tags: Tags;
	author: UserProfileDto | null;
	rating: DocumentRatingDto;
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
