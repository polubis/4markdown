import type { DocumentDto } from 'api-4markdown-contracts';
import { creatorStoreActions } from 'store/creator/creator.store';
import { docStoreActions } from 'store/doc/doc.store';

const seeInDocumentsCreatorAct = ({
  code,
}: Pick<DocumentDto, 'code'>): void => {
  docStoreActions.reset();
  creatorStoreActions.asUnchanged();
  creatorStoreActions.changeWithoutMarkAsUnchanged(code);
};

export { seeInDocumentsCreatorAct };
