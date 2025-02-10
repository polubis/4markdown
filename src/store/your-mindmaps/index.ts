import { state } from 'development-kit/state';
import type { YourMindmapsState } from './models';

const useYourMindmapsState = state<YourMindmapsState>({
  is: `idle`,
});

export { useYourMindmapsState };
