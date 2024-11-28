import { create } from 'zustand';
import type { ImagesState } from './models';

const useImagesState = create<ImagesState>(() => ({
  is: `idle`,
}));

const replaceImagesState = (state: ImagesState): void => {
  useImagesState.setState(state, true);
};

export { useImagesState, replaceImagesState };
