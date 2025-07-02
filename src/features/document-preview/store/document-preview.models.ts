import type {
	PermanentDocumentDto,
	PublicDocumentDto,
} from "api-4markdown-contracts";
import type { Transaction } from "development-kit/utility-types";

type DocumentPreviewStoreState = Transaction<{
	document: PublicDocumentDto | PermanentDocumentDto;
}>;

export type { DocumentPreviewStoreState };
