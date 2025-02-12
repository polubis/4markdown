import { useYourMindmapsState } from 'store/your-mindmaps';
import { getYourMindmapsAct } from './get-your-mindmaps.act';
import { removeCache } from 'api-4markdown';

const reloadYourMindmapsAct = async (): Promise<void> => {
  removeCache(`getYourMindmaps`);
  useYourMindmapsState.swap({ is: `idle` });
  getYourMindmapsAct();
};

export { reloadYourMindmapsAct };
