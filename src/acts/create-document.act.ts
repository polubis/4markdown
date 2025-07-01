import { getAPI, parseError, setCache } from "api-4markdown";
import type { API4MarkdownPayload } from "api-4markdown-contracts";
import type { AsyncResult } from "development-kit/utility-types";
import { docStoreActions } from "store/doc/doc.store";
import { docManagementStoreActions } from "store/doc-management/doc-management.store";
import { docsStoreActions, docsStoreSelectors } from "store/docs/docs.store";
import { useDocumentCreatorState } from "store/document-creator";
import { markAsUnchangedAction } from "store/document-creator/actions";

const createDocumentAct = async (
	payload: Pick<API4MarkdownPayload<"createDocument">, "name">,
): AsyncResult => {
	const { code } = useDocumentCreatorState.get();

	try {
		docManagementStoreActions.busy();
		const createdDocument = await getAPI().call(`createDocument`)({
			...payload,
			code,
		});
		docManagementStoreActions.ok();
		docStoreActions.setActive(createdDocument);
		docsStoreActions.addDoc(createdDocument);
		markAsUnchangedAction();

		setCache(`getYourDocuments`, docsStoreSelectors.ok().docs);

		return { is: `ok` };
	} catch (error: unknown) {
		docManagementStoreActions.fail(error);

		return { is: `fail`, error: parseError(error) };
	}
};

export { createDocumentAct };
