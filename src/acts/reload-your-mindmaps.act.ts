import { getAPI, parseError, setCache } from "api-4markdown";
import type { API4MarkdownContractKey } from "api-4markdown-contracts";
import { useMindmapCreatorState } from "store/mindmap-creator";

const reloadYourMindmapsAct = async (): Promise<void> => {
	try {
		const key: API4MarkdownContractKey = `getYourMindmaps`;

		useMindmapCreatorState.set({
			mindmaps: { is: `idle` },
			activeMindmapId: null,
			operation: { is: `idle` },
		});

		useMindmapCreatorState.set({
			mindmaps: { is: `busy` },
		});

		const response = await getAPI().call(key)();

		setCache(key, response);

		useMindmapCreatorState.set({
			mindmaps: { is: `ok`, data: response.mindmaps },
		});
	} catch (error: unknown) {
		useMindmapCreatorState.set({
			mindmaps: { is: `fail`, error: parseError(error) },
		});
	}
};

export { reloadYourMindmapsAct };
