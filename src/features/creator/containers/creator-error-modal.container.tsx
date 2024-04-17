import ErrorModal from 'components/error-modal';
import { Button } from 'design-system/button';
import React from 'react';
import { authStoreSelectors } from 'store/auth/auth.store';
import {
  docManagementStoreActions,
  docManagementStoreSelectors,
} from 'store/doc-management/doc-management.store';

const parseMessage = (message: string): { symbol: string; message: string } => {
  const match = message.match(/\[(.*?)\]/g);

  if (Array.isArray(match) && match.length === 2) {
    return {
      symbol: match[0].replace(/[[\]]/g, ``),
      message: match[1].replace(/[[\]]/g, ``),
    };
  }

  return {
    symbol: `unknown`,
    message,
  };
};

const CreatorErrorModalContainer = () => {
  const docManagementStore = docManagementStoreSelectors.useFail();
  const authStore = authStoreSelectors.useAuthorized();
  const parsed = parseMessage(docManagementStore.error);

  return (
    <ErrorModal
      heading="Ups, something went wrong"
      message={parsed.message}
      footer={
        parsed.symbol === `outOfDateEntry` && (
          <Button
            type="button"
            i={2}
            s={2}
            auto
            title="Sync out of date document"
            onClick={authStore.resyncDocuments}
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
