import { useMindmapCreatorState } from 'store/mindmap-creator';
import { getYourMindmapsAct } from './get-your-mindmaps.act';

const reloadYourMindmapsAct = async (): Promise<void> => {
  useMindmapCreatorState.set({ mindmaps: { is: `idle` } });
  return getYourMindmapsAct();
};

export { reloadYourMindmapsAct };
