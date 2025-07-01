import { state } from "development-kit/state";
import type { MindmapPreviewState } from "./models";

const useMindmapPreviewState = state<MindmapPreviewState>({
	mindmap: { is: `idle` },
	nodePreview: { is: `off` },
});

export { useMindmapPreviewState };
