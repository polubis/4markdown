import { state } from 'development-kit/state';
import type { MindmapCreatorState } from './models';

const useMindmapCreatorState = state<MindmapCreatorState>({
  is: `unset`,
});

export { useMindmapCreatorState };
