import { downloadJSON } from "development-kit/download-file";
import { downloadMindmapAsZip } from "development-kit/mindmap-bulk-download";
import { useMindmapPreviewState } from ".";
import type { MindmapPreviewEmbeddedNode } from "./models";
import { readyMindmapPreviewSelector } from "./selectors";

const { set, get } = useMindmapPreviewState;

const closeNodePreviewAction = (): void => {
  set({
    nodePreview: { is: `off` },
  });
};

const openNodePreviewAction = (data: MindmapPreviewEmbeddedNode): void => {
  set({
    nodePreview: { is: `on`, ...data },
  });
};

const downloadMindmapAction = (): void => {
  const mindmap = readyMindmapPreviewSelector(get().mindmap);

  const data = {
    edges: mindmap.edges,
    nodes: mindmap.nodes,
    orientation: mindmap.orientation,
  };

  downloadJSON({ data, name: `data` });
};

const downloadAllMindmapsAction = async (): Promise<void> => {
  try {
    const mindmap = readyMindmapPreviewSelector(get().mindmap);

    const mindmapData = {
      orientation: mindmap.orientation,
      nodes: mindmap.nodes,
      edges: mindmap.edges,
    };

    await downloadMindmapAsZip(
      mindmapData,
      mindmap.name || `mindmap_${mindmap.id}`,
    );
  } catch (error) {
    console.error("Error downloading mindmap as ZIP:", error);
    throw error;
  }
};

export {
  closeNodePreviewAction,
  openNodePreviewAction,
  downloadMindmapAction,
  downloadAllMindmapsAction,
};
