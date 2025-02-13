import { useYourMindmapsState } from 'store/your-mindmaps';
import { getYourMindmapsAct } from './get-your-mindmaps.act';
import { removeCache } from 'api-4markdown';
import { useMindmapCreatorState } from 'store/mindmap-creator';

const restartMindmapCreatorAct = async (): Promise<void> => {
  removeCache(`getYourMindmaps`);
  useYourMindmapsState.swap({ is: `idle` });
  useMindmapCreatorState.swap({ is: `unset` });
  getYourMindmapsAct();
};

export { restartMindmapCreatorAct };
