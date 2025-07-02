import { getAPI, getCache, setCache } from "api-4markdown";
import type { API4MarkdownContractKey } from "api-4markdown-contracts";
import { docsStoreActions, docsStoreSelectors } from "store/docs/docs.store";

const getYourDocuments = async (): Promise<void> => {
	try {
		const key: API4MarkdownContractKey = `getYourDocuments`;

		const { is } = docsStoreSelectors.state();

		if (is !== `idle`) return;

		const cachedDocuments = getCache(key);

		if (cachedDocuments !== null) {
			docsStoreActions.ok(cachedDocuments);
			return;
		}

		docsStoreActions.busy();

		const documents = await getAPI().call(key)();

		setCache(key, documents);

		docsStoreActions.ok(documents);
	} catch (error: unknown) {
		docsStoreActions.fail(error);
	}
};

export { getYourDocuments };
