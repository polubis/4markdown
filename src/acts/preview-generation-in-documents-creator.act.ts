import type { SUID } from "development-kit/suid";
import { useDocumentGenerationState } from "store/document-generation";
import { seeInDocumentsCreatorAct } from "./see-in-documents-creator.act";
import { toggleConversationAction } from "store/document-generation/actions";

const previewGenerationInDocumentsCreatorAct = (conversationId: SUID): void => {
	const conversation = useDocumentGenerationState
		.get()
		.conversations.find((conversation) => conversation.id === conversationId);

	if (!conversation) {
		throw Error(`No conversation found`);
	}

	const record = [...conversation.history]
		.reverse()
		.find((record) => record.type === `assistant`);

	if (!record) {
		throw Error(`No assistant reply found`);
	}

	toggleConversationAction(conversationId);
	seeInDocumentsCreatorAct({ code: record.body.output });
};

export { previewGenerationInDocumentsCreatorAct };
