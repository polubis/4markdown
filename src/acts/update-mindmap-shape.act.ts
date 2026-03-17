import { getAPI, parseError, setCache } from "api-4markdown";
import type { Atoms } from "api-4markdown-contracts";
import { type AsyncResult } from "development-kit/utility-types";
import { useMindmapCreatorState } from "store/mindmap-creator";
import {
  readyMindmapsSelector,
  safeActiveMindmapSelector,
} from "store/mindmap-creator/selectors";
import { addOrBumpEntryAction } from "modules/previous-work";

const updateMindmapShapeAct = async (): AsyncResult => {
  try {
    useMindmapCreatorState.set({ operation: { is: `busy` } });

    const mindmapCreatorState = useMindmapCreatorState.get();

    const activeMindmap = safeActiveMindmapSelector(mindmapCreatorState);
    const yourMindmaps = readyMindmapsSelector(mindmapCreatorState.mindmaps);

    const response = await getAPI().call(`updateMindmapShape`)({
      mdate: activeMindmap.mdate,
      id: activeMindmap.id,
      nodes: mindmapCreatorState.nodes,
      edges: mindmapCreatorState.edges,
      orientation: mindmapCreatorState.orientation,
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
      changesCount: 0,
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

    addOrBumpEntryAction({
      type: `mindmap`,
      resourceId: activeMindmap.id as Atoms["MindmapId"],
      title: activeMindmap.name,
      lastTouched: Date.now(),
    });

    return { is: `ok` };
  } catch (error: unknown) {
    const err = parseError(error);
    useMindmapCreatorState.set({ operation: { is: `fail`, error: err } });
    return { is: `fail`, error: err };
  }
};

export { updateMindmapShapeAct };
