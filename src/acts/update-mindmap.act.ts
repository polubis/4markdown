import { getAPI, parseError, setCache } from "api-4markdown";
import type { API4MarkdownPayload } from "api-4markdown-contracts";
import { useMindmapCreatorState } from "store/mindmap-creator";
import {
	readyMindmapsSelector,
	safeActiveMindmapSelector,
} from "store/mindmap-creator/selectors";

const updateMindmapAct = async (
	payload: Pick<
		API4MarkdownPayload<`updateMindmap`>,
		"name" | "description" | "tags"
	>,
): Promise<void> => {
	try {
		useMindmapCreatorState.set({ operation: { is: `busy` } });

		const mindmapCreatorState = useMindmapCreatorState.get();
		const yourMindmaps = readyMindmapsSelector(mindmapCreatorState.mindmaps);
		const activeMindmap = safeActiveMindmapSelector(mindmapCreatorState);

		const response = await getAPI().call(`updateMindmap`)({
			...payload,
			mdate: activeMindmap.mdate,
			id: activeMindmap.id,
		});

		const newMindmaps = yourMindmaps.data.map((mindmap) =>
			mindmap.id === activeMindmap.id
				? {
						...mindmap,
						...response,
					}
				: mindmap,
		);

		useMindmapCreatorState.set({
			mindmapForm: { is: `closed` },
			mindmaps: {
				is: `ok`,
				data: newMindmaps,
			},
			operation: { is: `ok` },
		});

		setCache(`getYourMindmaps`, {
			mindmaps: newMindmaps,
			mindmapsCount: newMindmaps.length,
		});
	} catch (error: unknown) {
		useMindmapCreatorState.set({
			operation: { is: `fail`, error: parseError(error) },
		});
	}
};

export { updateMindmapAct };
