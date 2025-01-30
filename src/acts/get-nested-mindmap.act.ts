import type { Mindmap } from 'api-4markdown-contracts';
import { mock } from 'development-kit/mock';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { mindmapReadySelector } from 'store/mindmap-creator/selectors';

const getNestedMindmapAct = async (id: Mindmap['id']): Promise<void> => {
  const { pendingMindmaps } = mindmapReadySelector(
    useMindmapCreatorState.get(),
  );

  try {
    useMindmapCreatorState.set({
      pendingMindmaps: { ...pendingMindmaps, [id]: true },
    });

    await mock({ delay: 1500 })({})({});

    const newPendingMindmaps = { ...pendingMindmaps };

    delete newPendingMindmaps[id];

    useMindmapCreatorState.set({
      pendingMindmaps: newPendingMindmaps,
    });
  } catch (error: unknown) {
    const newPendingMindmaps = { ...pendingMindmaps };

    delete newPendingMindmaps[id];

    useMindmapCreatorState.set({
      pendingMindmaps: newPendingMindmaps,
    });
  }
};

export { getNestedMindmapAct };
