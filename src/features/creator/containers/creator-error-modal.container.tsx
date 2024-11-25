import React from 'react';
import ErrorModal from 'components/error-modal';
import { Button } from 'design-system/button';
import { docManagementStoreActions } from 'store/doc-management/doc-management.store';
import { reloadYourDocuments } from 'actions/reload-your-documents.action';
import { useDocumentsCreatorState } from '../../../store/documents-creator/documents-creator.store';

const CreatorErrorModalContainer = () => {
  const error = useDocumentsCreatorState((state) => state.error!);

  return (
    <ErrorModal
      heading="Ups, something went wrong"
      message={error.message}
      footer={
        error.symbol === `out-of-date` && (
          <Button
            type="button"
            i={2}
            s={2}
            auto
            title="Sync out of date document"
            onClick={reloadYourDocuments}
          >
            Sync
          </Button>
        )
      }
      onClose={docManagementStoreActions.idle}
    />
  );
};

export { CreatorErrorModalContainer };
