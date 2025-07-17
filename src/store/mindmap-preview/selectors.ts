import type { MindmapPreviewState, MindmapPreviewOkMindmap } from "./models";

const readyMindmapPreviewSelector = (
  mindmap: MindmapPreviewState["mindmap"],
): MindmapPreviewOkMindmap => {
  if (mindmap.is === `ok`) return mindmap;

  throw Error(`Invalid reading attempt in mindmap preview state`);
};

const onMindmapPreviewNodeSelector = (
  state: MindmapPreviewState,
): Extract<MindmapPreviewState["nodePreview"], { is: `on` }> => {
  if (state.nodePreview.is === `on`) return state.nodePreview;

  throw Error(`Invalid reading attempt in mindmap preview state`);
};

export { readyMindmapPreviewSelector, onMindmapPreviewNodeSelector };
