import type { ImagesState } from './models';
import { state } from 'development-kit/state';

const useImagesState = state<ImagesState>({ is: `idle` });

export { useImagesState };
