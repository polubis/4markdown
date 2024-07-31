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

  const updateRating = async (
    category: DocumentRatingCategory,
  ): Promise<void> => {
    try {
      const rating = await authStoreSelectors.authorized().rateDocument({
        category,
        documentId: document.id,
      });
      setRating(rating);
    } catch {}
  };

  return {
    rating,
    updateRating,
  };
};

export { useDocumentRateUpdate };
