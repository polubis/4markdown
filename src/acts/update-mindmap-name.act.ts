import { getAPI, parseError } from 'api-4markdown';
import type { API4MarkdownPayload } from 'api-4markdown-contracts';
import { type AsyncResult } from 'development-kit/utility-types';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import {
  readyMindmapsSelector,
  safeActiveMindmapSelector,
} from 'store/mindmap-creator/selectors';

const updateMindmapNameAct = async (
  payload: Pick<API4MarkdownPayload<'updateMindmapName'>, 'name'>,
): AsyncResult => {
  try {
    useMindmapCreatorState.set({ operation: { is: `busy` } });

    const activeMindmap = safeActiveMindmapSelector(
      useMindmapCreatorState.get(),
    );
    const yourMindmaps = readyMindmapsSelector(
      useMindmapCreatorState.get().mindmaps,
    );

    const response = await getAPI().call(`updateMindmapName`)({
      name: payload.name,
      mdate: activeMindmap.mdate,
      id: activeMindmap.id,
    });

    useMindmapCreatorState.set({
      mindmaps: {
        is: `ok`,
        data: yourMindmaps.data.map((mindmap) =>
          mindmap.id === activeMindmap.id
            ? {
                ...mindmap,
                ...response,
              }
            : mindmap,
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

export { updateMindmapNameAct };
