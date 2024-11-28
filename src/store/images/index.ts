import { create } from 'zustand';
import type { ImagesState } from './models';

const useImagesState = create<ImagesState>(() => ({
  is: `idle`,
}));
const getImagesState = useImagesState.getState;
const setImagesState = useImagesState.setState;
const replaceImagesState = (state: ImagesState): void => {
  useImagesState.setState(state, true);
};

export { useImagesState, getImagesState, setImagesState, replaceImagesState };
