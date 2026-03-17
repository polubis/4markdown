import { getAPI, parseError, setCache } from "api-4markdown";
import type {
  API4MarkdownPayload,
  Atoms,
  MindmapDto,
} from "api-4markdown-contracts";
import { useMindmapCreatorState } from "store/mindmap-creator";
import { readyMindmapsSelector } from "store/mindmap-creator/selectors";
import { addOrBumpEntryAction } from "modules/previous-work";

const buildDefaultName = (): API4MarkdownPayload<`createMindmap`>[`name`] => {
  const today = new Date();
  const isoDate = today.toISOString().slice(0, 10);

  return `new-${isoDate}`;
};

const createEmptyMindmapAct = async (): Promise<MindmapDto | null> => {
  try {
    useMindmapCreatorState.set({ operation: { is: `busy` } });

    const { mindmaps, orientation } = useMindmapCreatorState.get();

    const safeMindmaps = readyMindmapsSelector(mindmaps);

    const mindmap = await getAPI().call(`createMindmap`)({
      name: buildDefaultName(),
      description: null,
      tags: null,
      nodes: [],
      edges: [],
      orientation,
    });

    const newMindmaps = [mindmap, ...safeMindmaps.data];

    useMindmapCreatorState.set({
      mindmapForm: { is: `closed` },
      activeMindmapId: mindmap.id,
      nodes: mindmap.nodes,
      edges: mindmap.edges,
      orientation: mindmap.orientation,
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

    addOrBumpEntryAction({
      type: `mindmap`,
      resourceId: mindmap.id as Atoms["MindmapId"],
      title: mindmap.name,
      lastTouched: Date.now(),
    });
    return mindmap;
  } catch (error: unknown) {
    useMindmapCreatorState.set({
      operation: { is: `fail`, error: parseError(error) },
    });
    return null;
  }
};

export { createEmptyMindmapAct };
