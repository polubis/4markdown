import { create } from 'zustand';
import type { ImagesState } from './models';

const useImagesState = create<ImagesState>(() => ({
  is: `idle`,
}));

export { useImagesState };
