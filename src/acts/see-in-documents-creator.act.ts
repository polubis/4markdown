import { creatorStoreActions } from 'store/creator/creator.store';
import { docStoreActions } from 'store/doc/doc.store';

const seeInDocumentsCreatorAct = (code: string): void => {
  docStoreActions.reset();
  creatorStoreActions.asUnchanged();
  creatorStoreActions.changeWithoutMarkAsUnchanged(code);
};

export { seeInDocumentsCreatorAct };
