import { useMetadataState } from '.';
import type { MetadataState } from './models';

const setDocumentCodeAction = (
  documentCode: MetadataState['documentCode'],
): void => {
  useMetadataState.set({
    documentCode,
  });
};

export { setDocumentCodeAction };
