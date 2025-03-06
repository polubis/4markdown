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
    const activeMindmap = safeActiveMindmapSelector(
      useMindmapCreatorState.get(),
    );
    const yourMindmaps = readyMindmapsSelector(
      useMindmapCreatorState.get().mindmaps,
    );

    const updatedMindmap = await getAPI().call(`updateMindmapName`)({
      ...payload,
      mdate: activeMindmap.mdate,
    });

    useMindmapCreatorState.set({
      mindmaps: {
        is: `ok`,
        data: yourMindmaps.data.map((mindmap) =>
          mindmap.id === activeMindmap.id ? updatedMindmap : mindmap,
        ),
      },
    });

    return { is: `ok` };
  } catch (error: unknown) {
    return { is: `fail`, error: parseError(error) };
  }
};

export { updateMindmapNameAct };
