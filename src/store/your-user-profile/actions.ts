import type { AsyncResult } from 'development-kit/utility-types';
import { useYourUserProfileState } from '.';
import { parseError } from 'api-4markdown';
import type { YourUserProfileState } from './models';

const { setState: set } = useYourUserProfileState;

const asBusy = (): void => {
  set({ busy: true, error: null, profile: null });
};

const asOk = (
  profile: YourUserProfileState['profile'],
): Extract<Awaited<AsyncResult>, { is: `ok` }> => {
  set({ busy: false, profile });
  return { is: `ok` };
};

const asFail = (
  rawError: unknown,
): Extract<Awaited<AsyncResult>, { is: `fail` }> => {
  const error = parseError(rawError);

  set({ busy: false, error });

  return { is: `fail`, error };
};

export { asBusy, asFail, asOk };
