import { state } from 'development-kit/state';
import type { YourProfileState } from './models';

const useYourProfileState = state<YourProfileState>({
  is: `idle`,
});

export { useYourProfileState };
