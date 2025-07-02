import { docStoreActions } from "store/doc/doc.store";
import { docsStoreActions } from "store/docs/docs.store";
import { docManagementStoreActions } from "store/doc-management/doc-management.store";
import { getAPI, setCache } from "api-4markdown";
import type { API4MarkdownContractKey } from "api-4markdown-contracts";

const reloadYourDocuments = async (): Promise<void> => {
	try {
		const key: API4MarkdownContractKey = `getYourDocuments`;
		docsStoreActions.idle();
		docManagementStoreActions.idle();
		docsStoreActions.busy();

		const documents = await getAPI().call(key)();

		setCache(key, documents);

		docsStoreActions.ok(documents);
		docStoreActions.reset();
	} catch (error: unknown) {
		docsStoreActions.fail(error);
	}
};

export { reloadYourDocuments };
