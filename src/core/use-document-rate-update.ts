import React from 'react';
import type {
  API4MarkdownPayload,
  RatingCategory,
  RatingDto,
  PermanentDocumentDto,
  PublicDocumentDto,
} from 'api-4markdown-contracts';
import { getAPI } from 'api-4markdown';
import debounce from 'lodash.debounce';

type DocumentRateState = {
  yourRate: null | RatingCategory;
  rating: RatingDto;
};

const rateDocument = debounce(
  async (payload: API4MarkdownPayload<'rateDocument'>): Promise<void> => {
    try {
      await getAPI().call(`rateDocument`)(payload);
    } catch {}
  },
  2000,
);

const useDocumentRateUpdate = (
  document: PublicDocumentDto | PermanentDocumentDto,
) => {
  const [state, setState] = React.useState<DocumentRateState>(() => ({
    yourRate: null,
    rating: document.rating,
  }));

  const updateRating = React.useCallback(
    (category: RatingCategory): void => {
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

        rateDocument({
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
