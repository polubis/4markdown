import { useImagesState } from '.';
import type { ImagesState } from './models';

const replaceImagesState = (state: ImagesState): void => {
  useImagesState.setState(state);
};

export { replaceImagesState };
