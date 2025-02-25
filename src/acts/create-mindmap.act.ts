import { getAPI, parseError } from 'api-4markdown';
import type { API4MarkdownPayload, MindmapDto } from 'api-4markdown-contracts';
import { type AsyncResult } from 'development-kit/utility-types';
import { useMindmapCreatorState } from 'store/mindmap-creator';

const createMindmapAct = async (
  payload: Pick<
    API4MarkdownPayload<`createMindmap`>,
    'description' | 'name' | 'tags'
  >,
): AsyncResult<MindmapDto> => {
  try {
    const { nodes, edges, orientation, mindmaps } =
      useMindmapCreatorState.get();

    const mindmap = await getAPI().call(`createMindmap`)({
      ...payload,
      nodes,
      edges,
      orientation,
    });

    useMindmapCreatorState.set({
      mindmapForm: { is: `closed` },
      activeMindmap: mindmap.id,
      mindmaps: [mindmap, ...mindmaps],
    });

    return { is: `ok`, data: mindmap };
  } catch (error: unknown) {
    return { is: `fail`, error: parseError(error) };
  }
};

export { createMindmapAct };
