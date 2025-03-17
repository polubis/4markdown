import { getAPI, parseError } from 'api-4markdown';
import { useMindmapPreviewState } from 'store/mindmap-preview';

const getMindmapAct = async (): Promise<void> => {
  try {
    const mindmap = useMindmapPreviewState.get();

    if (mindmap.is === `busy`) return;

    useMindmapPreviewState.set({ is: `busy` });

    const params = new URLSearchParams(window.location.search);
    const mindmapId = params.get(`mindmapId`);
    const authorId = params.get(`authorId`);

    if (!mindmapId || !authorId) {
      useMindmapPreviewState.set({
        is: `fail`,
        error: {
          symbol: `bad-request`,
          content: `Mindmap ID and author ID are required`,
          message: `Mindmap ID and author ID are required`,
        },
      });
      return;
    }

    const data = await getAPI().call(`getMindmap`)({ mindmapId, authorId });

    useMindmapPreviewState.set({
      is: `ok`,
      mindmap: data,
    });
  } catch (error: unknown) {
    useMindmapPreviewState.set({ is: `fail`, error: parseError(error) });
  }
};

export { getMindmapAct };
