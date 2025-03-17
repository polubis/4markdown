import { getAPI, parseError } from 'api-4markdown';
import { useMindmapPreviewState } from 'store/mindmap-preview';

const getMindmapAct = async (): Promise<void> => {
  try {
    const { mindmap } = useMindmapPreviewState.get();

    if (mindmap.is === `busy`) return;

    useMindmapPreviewState.set({
      mindmap: { is: `busy` },
      nodePreview: { is: `off` },
    });

    const params = new URLSearchParams(window.location.search);
    const mindmapId = params.get(`mindmapId`);
    const authorId = params.get(`authorId`);

    if (!mindmapId || !authorId) {
      useMindmapPreviewState.set({
        mindmap: {
          is: `fail`,
          error: {
            symbol: `bad-request`,
            content: `Mindmap ID and author ID are required`,
            message: `Mindmap ID and author ID are required`,
          },
        },
      });
      return;
    }

    const data = await getAPI().call(`getMindmap`)({ mindmapId, authorId });

    useMindmapPreviewState.set({
      mindmap: {
        ...data,
        is: `ok`,
      },
    });
  } catch (error: unknown) {
    useMindmapPreviewState.set({
      mindmap: {
        is: `fail`,
        error: parseError(error),
      },
    });
  }
};

export { getMindmapAct };
