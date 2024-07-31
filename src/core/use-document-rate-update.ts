import React from 'react';
import type {
  DocumentRatingCategory,
  PermanentDocumentDto,
  PublicDocumentDto,
} from 'api-4markdown-contracts';
import { authStoreSelectors } from 'store/auth/auth.store';
import { debounce } from 'lodash';

const useDocumentRateUpdate = (
  document: PublicDocumentDto | PermanentDocumentDto,
) => {
  const [rating, setRating] = React.useState(document.rating);

  const rateDocument = React.useCallback(
    async (category: DocumentRatingCategory) => {
      try {
        const rating = await authStoreSelectors.authorized().rateDocument({
          category,
          documentId: document.id,
        });
        setRating(rating);
      } catch {}
    },
    [document.id],
  );

  const updateRating = React.useCallback(debounce(rateDocument, 5000), [
    rateDocument,
  ]);

  React.useEffect(() => {
    return () => {
      updateRating.cancel();
    };
  }, [updateRating]);

  return {
    rating,
    updateRating,
  };
};

export { useDocumentRateUpdate };
