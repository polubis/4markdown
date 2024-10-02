import React from 'react';
import type { DocumentRatingDto } from 'api-4markdown-contracts';
import { DOCUMENT_RATING_ICONS } from 'core/document-rating-config';

interface DocumentRatingStaticProps {
  rating: DocumentRatingDto;
  iconSize?: number;
}

const DocumentRatingStatic = ({
  rating,
  iconSize = 24,
}: DocumentRatingStaticProps) => {
  return (
    <section className="justify-end items-center flex mb-4 pr-1 h-10">
      <div className="flex space-x-2">
        {DOCUMENT_RATING_ICONS.map(([Icon, category]) => (
          <div
            className="relative p-1 text-black dark:text-white"
            key={category}
          >
            <Icon size={iconSize} />
            <strong className="absolute text-md -top-2 -right-1">
              {rating[category]}
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
};

export { DocumentRatingStatic };
