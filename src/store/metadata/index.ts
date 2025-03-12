import { state } from 'development-kit/state';
import type { MetadataState } from './models';

const useMetadataState = state<MetadataState>({
  documentCode: null,
});

export { useMetadataState };
