import { state } from 'development-kit/state';
import type { MindmapCreatorState } from './models';
import { defaultMindmap } from './config';

const useMindmapCreatorState = state<MindmapCreatorState>({
  activeMindmap: defaultMindmap,
});

export { useMindmapCreatorState };
