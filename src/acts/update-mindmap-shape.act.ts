import { getAPI, parseError } from 'api-4markdown';
import { type AsyncResult } from 'development-kit/utility-types';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import {
  readyMindmapsSelector,
  safeActiveMindmapSelector,
} from 'store/mindmap-creator/selectors';

const updateMindmapShapeAct = async (): AsyncResult => {
  try {
    useMindmapCreatorState.set({ operation: { is: `busy` } });

    const mindmapCreatorState = useMindmapCreatorState.get();

    const activeMindmap = safeActiveMindmapSelector(mindmapCreatorState);
    const yourMindmaps = readyMindmapsSelector(mindmapCreatorState.mindmaps);

    const updatedMindmap = await getAPI().call(`updateMindmapShape`)({
      mdate: activeMindmap.mdate,
      id: activeMindmap.id,
      nodes: mindmapCreatorState.nodes,
      edges: mindmapCreatorState.edges,
      orientation: mindmapCreatorState.orientation,
    });

    useMindmapCreatorState.set({
      changed: false,
      mindmaps: {
        is: `ok`,
        data: yourMindmaps.data.map((mindmap) =>
          mindmap.id === activeMindmap.id ? updatedMindmap : mindmap,
        ),
      },
      operation: { is: `ok` },
    });

    return { is: `ok` };
  } catch (error: unknown) {
    const err = parseError(error);
    useMindmapCreatorState.set({ operation: { is: `fail`, error: err } });
    return { is: `fail`, error: err };
  }
};

export { updateMindmapShapeAct };
