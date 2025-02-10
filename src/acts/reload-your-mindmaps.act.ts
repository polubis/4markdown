import { useYourMindmapsState } from 'store/your-mindmaps';
import { getYourMindmapsAct } from './get-your-mindmaps.act';

const reloadYourMindmapsAct = async (): Promise<void> => {
  useYourMindmapsState.swap({ is: `idle` });
  getYourMindmapsAct();
};

export { reloadYourMindmapsAct };
