import { create } from 'zustand';
import type { YourUserProfileState } from './models';

const useYourUserProfileState = create<YourUserProfileState>(() => ({
  busy: false,
  error: null,
  profile: null,
}));

export { useYourUserProfileState };
