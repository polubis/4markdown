import ErrorModal from 'components/error-modal';
import { Button } from 'design-system/button';
import { parseErrorV2 } from 'development-kit/parse-error';
import React from 'react';
import { authStoreSelectors } from 'store/auth/auth.store';
import {
  docManagementStoreActions,
  docManagementStoreSelectors,
} from 'store/doc-management/doc-management.store';

const parseMessage = (message: string): { symbol: string; message: string } => {
  const parsedV2Error = parseErrorV2(message);

  if (parsedV2Error.symbol !== `unknown`) {
    return {
      symbol: parsedV2Error.symbol,
      message:
        typeof parsedV2Error.content === `string`
          ? parsedV2Error.content
          : JSON.stringify(parsedV2Error.content),
    };
  }

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
  const parsed = React.useMemo(() => {
    return parseMessage(docManagementStore.error);
  }, [docManagementStore.error]);

  return (
    <ErrorModal
      heading="Ups, something went wrong"
      message={parsed.message}
      footer={
        parsed.symbol === `outOfDateEntry` ||
        (parsed.symbol === `out-of-date` && (
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
        ))
      }
      onClose={docManagementStoreActions.idle}
    />
  );
};

export default CreatorErrorModalContainer;
