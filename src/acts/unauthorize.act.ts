import { unauthorize } from 'store/auth/actions';
import { asIdle } from 'store/documents-creator/actions';
import { yourProfileStoreActions } from 'store/your-profile/your-profile.store';

const unauthorizeAct = (): void => {
  asIdle();
  yourProfileStoreActions.idle();
  unauthorize();
};

export { unauthorizeAct };
