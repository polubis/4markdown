import type { MindmapPreviewState, MindmapPreviewOkMindmap } from "./models";

const readyMindmapPreviewSelector = (
  mindmap: MindmapPreviewState["mindmap"],
): MindmapPreviewOkMindmap => {
  if (mindmap.is === `ok`) return mindmap;

  throw Error(`Invalid reading attempt in mindmap preview state`);
};

export { readyMindmapPreviewSelector };
