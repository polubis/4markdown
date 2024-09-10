import ErrorModal from 'components/error-modal';
import { Button } from 'design-system/button';
import React from 'react';
import {
  mindmapCreatorStoreActions,
  mindmapCreatorStoreSelectors,
} from 'store/mindmap-creator/mindmap-creator.store';

const SaveErrorModalContainer = () => {
  const { error } = mindmapCreatorStoreSelectors.useSavingFail();

  return (
    <ErrorModal
      heading="Ups, cannot save changes"
      message={
        error.symbol === `invalid-schema`
          ? error.content[0].message
          : error.content
      }
      footer={
        error.symbol === `out-of-date` && (
          <Button
            type="button"
            i={2}
            s={2}
            auto
            title="Sync out of date document"
            onClick={mindmapCreatorStoreActions.reload}
          >
            Try Again
          </Button>
        )
      }
      onClose={mindmapCreatorStoreActions.resetSaving}
    />
  );
};

export { SaveErrorModalContainer };
