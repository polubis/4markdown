import { downloadJSON } from "development-kit/download-file";
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

export { closeNodePreviewAction, openNodePreviewAction, downloadMindmapAction };
