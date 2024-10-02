import React from 'react';
import type {
  DocumentRatingCategory,
  DocumentRatingDto,
  PermanentDocumentDto,
  PublicDocumentDto,
} from 'api-4markdown-contracts';
import { getAPI } from 'api-4markdown';

type DocumentRateState = {
  yourRate: null | DocumentRatingCategory;
  rating: DocumentRatingDto;
};

const useDocumentRateUpdate = (
  document: PublicDocumentDto | PermanentDocumentDto,
) => {
  const [state, setState] = React.useState<DocumentRateState>(() => ({
    yourRate: null,
    rating: document.rating,
  }));

  const updateRating = React.useCallback(
    (category: DocumentRatingCategory): void => {
      try {
        setState(({ rating, yourRate }) => {
          if (yourRate === null) {
            return {
              yourRate: category,
              rating: {
                ...rating,
                [category]: rating[category] + 1,
              },
            };
          }

          if (yourRate === category) {
            return {
              yourRate: null,
              rating: {
                ...rating,
                [category]: rating[category] - 1,
              },
            };
          }

          return {
            yourRate: category,
            rating: {
              ...rating,
              [category]: rating[category] + 1,
              [yourRate]: rating[yourRate] - 1,
            },
          };
        });

        getAPI().call(`rateDocument`)({
          category,
          documentId: document.id,
        });
      } catch {}
    },
    [document.id],
  );

  return {
    yourRate: state.yourRate,
    rating: state.rating,
    updateRating,
  };
};

export { useDocumentRateUpdate };
