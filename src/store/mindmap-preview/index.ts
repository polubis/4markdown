import { state } from 'development-kit/state';
import type { MindmapPreviewState } from './models';

const useMindmapPreviewState = state<MindmapPreviewState>({ is: `idle` });

export { useMindmapPreviewState };
