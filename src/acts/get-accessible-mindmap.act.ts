import { getAPI, parseError } from "api-4markdown";
import { useMindmapPreviewState } from "store/mindmap-preview";
import { Atoms } from "api-4markdown-contracts";

const getAccessibleMindmapAct = async (): Promise<void> => {
  try {
    const { mindmap } = useMindmapPreviewState.get();

    if (mindmap.is === `busy`) return;

    useMindmapPreviewState.set({
      mindmap: { is: `busy` },
      nodePreview: { is: `off` },
    });

    const params = new URLSearchParams(window.location.search);
    const mindmapId = params.get(`mindmapId`);

    if (!mindmapId) {
      useMindmapPreviewState.set({
        mindmap: {
          is: `fail`,
          error: {
            symbol: `bad-request`,
            content: `Mindmap ID is required`,
            message: `Mindmap ID is required`,
          },
        },
      });
      return;
    }

    const data = await getAPI().call(`getAccessibleMindmap`)({
      mindmapId: mindmapId as Atoms["MindmapId"],
    });

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

export { getAccessibleMindmapAct };
