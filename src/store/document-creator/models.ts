import type { DocumentDto } from "api-4markdown-contracts";

type DocumentCreatorState = {
	initialCode: DocumentDto["code"];
	code: DocumentDto["code"];
	changed: boolean;
};

export type { DocumentCreatorState };
