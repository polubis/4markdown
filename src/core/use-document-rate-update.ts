import React from 'react';
import type {
  DocumentRatingCategory,
  PermanentDocumentDto,
  PublicDocumentDto,
} from 'api-4markdown-contracts';
import { authStoreSelectors } from 'store/auth/auth.store';

const useDocumentRateUpdate = (
  document: PublicDocumentDto | PermanentDocumentDto,
) => {
  const [rating, setRating] = React.useState(document.rating);

  const updateRating = React.useCallback(
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

  return {
    rating,
    updateRating,
  };
};

export { useDocumentRateUpdate };
