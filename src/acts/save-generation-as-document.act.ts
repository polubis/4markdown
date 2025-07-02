import type { SUID } from "development-kit/suid";
import { useDocumentGenerationState } from "store/document-generation";
import { getAPI, setCache } from "api-4markdown";
import { docManagementStoreActions } from "store/doc-management/doc-management.store";
import { docStoreActions } from "store/doc/doc.store";
import { docsStoreSelectors, docsStoreActions } from "store/docs/docs.store";
import { markAsUnchangedAction } from "store/document-creator/actions";
import { closeConversationAction } from "store/document-generation/actions";

const saveGenerationAsDocumentAct = async (
	conversationId: SUID,
): Promise<void> => {
	try {
		docManagementStoreActions.busy();

		const conversation = useDocumentGenerationState
			.get()
			.conversations.find((conversation) => conversation.id === conversationId);

		if (!conversation) {
			docManagementStoreActions.fail(
				new Error(
					JSON.stringify({
						symbol: `client-error`,
						content: `No conversation found`,
						message: `No conversation found`,
					}),
				),
			);
			return;
		}

		const record = [...conversation.history].slice(-1)[0];

		if (record.type !== `assistant`) {
			docManagementStoreActions.fail(
				new Error(
					JSON.stringify({
						symbol: `client-error`,
						content: `No assistant reply found`,
						message: `No assistant reply found`,
					}),
				),
			);
			return;
		}

		const code = record.body.output;

		const payload = [...conversation.history]
			.reverse()
			.find((record) => record.type === `user`)?.payload;

		if (!payload) {
			docManagementStoreActions.fail(
				new Error(
					JSON.stringify({
						symbol: `client-error`,
						content: `Cannot find payload for conversation ${conversationId}`,
						message: `Cannot find payload for conversation ${conversationId}`,
					}),
				),
			);
			return;
		}

		const createdDocument = await getAPI().call(`createDocument`)({
			name: payload.name,
			code,
		});

		docManagementStoreActions.ok();
		docStoreActions.setActive(createdDocument);
		docsStoreActions.addDoc(createdDocument);
		markAsUnchangedAction();

		setCache(`getYourDocuments`, docsStoreSelectors.ok().docs);

		closeConversationAction(conversationId);
	} catch (error: unknown) {
		docManagementStoreActions.fail(error);
	}
};

export { saveGenerationAsDocumentAct };
