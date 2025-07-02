import { state } from "development-kit/state";
import type { DocumentGenerationState } from "./models";
import { Subject } from "rxjs";
import type { API4MarkdownPayload } from "api-4markdown-contracts";
import type { SUID } from "development-kit/suid";

const useDocumentGenerationState = state<DocumentGenerationState>({
	conversations: [],
});

const documentGenerationSubject = new Subject<{
	payload: API4MarkdownPayload<`createContentWithAI`>;
	conversationId: SUID;
}>();

const documentGenerationCancelSubject = new Subject<SUID>();

export {
	useDocumentGenerationState,
	documentGenerationSubject,
	documentGenerationCancelSubject,
};
