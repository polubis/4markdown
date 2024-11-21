import React from 'react';
import ErrorModal from 'components/error-modal';
import { Button } from 'design-system/button';
import {
  docManagementStoreActions,
  docManagementStoreSelectors,
} from 'store/doc-management/doc-management.store';
import { reloadYourDocuments } from 'store/creator/reload-your-documents.action';

const CreatorErrorModalContainer = () => {
  const docManagementStore = docManagementStoreSelectors.useFail();

  return (
    <ErrorModal
      heading="Ups, something went wrong"
      message={docManagementStore.error.message}
      footer={
        docManagementStore.error.symbol === `out-of-date` && (
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

export default CreatorErrorModalContainer;
