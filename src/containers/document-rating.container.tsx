import React from "react";
import { useDocumentLayoutContext } from "providers/document-layout.provider";
import { rateDocumentAct } from "acts/rate-document.act";
import throttle from "lodash.throttle";
import { Atoms } from "api-4markdown-contracts";
import { RatePicker } from "components/rate-picker";

type DocumentRatingContainerProps = {
  className?: string;
};

const rateDocument = throttle(rateDocumentAct, 5000);

const DocumentRatingContainer = ({
  className,
}: DocumentRatingContainerProps) => {
  const [{ document, yourRate }, setDocumentLayoutState] =
    useDocumentLayoutContext();

  const handleClick = async (
    category: Atoms["RatingCategory"],
  ): Promise<void> => {
    rateDocument({ documentId: document.id, category });
    setDocumentLayoutState(({ document, yourRate }) => {
      if (yourRate === null) {
        return {
          yourRate: category,
          document: {
            ...document,
            rating: {
              ...document.rating,
              [category]: document.rating[category] + 1,
            },
          },
        };
      }

      if (yourRate === category) {
        return {
          yourRate: null,
          document: {
            ...document,
            rating: {
              ...document.rating,
              [category]: document.rating[category] - 1,
            },
          },
        };
      }

      return {
        yourRate: category,
        document: {
          ...document,
          rating: {
            ...document.rating,
            [category]: document.rating[category] + 1,
            [yourRate]: document.rating[yourRate] - 1,
          },
        },
      };
    });
  };

  return (
    <RatePicker
      className={className}
      rating={document.rating}
      rate={yourRate}
      onRate={handleClick}
    />
  );
};

export { DocumentRatingContainer };
