import { getAPI, parseError } from 'api-4markdown';
import { type AsyncResult } from 'development-kit/utility-types';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { mindmapReadySelector } from 'store/mindmap-creator/selectors';

const updateMindmapShapeAct = async (): AsyncResult => {
  try {
    const { activeMindmap } = mindmapReadySelector(
      useMindmapCreatorState.get(),
    );

    const response = await getAPI().call(`updateMindmapShape`)({
      id: activeMindmap.id,
      mdate: activeMindmap.mdate,
      nodes: activeMindmap.nodes,
      edges: activeMindmap.edges,
    });

    useMindmapCreatorState.set({
      activeMindmap: {
        ...activeMindmap,
        mdate: response.mdate,
      },
    });

    return { is: `ok` };
  } catch (error: unknown) {
    return { is: `fail`, error: parseError(error) };
  }
};

export { updateMindmapShapeAct };
