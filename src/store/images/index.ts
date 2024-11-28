import { state } from 'development-kit/state';
import type { ImagesState } from './models';

const useImagesState = state<ImagesState>({ is: `idle` });

export { useImagesState };
