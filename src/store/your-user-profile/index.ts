import { state } from 'development-kit/state';
import type { YourUserProfileState } from './models';

const useYourUserProfileState = state<YourUserProfileState>({
  is: `idle`,
});

export { useYourUserProfileState };
