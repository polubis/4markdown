import { downloadMindmapAsFolder } from "development-kit/mindmap-folder-export";
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

const downloadMindmapAction = async (): Promise<void> => {
  const mindmap = readyMindmapPreviewSelector(get().mindmap);

  await downloadMindmapAsFolder({
    name: mindmap.name,
    orientation: mindmap.orientation,
    nodes: mindmap.nodes,
    edges: mindmap.edges,
  });
};

export { closeNodePreviewAction, openNodePreviewAction, downloadMindmapAction };
