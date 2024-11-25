import React from 'react';
import ErrorModal from 'components/error-modal';
import { Button } from 'design-system/button';
import { useDocumentsCreatorState } from 'store/documents-creator';
import { actReloadYourDocuments } from 'store/documents-creator/acts';
import { resetError } from 'store/documents-creator/actions';

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
            onClick={actReloadYourDocuments}
          >
            Sync
          </Button>
        )
      }
      onClose={resetError}
    />
  );
};

export { CreatorErrorModalContainer };
