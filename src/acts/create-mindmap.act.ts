import { getAPI, parseError, setCache } from 'api-4markdown';
import type { API4MarkdownPayload } from 'api-4markdown-contracts';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { readyMindmapsSelector } from 'store/mindmap-creator/selectors';

const createMindmapAct = async (
  payload: Pick<
    API4MarkdownPayload<`createMindmap`>,
    'description' | 'name' | 'tags'
  >,
): Promise<void> => {
  try {
    useMindmapCreatorState.set({ operation: { is: `busy` } });

    const { nodes, edges, orientation, mindmaps } =
      useMindmapCreatorState.get();

    const safeMindmaps = readyMindmapsSelector(mindmaps);

    const mindmap = await getAPI().call(`createMindmap`)({
      ...payload,
      nodes,
      edges,
      orientation,
    });

    const newMindmaps = [mindmap, ...safeMindmaps.data];

    useMindmapCreatorState.set({
      mindmapForm: { is: `closed` },
      activeMindmapId: mindmap.id,
      mindmaps: {
        is: `ok`,
        data: newMindmaps,
      },
      operation: { is: `ok` },
      changesCount: 0,
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

export { createMindmapAct };
