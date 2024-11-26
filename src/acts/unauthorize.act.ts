import { unauthorize } from 'store/auth/actions';
import { asIdle as asDocumentsCreatorIdle } from 'store/documents-creator/actions';
import { asIdle as asYourUserProfileIdle } from 'store/your-user-profile/actions';

const unauthorizeAct = (): void => {
  asDocumentsCreatorIdle();
  asYourUserProfileIdle();
  unauthorize();
};

export { unauthorizeAct };
